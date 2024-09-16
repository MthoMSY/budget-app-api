import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import {
  SignUpDto,
  SignInDto,
  ResetPasswordDto,
} from '../dto/auth-credentials.dto';
import { BadRequestException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Budget } from '../../budget/entity/budget.entity';
import { Item } from '../../budget/entity/item.entity';
import { DataSource } from 'typeorm';
import { dropTables } from '../../test__utils/utils';

describe(UserRepository.name, () => {
  let userRepository: UserRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.test'] }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [User, Budget, Item],
            synchronize: configService.get('DB_SYNCHRONIZE'),
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserRepository],
    }).compile();

    dataSource = module.get(DataSource);
    userRepository = module.get<UserRepository>(UserRepository);

    await dataSource.query('DROP TABLE IF EXISTS "user" CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "budget" CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "item" CASCADE');

    // Recreate tables
    await dropTables(dataSource);
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dropTables(dataSource);
    await dataSource.destroy();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'TestPassword123!',
      };

      await expect(userRepository.signUp(signUpDto)).resolves.not.toThrow();

      const user = await userRepository.findOne({
        where: { username: signUpDto.username.toLowerCase() },
      });
      expect(user).toBeDefined();
      expect(user.username).toBe(signUpDto.username.toLowerCase());
    });

    it('should throw BadRequestException for duplicate username', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'TestPassword123!',
      };

      await userRepository.signUp(signUpDto);

      await expect(userRepository.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateUserPassword', () => {
    it('should return user for valid credentials', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'TestPassword123!',
      };
      await userRepository.signUp(signUpDto);

      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'TestPassword123!',
      };

      const user = await userRepository.validateUserPassword(signInDto);
      expect(user).toBeDefined();
      expect(user.username).toBe(signInDto.username.toLowerCase());
    });

    it('should return null for invalid password', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'TestPassword123!',
      };
      await userRepository.signUp(signUpDto);

      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'WrongPassword123!',
      };

      const user = await userRepository.validateUserPassword(signInDto);
      expect(user).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      const signInDto: SignInDto = {
        username: 'nonexistentuser',
        password: 'TestPassword123!',
      };

      const user = await userRepository.validateUserPassword(signInDto);
      expect(user).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password for existing user', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'TestPassword123!',
      };
      await userRepository.signUp(signUpDto);

      const resetPasswordDto: ResetPasswordDto = {
        username: 'testuser',
        password: 'NewPassword456!',
      };

      const user = await userRepository.resetPassword(resetPasswordDto);
      expect(user).toBeDefined();

      // Verify that the new password works
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'NewPassword456!',
      };
      const validatedUser =
        await userRepository.validateUserPassword(signInDto);
      expect(validatedUser).toBeDefined();
    });

    it('should return null for non-existent user', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        username: 'nonexistentuser',
        password: 'NewPassword456!',
      };

      const user = await userRepository.resetPassword(resetPasswordDto);
      expect(user).toBeNull();
    });
  });
});
