import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signIn() {
    const getAllUsers = this.prisma.user.findMany();

    return getAllUsers;
  }

  async signUp(body: AuthDto) {
    const hash = await argon.hash(body.password);

    try {
      const createUser = await this.prisma.user.create({
        data: {
          email: body.email,
          hash,
        },
      });

      delete createUser.hash;

      return createUser;
    } catch (error) {
      if (error && error.code === 'P2002') {
        throw new ForbiddenException('Credentials already exists');
      }
      throw error;
    }
  }
}
