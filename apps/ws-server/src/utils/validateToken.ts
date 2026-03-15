import Jwt from "jsonwebtoken";
import "dotenv/config";

export const validateToken = (token: string) => {
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!);

    if(typeof decoded == "string" || !decoded.id){
      return null;
    }

    return decoded.id;
  } catch (error) {
    return null;
  }
}