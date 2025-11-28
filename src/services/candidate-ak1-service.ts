import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { CandidateAk1DocumentValidation, CandidateAk1VerifyValidation } from "../validations/ak1-validation";
import { ResponseError } from "../errors/response-error";

export default class CandidateAk1Service {
  static async upsertDocument(request: any) {
    const data = Validation.validate(CandidateAk1DocumentValidation, request);
    const candidate = await prismaClient.candidate_profile.findUnique({ where: { id: data.candidate_id } });
    if (!candidate) throw new ResponseError(404, "candidate not found");
    const requiredFilled = Boolean(candidate.full_name && candidate.nik && candidate.place_of_birth && candidate.birthdate && candidate.gender && candidate.status_perkawinan && candidate.address && candidate.postal_code);
    if (!requiredFilled) throw new ResponseError(400, "candidate profile incomplete");
    const existing = await prismaClient.candidate_ak1_documents.findFirst({ where: { candidate_id: data.candidate_id } });
    if (existing) {
      const updated = await prismaClient.candidate_ak1_documents.update({ where: { id: existing.id as any }, data: { ktp: data.ktp, ijazah: data.ijazah, pas_photo: data.pas_photo, certificate: data.certificate } });
      return { message: "ak1 document updated", data: updated };
    }
    const created = await prismaClient.candidate_ak1_documents.create({ data });
    return { message: "ak1 document created", data: created };
  }

  static async getDocumentByCandidateId(candidate_id: string) {
    const doc = await prismaClient.candidate_ak1_documents.findFirst({ where: { candidate_id }, include: { ak1_card: true } });
    return { data: doc };
  }

  static async verifyDocument(request: any, disnaker_user_id: string) {
    const data = Validation.validate(CandidateAk1VerifyValidation, request);
    const doc = await prismaClient.candidate_ak1_documents.findUnique({ where: { id: data.ak1_document_id } });
    if (!doc) throw new ResponseError(404, "ak1 document not found");
    const disnaker = await prismaClient.disnaker_profile.findUnique({ where: { user_id: disnaker_user_id } });
    if (!disnaker) throw new ResponseError(403, "disnaker profile required");
    const filePath = data.file || `ak1_cards/${doc.id}.pdf`;
    const existingCard = await prismaClient.candidate_ak1_cards.findUnique({ where: { ak1_document_id: doc.id } });
    if (existingCard) {
      const updated = await prismaClient.candidate_ak1_cards.update({ where: { ak1_document_id: doc.id }, data: { status: data.status as any, file: filePath, note: data.note, disnaker_id: disnaker.id } });
      return { message: "ak1 card updated", data: updated };
    }
    const created = await prismaClient.candidate_ak1_cards.create({ data: { ak1_document_id: doc.id, disnaker_id: disnaker.id, status: data.status as any, file: filePath, note: data.note } });
    return { message: "ak1 card created", data: created };
  }

  static async listDocuments() {
    const rows = await prismaClient.candidate_ak1_documents.findMany({ include: { candidate: true, ak1_card: true }, orderBy: { createdAt: 'desc' } });
    const data = rows.map((d: any) => {
      const status = d.ak1_card?.status ? String(d.ak1_card.status).toUpperCase() : 'PENDING';
      return {
        id: d.id,
        candidate_id: d.candidate_id,
        full_name: d.candidate?.full_name,
        nik: d.candidate?.nik,
        place_of_birth: d.candidate?.place_of_birth,
        birthdate: d.candidate?.birthdate ? String(d.candidate.birthdate).slice(0, 10) : undefined,
        status,
        file: d.ak1_card?.file || null,
      };
    });
    return { data };
  }
}
