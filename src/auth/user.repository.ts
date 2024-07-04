import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

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
      await this.userRepository.save({ ...request });
    } catch (error) {
      if (error.code === DUPLICATE_KEY_ERROR_CODE)
        throw new BadRequestException(
          `User with username '${request.username}' already exists`,
        );

      throw new InternalServerErrorException();
    }
  }
}
