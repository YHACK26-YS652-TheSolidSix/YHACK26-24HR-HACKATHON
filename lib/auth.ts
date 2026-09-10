import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type JWTPayload = {
  userId: string;
  role: "BUSINESS" | "OFFICER" | "ADMIN";
  businessId?: string;
  departmentId?: string;
};

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}