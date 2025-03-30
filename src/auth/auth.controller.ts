import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserModel } from 'src/user/models/user.model';
import { AccessToken } from './types/AccessToken';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() userDto: UserDto): Promise<UserModel> {
      return this.authService.register(userDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request): Promise<AccessToken | BadRequestException> {
      const user = req.user as UserModel;

      if(!user) {
        throw new BadRequestException("Invalid data");
      }

      return this.authService.login(user);
    }


}
