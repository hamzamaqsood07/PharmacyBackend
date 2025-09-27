/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User} from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class AuthService {

  constructor(@InjectRepository(User) private userRepository:Repository<User>,
  @InjectRepository(Organization) private orgRepository:Repository<Organization>,
  private jwtService:JwtService
  ){}

  async signUpUser(signUpUserDto:SignUpUserDto){
    const user = await this.userRepository.findOneBy({email:signUpUserDto.email});
    if(user){
      throw new ConflictException('User already exists');
    }
    const org =  this.orgRepository.create({orgTitle:signUpUserDto.orgTitle})
    const savedOrg = await this.orgRepository.save(org)
    if(!savedOrg) throw new Error("Failed to create Organization")
        
    const password = signUpUserDto.password
    const hashedPassword = await bcrypt.hash(password,10) ;
    const newUser = this.userRepository.create({...signUpUserDto, password:hashedPassword,organization:org});

    const savedUser = await this.userRepository.save(newUser);
    if(!savedUser){
      throw new Error('Failed to create user');
    }
    const payload = { sub:newUser.id }
    return this.jwtService.signAsync(payload);
  }

  async loginUser(loginUserDto:LoginUserDto){
    const user = await this.userRepository.findOneBy({email:loginUserDto.email});
    if(!user){
      throw new Error('Invalid email or password');
    }
    const isValidPassword = await bcrypt.compare(loginUserDto.password,user.password)
    if(!isValidPassword){
      throw new Error('Invalid email or password');
    }

    return this.jwtService.sign({ sub:user.id });
  }

}