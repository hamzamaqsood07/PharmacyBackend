/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Medicine } from 'src/medicine/entities/medicine.entity';

@Entity()
export class InvoiceMedicine {
  @PrimaryColumn('uuid')
  invoiceId: string;

  @PrimaryColumn('uuid')
  medicineId: string;

  @ManyToOne(() => Invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @ManyToOne(() => Medicine, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;

  @Column()
  qty: number;

  @Column()
  salesPrice: number;

  @Column()
  purchasePrice: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updatedAt: Date;
}
