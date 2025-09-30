/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { CanActivate, ExecutionContext } from "@nestjs/common";
import {Request} from "express";
import { Observable } from "rxjs";

export class SignUpGuard implements CanActivate{
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const token = request.headers["authorization"]
        return token === `Bearer ${process.env.SIGNUP_TOKEN}`
    }
} 