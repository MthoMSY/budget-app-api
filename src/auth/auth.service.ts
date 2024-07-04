import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(request: SignUpDto): Promise<void> {
    await this.userRepository.signUp(request);
  }

  async signIn(request: SignInDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(request);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.sign({ username });

    return { accessToken };
  }
}
