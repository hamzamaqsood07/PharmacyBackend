/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./invoice.entity";
import { Medicine } from "src/medicine/entities/medicine.entity";

@Entity()
export class InvoiceMedicine {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    qty:number

    @Column()
    salesPrice:number

    @Column()
    purchasePrice:number

    @ManyToOne(()=>Invoice)
    invoice:Invoice

    @ManyToOne(()=>Medicine)
    medicine:Medicine

    @Column({type:'timestamp',default:()=>"NOW()"})
    createdAt:Date

    @Column({type:'timestamp',default:()=>"NOW()",onUpdate:"NOW()"})
    updatedAt:Date
}
