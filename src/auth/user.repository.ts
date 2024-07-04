import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as encrypt from 'bcrypt';

const DUPLICATE_KEY_ERROR_CODE = '23505';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async signUp(request: AuthCredentialsDto) {
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

  async validateUserPassword(
    credentials: AuthCredentialsDto,
  ): Promise<string | null> {
    const { username, password } = credentials;

    const user = await this.findOne({ where: { username } });

    if (user && user.validatePassword(password)) {
      return user.username;
    }

    return null;
  }
}
