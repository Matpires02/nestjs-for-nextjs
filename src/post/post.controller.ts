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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const newPost = await this.postService.create(createPostDto, req.user);
    return new PostResponseDto(newPost);
  }

  @Get('me/:id')
  @UseGuards(JwtAuthGuard)
  async findOneOwned(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.findOneOwnedOrFail({ id }, req.user);
    return new PostResponseDto(post);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllOneOwned(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllOneOwned(req.user);
    return posts.map(post => new PostResponseDto(post));
  }

  @Patch('me/:id')
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
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.remove({ id }, req.user);
    return new PostResponseDto(post);
  }

  @Get(':slug')
  async findOnePublished(@Param('slug') slug: string) {
    const post = await this.postService.findOneOrFail({
      slug,
      published: true,
    });
    return new PostResponseDto(post);
  }

  @Get()
  async findAllPublished() {
    const post = await this.postService.findAll({ published: true });
    return post.map(post => new PostResponseDto(post));
  }
}
