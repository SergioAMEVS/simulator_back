import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulatorModule } from './simulator/simulator.module';
// import { AuthenticationMiddleware } from 'src/middleware/auth.middleware';
import * as fs from 'fs';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    SimulatorModule,
    RouterModule.register([
      {
        path: '/api/v1',
        module: SimulatorModule,
      },
      {
        path: '/api/auth',
        module: AuthModule,
      },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: Boolean(process.env.DB_SYNCHRONIZE),
          // ssl: {
          //   rejectUnauthorized: false,
          // },
        };
      },
    }),
    // AuthModule,
    // UsersModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
