import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return { ...user, password: undefined };
  }

  createUser(createUserDto: CreateUserDto): User {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required fields.');
    }
    const timestamp = Date.now();
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.users.push(newUser);
    return { ...newUser, password: undefined };
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): User | undefined {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    if (
      updateUserDto.oldPassword &&
      user.password !== updateUserDto.oldPassword
    ) {
      throw new ForbiddenException('Incorrect old password.');
    }
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const existingUser = this.users[userIndex];
    const updatedUser = {
      ...existingUser,
      password: updateUserDto.newPassword,
      version: existingUser.version + 1,
      updatedAt: Date.now(),
    };

    this.users = this.users.map((user) =>
      user.id === id ? updatedUser : user,
    );
    return { ...updatedUser, password: undefined };
  }

  deleteUser(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format. Expected a UUID.');
    }

    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    this.users.splice(index, 1);
  }
}
