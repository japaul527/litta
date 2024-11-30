import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const users: { id: string; username: string; password: string; role: string }[] = [
  {
    id: "1",
    username: "admin",
    password: bcrypt.hashSync("adminpass", 10), // Pre-hashed password
    role: "admin",
  },
  {
    id: "2",
    username: "user",
    password: bcrypt.hashSync("userpass", 10), // Pre-hashed password
    role: "user",
  },
];

// Secret key for JWT
const JWT_SECRET = "your_secret_key";

// Login handler
export const login = (req: Request, res: Response) : any => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid username or password" });

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: "Invalid username or password" });

  // Generate token
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  return res.json({ token });
};
