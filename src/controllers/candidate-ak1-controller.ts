import { query } from "../app/database";
import { Response, Request } from "express";
import CandidateAk1Service from "../services/candidate-ak1-service";
import { ResponseError } from "../errors/response-error";

export const CandidateAk1Controller = {
  async upsertDocument(req: Request, res: Response) {
    try {
      const userId = String((req as any).user?.id || "");
      const rows = await query<any>("SELECT id FROM candidate_profiles WHERE user_id = ? LIMIT 1", [userId]);
      const candidate = rows[0];
      const payload = { ...req.body, candidate_id: candidate?.id };
      const result = await CandidateAk1Service.upsertDocument(payload);
      res.status(200).json(result);
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },

  async getDocument(req: Request, res: Response) {
    try {
      const candidateId = String(req.query.candidate_id || "");
      if (candidateId) {
        const result = await CandidateAk1Service.getDocumentByCandidateId(candidateId);
        res.status(200).json(result);
        return;
      }
      const userId = String(req.query.user_id || (req as any).user?.id || "");
      const rows = await query<any>("SELECT id FROM candidate_profiles WHERE user_id = ? LIMIT 1", [userId]);
      const candidate = rows[0];
      if (!candidate) throw new ResponseError(404, "candidate not found");
      const result = await CandidateAk1Service.getDocumentByCandidateId(String(candidate.id));
      res.status(200).json(result);
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },

  async verify(req: Request, res: Response) {
    try {
      const disnakerUserId = String((req as any).user?.id || "");
      const result = await CandidateAk1Service.verifyDocument(req.body, disnakerUserId);
      res.status(200).json(result);
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const result = await CandidateAk1Service.listDocuments();
      res.status(200).json(result);
    } catch (e: any) {
      const err = e instanceof ResponseError ? e : new ResponseError(500, "internal error");
      res.status(err.status).json({ message: err.message });
    }
  },
};
