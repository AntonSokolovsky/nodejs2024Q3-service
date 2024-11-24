import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return { ...user, password: undefined };
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({ data: createUserDto });
    const userResponse = {
      ...newUser,
      createdAt: +newUser.createdAt,
      updatedAt: +newUser.updatedAt,
    };
    return { ...userResponse, password: undefined };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    if (
      updateUserDto.oldPassword &&
      user.password !== updateUserDto.oldPassword
    ) {
      throw new ForbiddenException('Incorrect old password.');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: updateUserDto.newPassword, version: ++user.version },
    });
    const userResponse = {
      ...updatedUser,
      createdAt: +updatedUser.createdAt,
      updatedAt: +updatedUser.updatedAt,
    };
    return { ...userResponse, password: undefined };
  }

  async deleteUser(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    } else {
      await this.prisma.user.delete({ where: { id } });
    }
  }
}
