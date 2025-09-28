/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {}

  async getMedicine(name: string, reqUser: User) {
    const medicine = await this.medicineRepository.find({
      where: {
        organization: {id:reqUser.organization.id},
        name: ILike(`%${name}%`),
      },
    });

    if (medicine.length === 0)
      throw new NotFoundException(`Medicine ${name} is not available`);

    return medicine;
  }

  async createMedicine(createMedicineDto:CreateMedicineDto,reqUser: User){
    const medicine =  this.medicineRepository.create({...createMedicineDto,organization:{id:reqUser.organization.id}})

    const savedMedicine = await this.medicineRepository.save(medicine)
    return `Medicine ${savedMedicine.name} has been saved successfully`
  }
}
