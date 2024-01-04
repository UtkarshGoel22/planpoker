import { ErrorMessages } from "../../constants/message";
import { AppDataSource } from "../../database/mysql";
import { CreateUser } from "../../types";
import { User } from "./model";

export const createUser = async (data: CreateUser): Promise<User> => {
  const { email, firstName, password, lastName, username } = data;
  const userRepository = AppDataSource.getRepository(User);
  let newUser = userRepository.create({ email, firstName, password, lastName, username });

  const result = await userRepository.update(
    { email: data.email, isActive: false },
    { firstName, password, lastName, username, isActive: true }
  );

  if (result.affected) {
    return newUser;
  }

  try {
    return userRepository.save(newUser);
  } catch (error) {
    let errorData: { [key: string]: string } = {
      duplicateEntry: ErrorMessages.ACCOUNT_ALREADY_EXISTS,
    };
    throw { message: ErrorMessages.ACCOUNT_ALREADY_EXISTS, data: errorData };
  }
};
