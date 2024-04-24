import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "../interfaces/jwt-payload.interface";

import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/user/entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    
    constructor(
        private prisma: PrismaService,
        private readonly configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {

        const { id } = payload;

        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {id},
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true
                }
            });
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        
        
    }


}