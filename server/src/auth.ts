import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const SECRET = process.env.TRIGGMA_JWT_SECRET ?? "triggma-dev-secret";

export interface AuthToken {
  sub: string;
  tenantId: string;
  role: "tenant_admin" | "tenant_user" | "customer";
  name: string;
}

export function signToken(payload: AuthToken): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthToken;
    }
  }
}

export function requireAuth(...roles: AuthToken["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "missing_token" });
    }
    try {
      const decoded = jwt.verify(header.slice(7), SECRET) as AuthToken;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "forbidden" });
      }
      req.auth = decoded;
      next();
    } catch {
      return res.status(401).json({ error: "invalid_token" });
    }
  };
}
