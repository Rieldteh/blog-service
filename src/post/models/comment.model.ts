import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "src/user/models/user.model";
import { PostModel } from "./post.model";

@Entity("comments")
export class CommentModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => UserModel, (user) => user.comments)
    author: UserModel;

    @ManyToOne(() => PostModel, (post) => post.comments)
    post: PostModel;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}