import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/autenticated-request';
import { PostResponseDto } from './dto/post-response.dto';
import {
  ApiPostMyAllPost as ApiPostGetMyPosts,
  ApiPostById as ApiPostGetById,
  ApiPostCreate,
  ApiPostUpdate,
  ApiPostDelete,
  ApiPostBySlug as ApiPostGetBySlug,
  ApiPostGetAllPublishedPosts,
} from './post.swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiPostCreate()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const newPost = await this.postService.create(createPostDto, req.user);
    return new PostResponseDto(newPost);
  }

  @Get('me/:id')
  @ApiPostGetById()
  @UseGuards(JwtAuthGuard)
  async findOneOwned(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.findOneOwnedOrFail({ id }, req.user);
    return new PostResponseDto(post);
  }

  @Get('me')
  @ApiPostGetMyPosts()
  @UseGuards(JwtAuthGuard)
  async findAllOneOwned(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllOneOwned(req.user);
    return posts.map(post => new PostResponseDto(post));
  }

  @Patch('me/:id')
  @ApiPostUpdate()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const newPost = await this.postService.update(
      { id },
      updatePostDto,
      req.user,
    );
    return new PostResponseDto(newPost);
  }

  @Delete('me/:id')
  @ApiPostDelete()
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.remove({ id }, req.user);
    return new PostResponseDto(post);
  }

  @Get(':slug')
  @ApiPostGetBySlug()
  async findOnePublished(@Param('slug') slug: string) {
    const post = await this.postService.findOneOrFail({
      slug,
      published: true,
    });
    return new PostResponseDto(post);
  }

  @Get()
  @ApiPostGetAllPublishedPosts()
  async findAllPublished() {
    const post = await this.postService.findAll({ published: true });
    return post.map(post => new PostResponseDto(post));
  }
}
