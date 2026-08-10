import { ApiProperty } from '@nestjs/swagger';

export class UserPostResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}
