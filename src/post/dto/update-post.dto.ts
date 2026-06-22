import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['title', 'content', 'excerpt', 'coverImageUrl']),
) {
  @IsOptional()
  @IsBoolean({ message: 'Campo "published" deve ser um valor booleano' })
  published?: boolean;
}
