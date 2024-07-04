import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(request: AuthCredentialsDto): Promise<void> {
    await this.userRepository.signUp(request);
  }

  async signIn(request: AuthCredentialsDto): Promise<string | null> {
    const result = await this.userRepository.validateUserPassword(request);

    if (!result) {
      throw new UnauthorizedException();
    }

    return result;
  }
}
