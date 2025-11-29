import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { CandidateAk1DocumentValidation, CandidateAk1VerifyValidation } from "../validations/ak1-validation";
import { ResponseError } from "../errors/response-error";

export default class CandidateAk1Service {
  static async upsertDocument(request: any) {
    const data = Validation.validate(CandidateAk1DocumentValidation, request);
    const cRows = await query<any>("SELECT * FROM candidate_profiles WHERE id = ? LIMIT 1", [data.candidate_id]);
    const candidate = cRows[0];
    if (!candidate) throw new ResponseError(404, "candidate not found");
    const requiredFilled = Boolean(candidate.full_name && candidate.nik && candidate.place_of_birth && candidate.birthdate && candidate.gender && candidate.status_perkawinan && candidate.address && candidate.postal_code);
    if (!requiredFilled) throw new ResponseError(400, "candidate profile incomplete");
    const dRows = await query<any>("SELECT * FROM candidate_ak1_documents WHERE candidate_id = ? LIMIT 1", [data.candidate_id]);
    const existing = dRows[0];
    if (existing) {
      await query("UPDATE candidate_ak1_documents SET ktp = ?, ijazah = ?, pas_photo = ?, certificate = ?, updated_at = NOW() WHERE id = ?", [data.ktp, data.ijazah, data.pas_photo, data.certificate || null, existing.id]);
      const uRows = await query<any>("SELECT * FROM candidate_ak1_documents WHERE id = ?", [existing.id]);
      return { message: "ak1 document updated", data: uRows[0] };
    }
    await query(
      "INSERT INTO candidate_ak1_documents (id, candidate_id, ktp, ijazah, pas_photo, certificate, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())",
      [data.candidate_id, data.ktp, data.ijazah, data.pas_photo, data.certificate || null]
    );
    const cDocRows = await query<any>("SELECT * FROM candidate_ak1_documents WHERE candidate_id = ?", [data.candidate_id]);
    return { message: "ak1 document created", data: cDocRows[0] };
  }

  static async getDocumentByCandidateId(candidate_id: string) {
    const rows = await query<any>(
      "SELECT d.*, card.status as card_status, card.file as card_file, card.note as card_note FROM candidate_ak1_documents d LEFT JOIN candidate_ak1_cards card ON card.ak1_document_id = d.id WHERE d.candidate_id = ? LIMIT 1",
      [candidate_id]
    );
    const doc = rows[0] || null;
    return { data: doc };
  }

  static async verifyDocument(request: any, disnaker_user_id: string) {
    const data = Validation.validate(CandidateAk1VerifyValidation, request);
    const dRows = await query<any>("SELECT * FROM candidate_ak1_documents WHERE id = ? LIMIT 1", [data.ak1_document_id]);
    const doc = dRows[0];
    if (!doc) throw new ResponseError(404, "ak1 document not found");
    const disRows = await query<any>("SELECT * FROM disnaker_profiles WHERE user_id = ? LIMIT 1", [disnaker_user_id]);
    const disnaker = disRows[0];
    if (!disnaker) throw new ResponseError(403, "disnaker profile required");
    const filePath = data.file || `ak1_cards/${doc.id}.pdf`;
    const cRows = await query<any>("SELECT * FROM candidate_ak1_cards WHERE ak1_document_id = ? LIMIT 1", [doc.id]);
    const existingCard = cRows[0];
    if (existingCard) {
      await query("UPDATE candidate_ak1_cards SET status = ?, file = ?, note = ?, disnaker_id = ?, updated_at = NOW() WHERE ak1_document_id = ?", [data.status, filePath, data.note || null, disnaker.id, doc.id]);
      const uRows = await query<any>("SELECT * FROM candidate_ak1_cards WHERE ak1_document_id = ?", [doc.id]);
      return { message: "ak1 card updated", data: uRows[0] };
    }
    await query(
      "INSERT INTO candidate_ak1_cards (id, ak1_document_id, disnaker_id, status, file, note, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())",
      [doc.id, disnaker.id, data.status, filePath, data.note || null]
    );
    const crRows = await query<any>("SELECT * FROM candidate_ak1_cards WHERE ak1_document_id = ?", [doc.id]);
    return { message: "ak1 card created", data: crRows[0] };
  }

  static async listDocuments() {
    const rows = await query<any>(
      "SELECT d.*, c.full_name, c.nik, c.place_of_birth, c.birthdate, card.status as card_status, card.file as card_file FROM candidate_ak1_documents d LEFT JOIN candidate_profiles c ON c.id = d.candidate_id LEFT JOIN candidate_ak1_cards card ON card.ak1_document_id = d.id ORDER BY d.created_at DESC",
      []
    );
    const data = rows.map((d: any) => {
      const status = d.card_status ? String(d.card_status).toUpperCase() : 'PENDING';
      return {
        id: d.id,
        candidate_id: d.candidate_id,
        full_name: d.full_name,
        nik: d.nik,
        place_of_birth: d.place_of_birth,
        birthdate: d.birthdate ? String(d.birthdate).slice(0, 10) : undefined,
        status,
        file: d.card_file || null,
      };
    });
    return { data };
  }
}
