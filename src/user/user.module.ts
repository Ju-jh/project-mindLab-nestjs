import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.stratgy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'google', session: true }),
  ],
  providers: [GoogleStrategy, UserService, UserResolver],
})
export class UserModule {}
