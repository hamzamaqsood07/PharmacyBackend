/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from "class-validator"

/* eslint-disable prettier/prettier */
export class CreateMedicineDto {
    @IsString()
    name:string

    @IsNumber()
    salesPrice:number

    @IsNumber()
    purchasePrice:number

    @IsNumber()
    packSize:number
}
