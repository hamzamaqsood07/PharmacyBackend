/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { payloadType } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: payloadType) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['organization'],
    });
    if (!user) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
