import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(request: SignUpDto): Promise<void> {
    await this.userRepository.signUp(request);
  }

  async signIn(request: SignInDto): Promise<{ accessToken: string }> {
    this.logger.log(`Received sign in request for user ${request.username}`);
    const username = await this.userRepository.validateUserPassword(request);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ username });

    return { accessToken };
  }
}
