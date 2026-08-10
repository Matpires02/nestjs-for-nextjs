import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  currentPassword: string;

  @ApiProperty()
  @IsString({ message: 'A nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'A nova senha não pode estar vazia' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  newPassword: string;
}
