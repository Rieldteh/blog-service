import { IsNotEmpty, IsString } from "class-validator";

export class CommentDto {
    @IsString({ message: "Content must be a string" })
    @IsNotEmpty({ message: "Content can not be empty" })
    content: string;
}