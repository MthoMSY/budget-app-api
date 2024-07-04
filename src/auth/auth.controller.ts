import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signUp')
  async signUp(@Body() credentials: AuthCredentialsDto) {
    await this.authService.signUp(credentials);
  }
}
