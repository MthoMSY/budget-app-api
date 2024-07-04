import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signUp')
  async signUp(@Body(ValidationPipe) credentials: AuthCredentialsDto) {
    await this.authService.signUp(credentials);
  }

  @Post('/signIn')
  async signIn(@Body(ValidationPipe) credentials: AuthCredentialsDto) {
    return await this.authService.signIn(credentials);
  }
}
