import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { USER_ALREADY_EXISTS, USER_NOT_EXISTS } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);

    if (oldUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }
    const created = await this.authService.createUser(dto);

    return Object.assign(created, { passwordHash: undefined });
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.findUser(dto.login);

    if (!user) {
      throw new BadRequestException(USER_NOT_EXISTS);
    }

    return this.authService.login(user, dto);
  }
}
