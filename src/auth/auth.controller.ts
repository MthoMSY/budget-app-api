import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiVersion } from 'src/common/api-version.enum';

@Controller(`${ApiVersion.V1}/auth`)
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

  @Post('/reset-password')
  async resetPassword(@Body(ValidationPipe) credentials: ResetPasswordDto) {
    await this.authService.resetPassword(credentials);
  }
}
