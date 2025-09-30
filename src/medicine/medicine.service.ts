/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MedicineDto } from './dto/medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {}

  async getMedicine(name: string | null, reqUser: User) {
    const query = this.medicineRepository
      .createQueryBuilder('medicine')
      .where('medicine.organizationId = :orgId', {
        orgId: reqUser.organization.id,
      })
      .orderBy('medicine.createdAt', 'DESC');

    if (name) {
      query.andWhere('medicine.name ILIKE :name', { name: `%${name}%` });
    }

    const medicines = await query.getMany();
    return medicines;
  }

  async createMedicine(createMedicineDto: MedicineDto, reqUser: User) {
    const medicine = this.medicineRepository.create({
      ...createMedicineDto,
      organization: { id: reqUser.organization.id },
    });

    const savedMedicine = await this.medicineRepository.save(medicine);
    return {
      messge: `Medicine ${savedMedicine.name} has been saved successfully`,
    };
  }

  async updateMedicine(medicineDto: MedicineDto, id: string, reqUser: User) {
    const medicine = await this.medicineRepository.findOneBy({
      id,
      organization: { id: reqUser.organization.id },
    });
    if (!medicine)
      throw new NotFoundException(`Medicine with ID ${id} not found`);

    Object.assign(medicine, medicineDto);
    await this.medicineRepository.save(medicine);
    return { message: `Medicine updated Successfully` };
  }

  async incrementMedicine(id: string, packQty: number, reqUser: User) {
    const medicine = await this.medicineRepository.findOneBy({
      id,
      organization: { id: reqUser.organization.id },
    });
    if (!medicine)
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    const incrementSize = medicine.packSize * packQty;
    medicine.qty += incrementSize;
    await this.medicineRepository.save(medicine);
    return {
      message: `Medicine ${medicine.name} is incremented by ${incrementSize}`,
    };
  }
}
