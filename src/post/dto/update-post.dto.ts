import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['title', 'content', 'excerpt', 'coverImageUrl']),
) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: 'Campo "published" deve ser um valor booleano' })
  published?: boolean;
}
