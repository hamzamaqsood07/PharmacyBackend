/* eslint-disable prettier/prettier */
import { Invoice } from "src/invoice/entities/invoice.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { PrimaryGeneratedColumn,Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({type:'timestamp',default:()=>"NOW()"})
    createdAt:Date

    @Column({type:'timestamp',default:()=>"NOW()",onUpdate:"NOW()"})
    updatedAt:Date

    @OneToOne(()=>Invoice)
    activeInvoice:Invoice

    @ManyToOne(()=>Organization,(organization)=>organization.users,{onDelete:"CASCADE"})
    organization:Organization

} 