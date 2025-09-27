/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceMedicine } from './entities/invoiceMedicine.entity';
import { OrganizationModule } from 'src/organization/organization.module';
import { UserModule } from 'src/user/user.module';
import { MedicineModule } from 'src/medicine/medicine.module';

@Module({
  imports:[TypeOrmModule.forFeature([Invoice,InvoiceMedicine]),OrganizationModule,UserModule,MedicineModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports:[TypeOrmModule]
})
export class InvoiceModule {}
