import { genSaltSync, hashSync, compare } from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Model } from 'mongoose';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

type FoundEntity<Func extends (...args: any[]) => Promise<unknown>> = Exclude<
  Awaited<ReturnType<Func>>,
  null
>;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  createUser(dto: AuthDto) {
    const salt = genSaltSync(10);

    const user = new this.userModel({
      email: dto.login,
      passwordHash: hashSync(dto.password, salt),
    });

    return user.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  validateUser = async (
    user: FoundEntity<typeof this.findUser>,
    dto: AuthDto,
  ) => {
    const passwordEquals = await compare(dto.password, user.passwordHash);

    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException(WRONG_PASSWORD);
  };

  login = async (user: FoundEntity<typeof this.findUser>, dto: AuthDto) => {
    await this.validateUser(user, dto);

    return this.generateToken(user);
  };

  generateToken = async (user: FoundEntity<typeof this.findUser>) => {
    const payload = { email: user.email, id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  };
}
