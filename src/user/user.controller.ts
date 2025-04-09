import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @UseGuards(JwtGuard)
    @Get('me/reservations')
    getMyReservations(@GetUser('id') id: number) {
        return this.userService.myReservations(id);
    }

    @UseGuards(JwtGuard)
    @Get('me/restaurants')
    getMyRestaurants(@GetUser('id') id: number) {
        return this.userService.myRestaurants(id);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @UseGuards(JwtGuard)
    @Patch('me')
    update(@GetUser('id') id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @UseGuards(JwtGuard)
    @Delete('me')
    remove(@GetUser('id') id: number) {
        return this.userService.remove(id);
    }

    @UseGuards(JwtGuard)
    @Post('resend-otp')
    resendOtp(@GetUser() user: User) {
        return this.userService.sendOtpToEmail(user);
    }

    @UseGuards(JwtGuard)
    @Post('verify')
    verifyEmail(@GetUser('email') email: string, @Body('otp') otp: string) {
        return this.userService.verifyEmail(otp, email);
    }
}
