import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/refresh-token/entity/refresh-token.entity';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [RefreshTokenService],
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
