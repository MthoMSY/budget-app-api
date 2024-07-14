import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto, SignUpDto } from './dto/auth-credentials.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as encrypt from 'bcrypt';

const DUPLICATE_KEY_ERROR_CODE = '23505';

export class UserRepository extends Repository<User> {
  private logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async signUp(request: SignUpDto) {
    try {
      const encryptionData = await this.hashPassword(request.password);

      await this.userRepository.save({
        ...request,
        password: encryptionData.hash,
        salt: encryptionData.salt,
      });
    } catch (error) {
      if (error.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new BadRequestException(
          `User with username '${request.username}' already exists`,
        );
      }

      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = await encrypt.genSalt();
    const hashedPassword = await encrypt.hash(password, salt);
    return { hash: hashedPassword, salt };
  }

  async validateUserPassword(credentials: SignInDto): Promise<string | null> {
    this.logger.debug(
      `Validating user password for user ${credentials.username}`,
    );
    const { username, password } = credentials;

    const user = await this.findOne({ where: { username } });
    if (user) {
      const isValidPassword = await user.isValidPassword(password);
      return isValidPassword ? username : null;
    }

    return null;
  }
}
