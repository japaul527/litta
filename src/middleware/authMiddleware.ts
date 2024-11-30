import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) : any |void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token is required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    (req as any).user = decoded; // Attach user to request object
    
    // console.log("Authenticate log",req,decoded)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Role-based access control middleware
export const authorize = (roles: string[]) : any | void=> {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    // console.log("Authorize first log", req, user)
    if (!roles.includes(user.role)) {
        // console.log("Authorize log",user,roles)
      return res.status(403).json({ error: "Access forbidden: insufficient permissions" });
    }
    next();
  };
};
