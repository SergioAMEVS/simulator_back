import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SamlStrategy } from './saml.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/simulator/service/user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'saml' }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [SamlStrategy, JwtStrategy, UserService],
  controllers: [AuthController],
  exports: [SamlStrategy, JwtStrategy],
})
export class AuthModule {}
