import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './models/post.model';
import { CommentModel } from './models/comment.model';

@Module({
  imports: [TypeOrmModule.forFeature([PostModel, CommentModel])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
