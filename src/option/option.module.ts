import { Module } from '@nestjs/common';
import { OptionResolver } from './option.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionResolver],
})
export class OptionModule {}
