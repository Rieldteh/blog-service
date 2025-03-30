import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto {
    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email can not be empty" })
    email: string;

    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password can not be empty" })
    password: string;

    @IsOptional()
    @IsString({ message: "Name must be a string" })
    name: string;
}