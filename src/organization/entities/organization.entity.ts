/* eslint-disable prettier/prettier */
import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn,Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    orgTitle:string
 
    @Column({type:"timestamp",default:()=>"NOW()"})
    createdAt:Date

    @Column({type:'timestamp',default:()=>"NOW()",onUpdate:"NOW()"})
    updatedAt:Date
    
    @OneToMany(()=>User,user=>user.organization)
    users:Promise<User[]>
} 