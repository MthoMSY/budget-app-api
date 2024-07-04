import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signUp')
  signUp(@Body() credentials: AuthCredentialsDto) {
    this.authService.signUp(credentials);
  }
}
