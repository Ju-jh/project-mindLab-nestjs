import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UserInput } from './user.input';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private handleQueryError(
    methodName: string,
    id: number,
    error: Error,
  ): never {
    this.logger.error(`Error in ${methodName}: ${error.message}`);
    throw new Error(
      `Failed to fetch ${methodName.toLowerCase()} with id ${id}`,
    );
  }

  async findByEmailOrSave(data: UserInput): Promise<User> {
    const isUser = await this.getUser(data.email);
    if (!isUser) {
      const user = this.userRepository.create(data as Partial<User>);
      return await this.userRepository.save(user);
    } else {
      return isUser;
    }
  }

  async getUser(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in getUser:', error);
      return null;
    }
  }

  async findUserIdByEmail(email: string): Promise<string | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      return user.u_id;
    } catch (error) {
      this.handleQueryError('findUserIdByEmail', 0, error);
      return null;
    }
  }

  async getEmailAndPhotoByCookie(cookie: string): Promise<any> {
    interface UserPayload extends JwtPayload {
      user: {
        email: string;
        photo: string;
      };
    }

    try {
      const cookies = cookie ? cookie.split(';') : [];
      let accessToken = null;
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');

        if (name === 'accessToken') {
          accessToken = value;
          const decodedToken: UserPayload = verify(
            accessToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
          ) as UserPayload;
          if (decodedToken && decodedToken.user && decodedToken.user.email) {
            const email = await decodedToken.user.email;
            const user = await this.getUser(email);
            return JSON.stringify(user);
          }
        }
      }
    } catch (error) {
      console.error('Error in getUser:', error);
      return null;
    }
  }
}
