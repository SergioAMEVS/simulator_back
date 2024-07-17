import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifiedCallback } from 'passport-saml';
import { UserService } from 'src/simulator/service/user.service';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
  constructor(private userService: UserService) {
    super({
      entryPoint: process.env.SAML_ENTRY_POINT,
      issuer: process.env.SAML_ISSUER,
      callbackUrl: process.env.SAML_CALLBACK_URL,
      cert: `-----BEGIN CERTIFICATE-----\n${process.env.CERT}\n-----END CERTIFICATE-----`,
      acceptedClockSkewMs: 60 * 60 * 3 + 600000,
    });
  }

  async validate(profile: Profile, done: VerifiedCallback): Promise<any> {
    try {
      const user = await this.userService.findOrCreateUser(profile);
      const userRecord = { ...user };

      return done(null, userRecord);
    } catch (error) {
      return done(error);
    }
  }
}
