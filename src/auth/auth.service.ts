import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    return this.signToken(user.id, user.email);
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

  async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };

    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }
}
