import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/user/dto/user.dto';
import { UserModel } from 'src/user/models/user.model';
import { AccessToken } from './types/AccessToken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async register(userDto: UserDto): Promise<UserModel> {
        const user = await this.userService.findOne(userDto.email);

        if (user) {
            throw new BadRequestException("User is already exist");
        }

        const hashedPassword = await bcrypt.hash(userDto.password, 10);

        return this.userService.createUser({
            ...userDto, password: hashedPassword
        });
    }

    async validateUser(email: string, pass: string): Promise<UserModel> {
        const user = await this.userService.findOne(email);

        if (!user) {
            throw new UnauthorizedException();
        }

        const comparePasswords = await bcrypt.compare(pass, user.password);

        if (!comparePasswords) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        return user;
    }

    async login(user: UserModel): Promise<AccessToken> {
        const payload = { userId: user.id, email: user.email };
        return { 
            accessToken: await this.jwtService.signAsync(payload) 
        };
    }
}
