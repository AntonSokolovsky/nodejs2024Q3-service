import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  private cryptSalt = Number(process.env.CRYPT_SALT);
  private jwtSecret = process.env.JWT_SECRET_KEY;
  private jwtRefreshSecret = process.env.JWT_SECRET_REFRESH_KEY;
  private tokenExpireTime = process.env.TOKEN_EXPIRE_TIME;
  private tokenRefreshExpireTime = process.env.TOKEN_REFRESH_EXPIRE_TIME;
  async signup(signUpDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(
      signUpDto.password,
      this.cryptSalt,
    );
    const user = await this.prisma.user.create({
      data: { login: signUpDto.login, password: hashedPassword },
    });
    const { id, login } = user;
    const tokens = await this.getToken(id, login);
    return { id, ...tokens };
  }

  async login(logInDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { login: logInDto.login },
    });
    if (!user || !(await bcrypt.compare(logInDto.password, user.password))) {
      throw new HttpException('Wrong login or password', HttpStatus.FORBIDDEN);
    }

    return await this.getToken(user.id, user.login);
  }

  async refresh(refreshDto: RefreshTokenDto) {
    if (!refreshDto.refreshToken) {
      throw new HttpException(
        'No refreshToken in body',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload = await this.jwt.verifyAsync(refreshDto.refreshToken, {
        secret: this.jwtRefreshSecret,
      });

      const tokens = await this.getToken(payload.userId, payload.login);
      return tokens;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }

  async getToken(userId: string, login: string) {
    const payload = { userId, login };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: this.tokenExpireTime,
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.tokenRefreshExpireTime,
      }),
    };
  }
}
