import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:
                config.get('ACCESS_TOKEN_SECRET') || 'access-token-secret',
        });
    }
    async validate(payload: any) {
        const { userId, sessionId } = payload;
        const session = await this.prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });
        if (!session) {
            throw new UnauthorizedException();
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return null;
        }
        const { password, ...details } = user;
        return details;
    }
}
