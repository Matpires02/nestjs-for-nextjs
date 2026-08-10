import { ApiProperty } from '@nestjs/swagger';

export class PageMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class PageResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: PageMeta;
}
