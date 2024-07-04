import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(request: SignUpDto): Promise<void> {
    await this.userRepository.signUp(request);
  }

  async signIn(request: SignInDto): Promise<string | null> {
    const result = await this.userRepository.validateUserPassword(request);

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return result;
  }
}
