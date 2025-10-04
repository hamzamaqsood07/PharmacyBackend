/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { CreateMedicineDto } from './dto/createMedicine.dto';
import { UpdateMedicineDto } from './dto/updateMedicine.dto';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getMedicine(
    @Query('name') name: string,
    @Req() req:Request
  ) {
    return this.medicineService.getMedicine(name,req.user as User);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createMedicine(
    @Body() createMedicineDto:CreateMedicineDto,
    @Req() req:Request
  ) {
    return this.medicineService.createMedicine(createMedicineDto,req.user as User);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  updateMedicine(
    @Param("id") id:string,
    @Body() updateMedicineDto:UpdateMedicineDto,
    @Req() req:Request
  ) {
    return this.medicineService.updateMedicine(updateMedicineDto,id,req.user as User);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("incrementQty/:id")
  incrementMedicine(
    @Param("id") id:string,
    @Body("packQty") packQty:number,
    @Req() req:Request
  ) {
    return this.medicineService.incrementMedicine(id,packQty,req.user as User);
  }
}
