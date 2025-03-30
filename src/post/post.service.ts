import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from './models/post.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { CommentModel } from './models/comment.model';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PostModel)
        private postRepository: Repository<PostModel>,
        @InjectRepository(CommentModel)
        private commentRepository: Repository<CommentModel>
    ){}

    async createPost(userId: number, postDto: PostDto): Promise<PostModel> {
        const post = this.postRepository.create({
            title: postDto.title,
            content: postDto.content,
            tags: postDto.tags,
            author: { id: userId }
        });

        return this.postRepository.save(post);
    }

    async getPost(postId: number): Promise<PostModel> {
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException("Post is not found");
        }

        return post;
    }

    async getAllPosts(title?: string, content?: string, authorId?: number, created_at?: Date, limit?: number): Promise<PostModel[]> {
        return this.postRepository.find({
            where: {
                title,
                content,
                author: { id: authorId },
                created_at
            },
            take: limit
        });
    }

    async deletePost(postId: number): Promise<void> {
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException("Post is not found");
        }

        await this.postRepository.delete({ id: postId });
    }

    async createComment(commentDto: CommentDto, authorId: number, postId: number): Promise<CommentModel> {

        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException("Post is not found");
        }

        const comment = this.commentRepository.create({
            content: commentDto.content,
            author: { id: authorId },
            post: { id: postId }
        });

        return this.commentRepository.save(comment);
    }


    async getAllComments(postId: number): Promise<CommentModel[]> {
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException("Post is not found");
        }

        return this.commentRepository.findBy({ post: { id: postId } });
    }

    async deleteComment(postId: number, commentId: number): Promise<void> {
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException("Post is not found");
        }

        const comment = await this.commentRepository.findOneBy({ id: commentId });

        if (!comment) {
            throw new NotFoundException("Comment is not found");
        }

        await this.commentRepository.delete({ id: commentId });
    }
}
