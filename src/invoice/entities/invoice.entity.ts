/* eslint-disable prettier/prettier */
import { Organization } from "src/organization/entities/organization.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum Status {
    INPROGRESS="inProgress",
    COMPLETED="completed"
}

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    discount:number

    @Column({type:"enum",enum:Status,default:Status.INPROGRESS})
    status:Status

    @Column()
    grossTotal:number

    @Column()
    netTotal:number

    @Column({nullable:true})
    CashPaid:number

    @Column({nullable:true})
    balance:number

    @Column({type:'timestamp',default:()=>"NOW()"})
    createdAt:Date

    @Column({type:'timestamp',default:()=>"NOW()",onUpdate:"NOW()"})
    updatedAt:Date

    @ManyToOne(()=>User,{onDelete:"SET NULL",nullable:true})
    user:User

    @ManyToOne(()=>Organization,{onDelete:"CASCADE"})
    organization:Organization
}
