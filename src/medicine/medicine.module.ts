/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { MedicineController } from './medicine.controller';
import { OrganizationModule } from 'src/organization/organization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Medicine]),OrganizationModule],
  controllers: [MedicineController],
  providers: [MedicineService],
  exports: [TypeOrmModule]
})
export class MedicineModule {}
