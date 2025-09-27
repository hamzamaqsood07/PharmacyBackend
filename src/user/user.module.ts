/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),InvoiceModule],
  controllers: [UserController],
  exports:[TypeOrmModule]
})
export class UserModule {}
