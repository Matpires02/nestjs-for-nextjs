import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      title: createPostDto.title,
      excerpt: createPostDto.excerpt,
      content: createPostDto.content,
      coverImageUrl: createPostDto.coverImageUrl,
      author: author,
      slug: createSlugFromText(createPostDto.title),
    });
    return await this.postRepository.save(post).catch((error: unknown) => {
      if (error instanceof Error) {
        this.logger.error(`Error ao criar post: ${error.stack}`);
      }
      throw new BadRequestException('Erro ao criar post');
    });
  }

  async findOne(postData: Partial<Post>) {
    return await this.postRepository.findOne({
      where: postData,
      relations: { author: true },
    });
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    return await this.postRepository.findOne({
      where: { ...postData, author: { id: author.id } },
      relations: { author: true },
    });
  }

  async findAllOneOwned(author: User) {
    return await this.postRepository.find({
      where: { author: { id: author.id } },
      relations: { author: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }

    const post = await this.findOneOwnedOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.content = dto.content ?? post.content;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return await this.postRepository.save(post).catch((error: unknown) => {
      if (error instanceof Error) {
        this.logger.error(`Error ao atualizar post: ${error.stack}`);
      }
      throw new BadRequestException('Erro ao atualizar post');
    });
  }

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwnedOrFail(postData, author);
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });
    return post;
  }

  async findAll(postData: Partial<Post>) {
    return await this.postRepository.find({
      where: postData,
      relations: { author: true },
      order: { createdAt: 'DESC' },
    });
  }
}
