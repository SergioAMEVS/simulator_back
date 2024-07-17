import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/simulator/service/user.service';

interface CustomReq extends Request {
  user?: any;
}
interface CustomRes extends Response {
  body?: any;
}

@Controller('saml')
export class AuthController {
  constructor(private userService: UserService) {}
  @Post('callback')
  @UseGuards(AuthGuard('saml'))
  async samlCallback(@Req() req: CustomReq, @Res() res: CustomRes) {
    if (req.user) {
      const user = req.user;
      const token = jwt.sign(
        { userNameID: user.nameID },
        `${process.env.SECRET}`,
        {
          expiresIn: '1h',
        },
      );
      const userData = {
        user: user,
        token: token,
      };

      res.redirect(
        `${process.env.SAML_ISSUER}/callback?userData=${encodeURIComponent(
          JSON.stringify(userData),
        )}`,
      );
    } else {
      // return { message: 'Authentication failed' }
      res.status(500).json({ error: 'SAML callback error' });
    }
  }
}
