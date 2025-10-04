import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async getOrganization(user: User) {
    return this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });
  }

  async updateOrganization(user: User, updateData: any) {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    Object.assign(organization, updateData);
    return this.organizationRepository.save(organization);
  }

  async uploadLogo(user: User, logoUrl: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    organization.logoUrl = logoUrl;
    return this.organizationRepository.save(organization);
  }

  async removeLogo(user: User) {
    const organization = await this.organizationRepository.findOne({
      where: { id: user.organization.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    organization.logoUrl = undefined;
    return this.organizationRepository.save(organization);
  }
}
