import { type NextFunction, type Response } from "express";
import { prismaClient } from "../app/database";
import { UserRequest } from "../types/user-request";

export function requirePermission(code: string) {
  return async function (req: UserRequest, res: Response, next: NextFunction) {
    const uid = (req.header("X-User-Id") || "").toString();
    if (!uid) return res.status(401).json({ errors: "Unauthorized" });
    const user = await prismaClient.users.findUnique({ where: { id: uid }, include: { role_ref: true } });
    if (!user || !user.role_ref_id) return res.status(403).json({ errors: "Forbidden" });
    const perms = await prismaClient.role_permissions.findMany({ where: { role_id: user.role_ref_id }, include: { permission: true } });
    const codes = perms.map((p) => p.permission.code);
    if (!codes.includes(code)) return res.status(403).json({ errors: "Forbidden" });
    next();
  };
}

export function requireSelfOrPermission(code: string) {
  return async function (req: UserRequest, res: Response, next: NextFunction) {
    const uid = (req.header("X-User-Id") || "").toString();
    if (!uid) return res.status(401).json({ errors: "Unauthorized" });
    const target = String((req.body as any)?.user_id || (req.query as any)?.user_id || (req.params as any)?.user_id || "");
    if (target && target === uid) return next();
    const user = await prismaClient.users.findUnique({ where: { id: uid }, include: { role_ref: true } });
    if (!user || !user.role_ref_id) return res.status(403).json({ errors: "Forbidden" });
    const perms = await prismaClient.role_permissions.findMany({ where: { role_id: user.role_ref_id }, include: { permission: true } });
    const codes = perms.map((p) => p.permission.code);
    if (!codes.includes(code)) return res.status(403).json({ errors: "Forbidden" });
    next();
  };
}

export function requireRole(roles: ("candidate" | "company" | "super_admin" | "disnaker")[]) {
  return async function (req: UserRequest, res: Response, next: NextFunction) {
    const uid = (req.header("X-User-Id") || "").toString();
    if (!uid) return res.status(401).json({ errors: "Unauthorized" });
    const user = await prismaClient.users.findUnique({ where: { id: uid }, include: { role_ref: true } });
    if (!user || !user.role_ref) return res.status(403).json({ errors: "Forbidden" });
    const name = (user.role_ref as any).name as string;
    const ok = roles.includes(name as any);
    if (!ok) return res.status(403).json({ errors: "Forbidden" });
    next();
  };
}