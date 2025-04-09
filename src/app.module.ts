import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reservation/reservation.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
    imports: [
        AuthModule,
        PrismaModule,
        UserModule,
        ReservationModule,
        RestaurantModule,
        CuisineModule,
        CronModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
