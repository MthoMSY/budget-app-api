import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import { AutoMocker } from 'automocker';

describe(AuthService.name, () => {
  const automocker = AutoMocker.createJestMocker(jest);
  let service: AuthService;
  const userRepository = automocker.createMockInstance(UserRepository);
  const jwtService = automocker.createMockInstance(JwtService);
  const request = { username: 'test', password: 'test#5' };

  beforeEach(async () => {
    jest.resetAllMocks();

    service = new AuthService(userRepository, jwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should call user repository sign up with correct arguments', async () => {
      userRepository.validateUserPassword.mockResolvedValue(request);
      await service.signUp(request);

      expect(userRepository.signUp).toHaveBeenCalledWith(request);
    });
  });

  describe('signIn', () => {
    it('should call user repository validateUserPassword with correct arguments and validate password', async () => {
      userRepository.validateUserPassword.mockResolvedValue(request);
      await service.signIn(request);

      expect(userRepository.validateUserPassword).toHaveBeenCalledWith(request);
    });

    it('should throw exception if value returned by repository is null', async () => {
      userRepository.validateUserPassword.mockResolvedValue(null);

      await expect(() => service.signIn(request)).rejects.toThrow();
    });
    it('should call jwt service sign method with correct username', async () => {
      userRepository.validateUserPassword.mockResolvedValue(request);

      await service.signIn(request);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: request.username,
      });
    });
  });
});
