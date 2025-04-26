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
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiQuery,
  } from '@nestjs/swagger';
  import { UserService } from './user.service';
  import { GetUser } from 'src/auth/decorator';
  import { User } from '@prisma/client';
  import { JwtGuard } from 'src/auth/guard';
  
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(private userService: UserService) {}
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Returns the user info' })
    getMe(@GetUser() user: User) {
      return user;
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Get('me/reservations')
    @ApiOperation({ summary: 'Get current user reservations' })
    getMyReservations(@GetUser('id') id: number) {
      return this.userService.myReservations(id);
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Get('me/restaurants')
    @ApiOperation({ summary: 'Get restaurants owned by current user' })
    getMyRestaurants(@GetUser('id') id: number) {
      return this.userService.myRestaurants(id);
    }
  
    @Get()
    @ApiOperation({ summary: 'List all users' })
    @ApiQuery({ name: 'role', required: false, type: String })
    @ApiQuery({ name: 'verified', required: false, type: Boolean })
    findAll(@Query() query: any) {
      return this.userService.findAll(query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id') id: string) {
      return this.userService.findOne(+id);
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Patch('me')
    @ApiOperation({ summary: 'Update your name' })
    @ApiBody({ schema: { type: 'object', properties: { fullname: { type: 'string' } } } })
    update(@GetUser('id') id: number, @Body('fullname') name: string) {
      return this.userService.update(id, name);
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Patch('me/change-password')
    @ApiOperation({ summary: 'Change your password' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          oldPassword: { type: 'string' },
          newPassword: { type: 'string' },
        },
      },
    })
    changePassword(
      @GetUser('id') id: number,
      @Body('oldPassword') oldPassword: string,
      @Body('newPassword') newPassword: string,
    ) {
      return this.userService.changePassword(id, oldPassword, newPassword);
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Delete('me')
    @ApiOperation({ summary: 'Delete your user account' })
    remove(@GetUser('id') id: number) {
      return this.userService.remove(id);
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Post('resend-otp')
    @ApiOperation({ summary: 'Resend email verification OTP' })
    resendOtp(@GetUser() user: User) {
      return this.userService.sendOtpToEmail(user);
    }
  
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Post('verify')
    @ApiOperation({ summary: 'Verify email with OTP' })
    @ApiBody({ schema: { type: 'object', properties: { otp: { type: 'string' } } } })
    verifyEmail(@GetUser() user: User, @Body('otp') otp: string) {
      return this.userService.verifyEmail(otp, user);
    }
  } 
