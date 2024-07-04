import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body(ValidationPipe) credentials: SignUpDto) {
    await this.authService.signUp(credentials);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentials: SignInDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(credentials);
  }
}
