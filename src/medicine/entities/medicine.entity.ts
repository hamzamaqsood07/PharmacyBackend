/* eslint-disable prettier/prettier */
import { Organization } from "src/organization/entities/organization.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Medicine {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    name:string

    @Column({default:0})
    qty:number

    @Column()
    salesPrice:number

    @Column()
    purchasePrice:number

    @Column()
    packSize:number

    @Column({type:'timestamp',default:()=>"NOW()"})
    createdAt:Date

    @Column({type:'timestamp',default:()=>"NOW()",onUpdate:"NOW()"})
    updatedAt:Date

    @ManyToOne(()=>Organization,{cascade:true,onDelete:"CASCADE"})
    organization:Organization
}
