import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { validate as isUuid } from 'uuid';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import * as db from '../../database/inMemoryDB';

@Injectable()
export class UserService {
  async getAllUsers(): Promise<User[]> {
    return await db.getAllUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }

    const user = await db.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return { ...user, password: undefined };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required fields.');
    }
    const newUser = await db.createUser(createUserDto);
    return { ...newUser, password: undefined };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }
    const user = await db.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    if (
      updateUserDto.oldPassword &&
      user.password !== updateUserDto.oldPassword
    ) {
      throw new ForbiddenException('Incorrect old password.');
    }
    const updatedUser = await db.updateUser(id, {
      // ...updateUserDto,
      password: updateUserDto.newPassword,
    });
    return { ...updatedUser, password: undefined };
  }

  async deleteUser(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }
    const deleted = await db.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
}
