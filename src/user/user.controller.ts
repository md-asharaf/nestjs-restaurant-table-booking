import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Patch()
  updateUser(@GetUser('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }
}
