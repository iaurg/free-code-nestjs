import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signIn() {
    const getAllUsers = this.prisma.user.findMany();

    return getAllUsers;
  }

  signUp() {
    return 'This action adds a new cat';
  }
}
