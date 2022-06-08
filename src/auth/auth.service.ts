import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);
    const payload = {
      userId: user.id,
    };
    delete user.password;
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { email, password } = authLoginDto;
    const user = await this.usersService.findByEmail(email);
    if (!(await user?.validatePassword(password))) {
      throw new BadRequestException('Email/Password is incorrect');
    }

    return user;
  }
}
