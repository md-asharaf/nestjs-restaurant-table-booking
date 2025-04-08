import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('auth-jwt') {
    constructor() {
        super();
    }
}
