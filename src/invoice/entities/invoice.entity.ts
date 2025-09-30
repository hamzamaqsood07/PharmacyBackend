/* eslint-disable prettier/prettier */
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceMedicine } from './invoiceMedicine.entity';

export enum InvoiceStatus {
  INPROGRESS = 'inProgress',
  COMPLETED = 'completed',
}

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  discount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.INPROGRESS,
  })
  status: InvoiceStatus;

  @Column()
  grossTotal: number;

  @Column()
  netTotal: number;

  @Column({ nullable: true })
  cashPaid: number;

  @Column({ nullable: true })
  balance: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user: User;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  organization: Organization;

  @OneToMany(
    () => InvoiceMedicine,
    (invoiceMedicine) => invoiceMedicine.invoice,
  )
  invoiceMedicines: InvoiceMedicine[];
}
