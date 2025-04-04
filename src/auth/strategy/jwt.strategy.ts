import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') || 'jwt-secret',
    });
  }
  async validate(payload: any) {
    const { email, id } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        id,
      },
    });
    if (!user) {
      return null;
    }
    const { password, ...details } = user;
    return details;
  }
}
