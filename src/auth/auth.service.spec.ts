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
});
