import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    // Validate the user (e.g., fetch user details from database)
    // Return the user object if valid, or throw an error if not
    // return { id: payload.sub, username: payload.username };
    return payload;
  }
}
