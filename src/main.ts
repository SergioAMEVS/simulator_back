import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(process.env.BASE_URL);
  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { join } from 'path';
// import { Controller, Get, Res } from '@nestjs/common';

// @Controller()
// export class AppController {
//   @Get('*')
//   redirect(@Res() res) {
//     res.redirect('/ciscolifecycle');
//   }
// }

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useStaticAssets(join(__dirname, 'dist'), {
//     prefix: '/ciscolifecycle/',
//   });
//   await app.listen(3000);
// }
// bootstrap();
