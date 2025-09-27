/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { payloadType } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        configService:ConfigService,
        @InjectRepository(User) private userRepository:Repository<User>
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey:configService.getOrThrow<string>('JWT_SECRET')
            secretOrKey: process.env.JWT_SECRET as string
        })
    }

    async validate(payload:payloadType){
        console.log(process.env.JWT_SECRET)
        const user = await this.userRepository.findOneBy({id:payload.sub})
        if(!user)  throw new NotFoundException()  
        return user
    }
}