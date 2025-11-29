import { Request, Response } from "express";
import { ResponseError } from "../errors/response-error";
import { presignPut, presignGet } from "../services/upload-service";
import { query } from "../app/database";

export const UploadController = {
  async presign(req: Request, res: Response) {
    try {
      const action = String(req.body.action || "put").toLowerCase();
      const folder = String(req.body.folder || "");
      const filename = String(req.body.filename || "");
      const contentType = String(req.body.content_type || "application/octet-stream");
      const keyBase = folder ? `${folder}/${filename}` : filename;
      const key = keyBase.replace(/\s+/g, "-");
      const result = action === "get" ? await presignGet(key) : await presignPut(key, contentType);
      res.status(200).json({ data: result });
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },

  async presignCandidate(req: Request, res: Response) {
    try {
      const uid = String((req as any).user?.id || "");
      const cRows = await query<any>("SELECT id FROM candidate_profiles WHERE user_id = ? LIMIT 1", [uid]);
      const cand = cRows[0];
      if (!cand) return res.status(404).json({ message: "candidate not found" });
      const action = String(req.body.action || "put").toLowerCase();
      const folder = String(req.body.folder || "");
      const filename = String(req.body.filename || "");
      const contentType = String(req.body.content_type || "application/octet-stream");
      const key = `candidate/${cand.id}${folder ? `/${folder}` : ""}/${filename}`.replace(/\s+/g, "-");
      const result = action === "get" ? await presignGet(key) : await presignPut(key, contentType);
      res.status(200).json({ data: result });
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },

  async presignCompany(req: Request, res: Response) {
    try {
      const uid = String((req as any).user?.id || "");
      const rows = await query<any>("SELECT id FROM company_profiles WHERE user_id = ? LIMIT 1", [uid]);
      const comp = rows[0];
      if (!comp) return res.status(404).json({ message: "company not found" });
      const action = String(req.body.action || "put").toLowerCase();
      const folder = String(req.body.folder || "");
      const filename = String(req.body.filename || "");
      const contentType = String(req.body.content_type || "application/octet-stream");
      const key = `company/${comp.id}${folder ? `/${folder}` : ""}/${filename}`.replace(/\s+/g, "-");
      const result = action === "get" ? await presignGet(key) : await presignPut(key, contentType);
      res.status(200).json({ data: result });
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },

  async presignDisnaker(req: Request, res: Response) {
    try {
      const uid = String((req as any).user?.id || "");
      const rows = await query<any>("SELECT id FROM disnaker_profiles WHERE user_id = ? LIMIT 1", [uid]);
      const dis = rows[0];
      if (!dis) return res.status(404).json({ message: "disnaker not found" });
      const action = String(req.body.action || "put").toLowerCase();
      const folder = String(req.body.folder || "");
      const filename = String(req.body.filename || "");
      const contentType = String(req.body.content_type || "application/octet-stream");
      const key = `disnaker/${dis.id}${folder ? `/${folder}` : ""}/${filename}`.replace(/\s+/g, "-");
      const result = action === "get" ? await presignGet(key) : await presignPut(key, contentType);
      res.status(200).json({ data: result });
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },
};
