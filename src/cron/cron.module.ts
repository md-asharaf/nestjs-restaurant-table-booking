import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [EmailModule],
    providers: [CronService],
})
export class CronModule {}
