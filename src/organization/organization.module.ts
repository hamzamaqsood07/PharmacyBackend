/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports:[TypeOrmModule]
})
export class OrganizationModule {}
