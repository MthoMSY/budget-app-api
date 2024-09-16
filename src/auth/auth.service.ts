import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth-credentials.dto';
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

  async signIn(
    request: SignInDto,
  ): Promise<{ username: string; accessToken: string; userId: string }> {
    this.logger.log(`Received sign in request for user ${request.username}`);
    const user = await this.userRepository.validateUserPassword(request);

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ username: user.username });

    return { username: user.username, accessToken, userId: user.id };
  }

  async resetPassword(request: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.resetPassword(request);
    if (user === null) {
      throw new NotFoundException('User not found');
    }
  }
}
