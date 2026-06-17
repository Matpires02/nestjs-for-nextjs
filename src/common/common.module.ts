import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hasing.service';
import { BycryptHashingService } from './hashing/bycrypt.hashing.service';

@Module({
  providers: [{ provide: HashingService, useClass: BycryptHashingService }],
  exports: [HashingService],
})
export class CommonModule {}
