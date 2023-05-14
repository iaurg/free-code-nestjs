import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signIn(body: AuthDto) {
    // get the user from the database by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // if the user doesn't exist, throw an error
    if (!user) {
      throw new ForbiddenException('Credentials are invalid');
    }

    // compare the password with the hash
    const isPasswordValid = await argon.verify(user.hash, body.password, {
      secret: Buffer.from(process.env.ARGON_SECRET),
    });

    // if the password doesn't match, throw an error
    if (!isPasswordValid) {
      throw new ForbiddenException('Credentials are invalid');
    }

    // if the password matches, return the user
    delete user.hash;

    return user;
  }

  async signUp(body: AuthDto) {
    const hash = await argon.hash(body.password, {
      secret: Buffer.from(process.env.ARGON_SECRET),
    });

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
