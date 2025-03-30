import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './models/user.model';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/upd-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel)
        private userRepository: Repository<UserModel>
    ){}

    async createUser(userDto: UserDto): Promise<UserModel> {
        const user = this.userRepository.create({
            email: userDto.email,
            password: userDto.password,
            name: userDto.name
        });

        return this.userRepository.save(user);
    }

    async findOne(email: string): Promise<UserModel | null> {
        return this.userRepository.findOneBy({ email });
    }


    async update(userId: number, updUserId: number, updUserDto: UpdateUserDto): Promise<UserModel> {
        if (userId !== updUserId ) {
            throw new ForbiddenException("Access Denied")
        }

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException("User is not found");
        }

        user.email = updUserDto.email || user.email;
        user.password = updUserDto.password || user.password;
        user.name = updUserDto.name || user.name;

        return this.userRepository.save(user);
    }

    async get(userId: number): Promise<Omit<UserModel, 'password'>> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException("User is not found");
        }

        const { password, ...updUser } = user;
        void password;
        
        return updUser;
    }

    async getAll(): Promise<Omit<UserModel, 'password'>[]> {
        return this.userRepository.find({
            select: ['id', 'email', 'name', 'posts', 'comments', 'created_at']
        });
    }

    async delete(userId: number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException("User is not found");
        }

        await this.userRepository.delete({ id: userId });
    }

}
