import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class PostDto {
    @IsString({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title can not be empty" })
    title: string;

    @IsString({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title can not be empty" })
    content: string;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    tags: string[];
}