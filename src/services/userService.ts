import { AppDataSource } from "../data-source";
import { User } from "../models/User";

export const getUsersService = async (): Promise<User[]> => {
  return AppDataSource.manager.find(User);
};

export const createUserService = async (data: Partial<User>): Promise<User> => {
  const user = AppDataSource.manager.create(User, data);
  return AppDataSource.manager.save(user);
};
