import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../jwt.strategy';
import { UserRepository } from '../user.repository';
import { ConfigService } from '@nestjs/config';
import { User } from '../user.entity';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: jest.Mocked<UserRepository>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('test'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get(UserRepository);
    configService = module.get(ConfigService);
  });

  describe('validate', () => {
    it('should return a user when username is found', async () => {
      const mockUser = { username: 'testuser' } as User;
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await jwtStrategy.validate({ username: 'testuser' });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        jwtStrategy.validate({ username: 'testuser' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });
  });

  describe('constructor', () => {
    it('should use the correct JWT secret from ConfigService', () => {
      const mockJwtSecret = 'test-secret';
      configService.getOrThrow.mockReturnValue(mockJwtSecret);

      new JwtStrategy(userRepository, configService);

      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
