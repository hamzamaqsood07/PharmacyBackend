/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { MedicineDto } from './dto/medicine.dto';

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
    @Body() createMedicineDto:MedicineDto,
    @Req() req:Request
  ) {
    return this.medicineService.createMedicine(createMedicineDto,req.user as User);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  updateMedicine(
    @Param("id") id:string,
    @Body() medicineDto:MedicineDto,
    @Req() req:Request
  ) {
    return this.medicineService.updateMedicine(medicineDto,id,req.user as User);
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
