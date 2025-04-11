import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [EmailModule],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
