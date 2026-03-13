import jwt from "jsonwebtoken";

export const generateToken = async (id: string, limit: number) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET!, {
    expiresIn: limit,
  });

  return token;
};
