import { Controller, Get, Put, Req, Body, BadRequestException, Param, Delete, UseGuards, Res, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UpdateUserDto } from './dto/upd-user.dto';
import { Request, Response } from 'express';
import { AccessTokenPayload } from 'src/auth/types/AccessTokenPayload';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':userId')
  async update(@Req() req: Request, @Param('userId', ParseIntPipe) userId: number, @Body() updUserDto: UpdateUserDto): Promise<UserModel> {
    const user = req.user as AccessTokenPayload;

    if (!user) {
      throw new BadRequestException("Invalid data");
    }

    return this.userService.update(user.userId, userId, updUserDto);
  }

  @Get(':userId')
  async get(@Param('userId', ParseIntPipe) userId: number): Promise<Omit<UserModel, 'password'>> {
    return this.userService.get(userId);
  }

  @Get()
  async getAll(): Promise<Omit<UserModel, 'password'>[]> {
    return this.userService.getAll();
  }

  @Delete()
  async delete(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const user = req.user as AccessTokenPayload;

    if (!user) {
      throw new BadRequestException("Invalid data");
    }

    await this.userService.delete(user.userId);
    return res.status(200).json({ message: "User has been deleted successfully" });
  }
}
