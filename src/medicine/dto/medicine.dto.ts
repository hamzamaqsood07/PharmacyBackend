/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from "class-validator"

export class MedicineDto {
    @IsString()
    name:string

    @IsNumber()
    salesPrice:number

    @IsNumber()
    purchasePrice:number

    @IsNumber()
    packSize:number
}
