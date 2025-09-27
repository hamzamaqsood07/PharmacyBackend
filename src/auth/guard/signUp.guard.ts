/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class SignUpGuard implements CanActivate{
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers["authorization"]
        return token === `Bearer ${process.env.SIGNUPTOKEN}`
    }
} 