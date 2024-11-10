import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/modules/user/dtos/createUser.dto';

const users: User[] = [];

export async function getAllUsers() {
  return users;
}

export async function createUser(createUserDto: CreateUserDto): Promise<User> {
  const timestamp = Date.now();
  const newUser: User = {
    id: uuidv4(),
    login: createUserDto.login,
    password: createUserDto.password,
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  users.push(newUser);
  return newUser;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((user) => user.id === id) || null;
}

export async function updateUser(
  id: string,
  updatedData: Partial<User>,
): Promise<User | null> {
  const user = users.find((user) => user.id === id);
  if (user) {
    Object.assign(user, {
      password: updatedData.password,
      updatedAt: Date.now(),
      version: user.version + 1,
    });
    return user;
  }
  return null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const index = users.findIndex((user) => user.id === id);
  if (index >= 0) {
    users.splice(index, 1);
    return true;
  }
  return false;
}
