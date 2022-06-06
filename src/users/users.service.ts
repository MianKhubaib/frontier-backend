import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      const user = User.create({
        email: createUserDto.email,
        password: createUserDto.password,
      });
      await user.save();
      delete user.password;
      return user;
    } catch (err) {
      throw new BadRequestException('Email Should be Unique');
    }
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);
    delete user.password;
    return user;
  }

  async findById(id: number): Promise<User> {
    return await User.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}
