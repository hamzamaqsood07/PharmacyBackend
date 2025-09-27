/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import type{  Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpGuard } from './guard/signUp.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //To register user and return JWT token in header
  @UseGuards(SignUpGuard)
  @Post('signup')
  async signup(
    @Body() signUpUserDto: SignUpUserDto,
    @Res() res: Response
  ) {
    const token = await this.authService.signUpUser(signUpUserDto);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(201).send({ message: 'User registered successfully' });
  }


  //To login user and return JWT token in header
  @Post('login')
  async login(
    @Body() loginUserDto:LoginUserDto,
    @Res() res: Response
  ){
    const token = await this.authService.loginUser(loginUserDto);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(201).send({ message: 'User LoggedIn successfully' });
  }

}
 