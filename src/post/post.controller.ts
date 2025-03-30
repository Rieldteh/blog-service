import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { Request, Response } from 'express';
import { PostModel } from './models/post.model';
import { AccessTokenPayload } from 'src/auth/types/AccessTokenPayload';
import { CommentModel } from './models/comment.model';
import { CommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Req() req: Request, @Body() postDto: PostDto): Promise<PostModel> {
    const user = req.user as AccessTokenPayload;

    if (!user) {
      throw new BadRequestException("Invalid data");
    }

    return this.postService.createPost(user.userId, postDto);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: number): Promise<PostModel> {
    return this.postService.getPost(postId);
  }

  @Get()
  async getAllPosts(
    @Query('title') title?: string,
    @Query('content') content?: string,
    @Query('authorId') authorId?: number,
    @Query('created_at') created_at?: Date,
    @Query('limit') limit?: number,
  ): Promise<PostModel[]> {
    return this.postService.getAllPosts(title, content, authorId, created_at, limit);
  }

  @Delete(':postId')
  async deletePost(@Param('postId', ParseIntPipe) postId: number, @Res() res: Response): Promise<Response> {
    await this.postService.deletePost(postId);
    return res.status(200).json({ message: "Post has been deleted successfully" });
  }

  @Post(':postId/comments')
  async createComment(@Req() req: Request, @Param('postId', ParseIntPipe) postId: number, @Body() commentDto: CommentDto): Promise<CommentModel> {
    const user = req.user as AccessTokenPayload;

    if (!user || !commentDto) {
      throw new BadRequestException("Invalid data");
    }

    return this.postService.createComment(commentDto, user.userId, postId);
  }

  @Get(':postId/comments')
  async getAllComments(@Param('postId', ParseIntPipe) postId: number): Promise<CommentModel[]> {
    return this.postService.getAllComments(postId);
  }

  @Delete(':postId/comments/:commentId')
  async deleteComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Res() res: Response): Promise<Response> {
    await this.postService.deleteComment(postId, commentId);
    return res.status(200).json({ message: "Comment has been deleted successfully" });
  }
}
