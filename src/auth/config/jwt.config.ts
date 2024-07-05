import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export class JwtConfig {
  static getJwtConfig(configService: ConfigService): JwtModuleOptions {
    return {
      secret: configService.getOrThrow('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.getOrThrow<number>(
          'JWT_TOKEN_EXPIRY_IN_SECONDS',
        ),
      },
    };
  }
}

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<JwtModuleOptions> => {
    return JwtConfig.getJwtConfig(configService);
  },
  inject: [ConfigService],
};
