/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    UserModule,
    JwtModule.register(({
      global: true,
      secret: process.env.JWT_SECRET ,
      signOptions:{
        expiresIn: '1y'
      }
    })),
    OrganizationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
