import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "src/user/models/user.model";
import { CommentModel } from "./comment.model";

@Entity('posts')
export class PostModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'text', array: true })
    tags: string[];

    @ManyToOne(() => UserModel, (user) => user.posts)
    author: UserModel;

    @OneToMany(() => CommentModel, (comment) => comment.post)
    comments: CommentModel[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}