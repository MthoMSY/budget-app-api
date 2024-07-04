import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { AutoMocker } from 'automocker';

describe('AuthService', () => {
  const automocker = AutoMocker.createJestMocker(jest);
  let service: AuthService;
  const userRepository = automocker.createMockInstance(UserRepository);

  beforeEach(async () => {
    jest.resetAllMocks();

    service = new AuthService(userRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should call user repository sign up with correct arguments', async () => {
      const request = { username: 'test', password: 'test#5' };

      await service.signUp(request);

      expect(userRepository.signUp).toHaveBeenCalledWith(request);
    });
  });
});
