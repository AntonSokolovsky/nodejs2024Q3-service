import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignupDto) {
    return await this.authService.signup(signUpDto);
  }

  @Post('login')
  async login(@Body() logInDto: LoginDto) {
    return await this.authService.login(logInDto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshDto);
  }
}
