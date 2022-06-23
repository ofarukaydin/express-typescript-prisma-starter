import { Service } from 'typedi';

import { PrismaService } from 'services/prisma.service';

@Service()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, password: string) {
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return user;
  }

  async findByEmailAndIncludePassword(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findByEmail(email: string) {
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

  async findById(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        email: true,
        id: true,
      },
    });
  }
}
