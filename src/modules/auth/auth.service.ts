import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  private jwtSecret = process.env.JWT_SECRET_KEY || 'secret';
  private jwtExpireTime = process.env.TOKEN_EXPIRE_TIME || '1h';

  async signup(dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        login: dto.login,
        password: hashedPassword,
      },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { login: dto.login },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, login: user.login };
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpireTime,
    });

    return { accessToken };
  }
}
