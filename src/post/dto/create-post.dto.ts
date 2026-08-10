import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString({ message: 'Título precisa ser uma string' })
  @Length(10, 150, { message: 'Título deve conter entre 10 e 150 caracteres' })
  title: string;

  @ApiProperty()
  @IsString({ message: 'Conteúdo precisa ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo não pode ser vazio' })
  content: string;

  @ApiProperty()
  @IsString({ message: 'Excerto precisa ser uma string' })
  @Length(10, 200, { message: 'Excerto deve conter entre 10 e 200 caracteres' })
  excerpt: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl(
    {
      require_tld: false,
    },
    { message: 'URL da imagem de capa precisa ser uma URL válida' },
  )
  coverImageUrl: string;
}
