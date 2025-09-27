/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class SignUpUserDto{
    @IsString()
    @IsNotEmpty()
    firstName:string;
    
    @IsString()
    @IsNotEmpty()
    lastName:string;

    @IsString()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    orgTitle:string;

}