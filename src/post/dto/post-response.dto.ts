import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';
import { UserPostResponse } from 'src/user/dto/user-post-response.dto';

export class PostResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly slug: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly excerpt: string;

  @ApiProperty({ type: String })
  readonly coverImageUrl: string | null;

  @ApiProperty()
  readonly published: boolean;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly author: UserPostResponse;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.slug = post.slug;
    this.content = post.content;
    this.excerpt = post.excerpt;
    this.coverImageUrl = post.coverImageUrl ?? null;
    this.published = post.published;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.author = {
      id: post.author.id,
      email: post.author.email,
      name: post.author.name,
    };
  }
}
