/* eslint-disable class-methods-use-this */
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersReepository = getRepository(User);

    const checkUserExists = await usersReepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hasedPassword = await hash(password, 8);

    const user = usersReepository.create({
      name,
      email,
      password: hasedPassword,
    });

    await usersReepository.save(user);

    return user;
  }
}

export default CreateUserService;
