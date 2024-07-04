import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, context): User => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
