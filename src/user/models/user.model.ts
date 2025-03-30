import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostModel } from "src/post/models/post.model";
import { CommentModel } from "src/post/models/comment.model";

@Entity('users')
export class UserModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30, unique: true })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    name: string;

    @OneToMany(() => PostModel, (post) => post.author, { cascade: true })
    posts: PostModel[];

    @OneToMany(() => CommentModel, (comment) => comment.author)
    comments: CommentModel[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}