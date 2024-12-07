import { compare } from "bcrypt";

export const decryptPassword = async (
  enteredPassword: string,
  hashedPassword: string
) => {
  const result = compare(enteredPassword, hashedPassword);

  return result;
};
