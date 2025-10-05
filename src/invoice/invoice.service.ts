/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceMedicine } from './entities/invoiceMedicine.entity';
import { Medicine } from 'src/medicine/entities/medicine.entity';
import { User } from 'src/user/entities/user.entity';
import { InvoiceStatus } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceMedicine)
    private invoiceMedicineRepo: Repository<InvoiceMedicine>,
    @InjectRepository(Medicine) private medicineRepo: Repository<Medicine>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async addItemToInvoice(user: User, medicineId: string, qty: number) {
    let invoice = await this.getCurrentInvoice(user);

    // If no active invoice, create one
    if (!invoice) {
      invoice = this.invoiceRepo.create({
        discount: 0,
        grossTotal: 0,
        netTotal: 0,
        organization: user.organization,
        user,
      });
      await this.invoiceRepo.save(invoice);
      await this.userRepo.save({ id: user.id, activeInvoice: invoice });
    }

    const medicine = await this.medicineRepo.findOne({
      where: { id: medicineId },
    });
    if (!medicine) throw new NotFoundException('Medicine not found');

    // Check existing line item
    let invoiceMedicine = await this.invoiceMedicineRepo.findOne({
      where: { invoiceId: invoice.id, medicineId },
    });

    const existingQty = invoiceMedicine ? invoiceMedicine.qty : 0;
    const totalRequestedQty = existingQty + qty;

    // Check stock availability
    if (totalRequestedQty > medicine.qty) {
      throw new BadRequestException(
        `Not enough stock for ${medicine.name}. Available: ${medicine.qty}, Requested: ${totalRequestedQty}`,
      );
    }

    if (invoiceMedicine) {
      invoiceMedicine.qty = totalRequestedQty;
    } else {
      invoiceMedicine = this.invoiceMedicineRepo.create({
        invoiceId: invoice.id,
        medicineId,
        qty,
        salesPrice: medicine.salesPrice/medicine.packSize,
        purchasePrice: medicine.purchasePrice/medicine.packSize,
      });
    }

    await this.invoiceMedicineRepo.save(invoiceMedicine);

    // Recalculate totals (better than incrementing — avoids drift)
    const items = await this.invoiceMedicineRepo.find({
      where: { invoiceId: invoice.id },
    });
    const grossTotal = items.reduce(
      (sum, item) => sum + item.salesPrice * item.qty,
      0,
    );

    invoice.grossTotal = grossTotal;
    invoice.netTotal = grossTotal - invoice.discount;
    invoice.invoiceMedicines = items;
    const updatedInvoice = await this.invoiceRepo.save(invoice);

    return { updatedInvoice };
  }

  async removeItemFromInvoice(user: User, medicineId: string) {
    const invoice = await this.getCurrentInvoice(user);
    if (!invoice) throw new NotFoundException('No active invoice');

    const item = await this.invoiceMedicineRepo.findOne({
      where: { invoiceId: invoice.id, medicineId },
    });
    if (!item) throw new NotFoundException('Item not found in invoice');

    // Update totals before removing
    invoice.grossTotal -= item.salesPrice * item.qty;
    invoice.netTotal = invoice.grossTotal - invoice.discount;
    await this.invoiceRepo.save(invoice);

    const updatedInvoice = await this.invoiceMedicineRepo.remove(item);
    return { message: 'Item removed', updatedInvoice };
  }

  async updateItemQuantityInInvoice(
    user: User,
    medicineId: string,
    qty: number,
  ) {
    const invoice = await this.getCurrentInvoice(user);
    if (!invoice) throw new NotFoundException('No active invoice');

    const item = await this.invoiceMedicineRepo.findOne({
      where: { invoiceId: invoice.id, medicineId },
    });
    if (!item) throw new NotFoundException('Item not found');

    // Adjust invoice totals based on qty difference
    const diff = qty - item.qty;
    invoice.grossTotal += item.salesPrice * diff;
    invoice.netTotal = invoice.grossTotal - invoice.discount;

    item.qty = qty;

    await this.invoiceMedicineRepo.save(item);
    const updatedInvoice = await this.invoiceRepo.save(invoice);

    return { updatedInvoice };
  }

    async finalizeInvoice(
      user: User,
      cashPaid: number,
      discountedPercentage = 0,
    ) {
      const invoice = await this.getCurrentInvoice(user);
      if (!invoice) throw new NotFoundException('No active invoice');

      // Load items for discount & stock calculations
      const items = await this.invoiceMedicineRepo.find({
        where: { invoiceId: invoice.id },
        relations: ['medicine'],
      });

      // Recalculate gross total from items
      const grossTotal = items.reduce(
        (sum, item) => sum + item.salesPrice * item.qty,
        0,
      );

      // Calculate discount
      const discountAmount = (grossTotal * discountedPercentage) / 100;
      const netTotal = grossTotal - discountAmount;

      // Calculate total cost to ensure profit isn't negative
      const totalCost = items.reduce(
        (sum, item) => sum + item.purchasePrice * item.qty,
        0,
      );
      if (cashPaid < netTotal) {
        throw new BadRequestException(
          `Cash paid (${cashPaid}) must be at least equal to net total (${netTotal}).`,
        );
      }

      const profitAfterDiscount = netTotal - totalCost;
      if (profitAfterDiscount <= 0) {
        throw new BadRequestException(
          `Discount too high. It would make your profit zero or negative.`,
        );
      }

      // Save invoice
      invoice.grossTotal = grossTotal;
      invoice.discount = discountAmount;
      invoice.netTotal = netTotal;
      invoice.cashPaid = cashPaid;
      invoice.balance = netTotal - cashPaid;
      invoice.status = InvoiceStatus.COMPLETED;

      const updatedInvoice = await this.invoiceRepo.save(invoice);

      // Deduct medicine stock
      for (const item of items) {
        await this.medicineRepo.decrement(
          { id: item.medicineId },
          'qty',
          item.qty,
        );
      }

      // Clear user's active invoice
      await this.userRepo.save({ id: user.id, activeInvoice: null });

      return { message: 'Invoice finalized', updatedInvoice };
    }

  async getAllInvoices(user: User) {
    return this.invoiceRepo.find({
      where: { organization: { id: user.organization.id } },
      order: { createdAt: 'DESC' },
      relations: ['invoiceMedicines', 'invoiceMedicines.medicine'],
    });
  }

  async getCurrentInvoice(user: User) {
    if (!user.activeInvoiceId) return null;
    return this.invoiceRepo.findOne({
      where: {
        organization: { id: user.organization.id },
        id: user.activeInvoiceId,
      },
      relations: [
        'organization',
        'user',
        'invoiceMedicines',
        'invoiceMedicines.medicine',
      ],
    });
  }

  async discardCurrentInvoice(user: User) {
    const invoice = await this.getCurrentInvoice(user);
    if (!invoice) {
      throw new NotFoundException('No active invoice to discard');
    }

    // Optionally, delete invoice medicine items first to keep DB clean
    await this.invoiceMedicineRepo.delete({ invoiceId: invoice.id });

    // Then delete the invoice itself
    await this.invoiceRepo.delete(invoice.id);

    // Clear user's active invoice reference
    await this.userRepo.save({ id: user.id, activeInvoice: null });

    return { message: 'Current invoice discarded successfully' };
  }
}
