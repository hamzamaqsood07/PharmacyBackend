/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';

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
}
