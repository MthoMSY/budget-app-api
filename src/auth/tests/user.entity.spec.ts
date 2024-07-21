import { User } from '../user.entity';
import { v4 } from 'uuid';
import * as encrypt from 'bcrypt';
describe(User.name, () => {
  describe('validatePassword', () => {
    const myPassword = 'At3stPass';

    const user = new User();
    user.id = v4();
    user.username = 'user1';

    it('should return true when hashes match for password validation', async () => {
      const salt = await encrypt.genSalt();
      user.salt = salt;
      user.password = await encrypt.hash(myPassword, salt);
      const result = await user.isValidPassword(myPassword);
      expect(result).toBe(true);
    });
    it('should return false when hashes do not match for password validation', async () => {
      const salt = await encrypt.genSalt();
      user.salt = salt;
      const result = await user.isValidPassword('someOtherHash');
      expect(result).toBe(false);
    });
  });
});
