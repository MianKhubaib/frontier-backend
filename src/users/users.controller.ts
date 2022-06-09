import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/all')
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.usersService.deleteById(+id);
  }
}
