import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

const roleMiddleware = (...allowedRoles: Array<"admin" | "sales">) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export default roleMiddleware;