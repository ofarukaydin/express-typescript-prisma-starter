import { User } from '@prisma/client';
import { Service } from 'typedi';

import { PrismaService } from 'prisma/prisma.service';

interface UserRepositoryContract {
  create: (email: string, password: string) => Promise<User>;
  getByEmailAndIncludePassword: (email: string) => Promise<User | null>;
  getByEmail: (
    email: string,
  ) => Promise<Pick<User, 'id' | 'createdAt' | 'email' | 'updatedAt'> | null>;
  getById: (id: number) => Promise<User | null>;
  getAllUsers: () => Promise<
    Pick<User, 'id' | 'createdAt' | 'email' | 'updatedAt'>[]
  >;
}

@Service()
export class UserRepository implements UserRepositoryContract {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string) {
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return user;
  }

  async getByEmailAndIncludePassword(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        email: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
