import { describe, test, expect, it } from "@jest/globals";
import supertest from "supertest";
import web from "../../src/app/web";
import logger from "../../src/app/logging";
import { EmployeeUtils, JabatanUtils } from "./test-utlis";

describe("POST /api/employe/create", () => {
  afterEach(async () => {
    await EmployeeUtils.deleteAll();
  });

  it("should create employee", async () => {
    const { divisi, jabatan } = await JabatanUtils.createJabatanAndDivisi();

    const response = await supertest(web).post("/api/employee/create").send({
      NIK: "1234567890",
      nama: "Zidane",
      kode_divisi: divisi.id,
      kode_jabatan: jabatan.id,
      id_perusahaan: divisi.company_id,
      status: "baru",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Employee created successfully");
    logger.error("error create employee: %o", response.body);
  });

  it("should return error if NIK already exist", async () => {
    await EmployeeUtils.createEmployee();

    const response = await supertest(web).post("/api/employee/create").send({
      NIK: "1234567890",
      nama: "Zidane",
      kode_divisi: 1,
      kode_jabatan: 1,
      id_perusahaan: "122821",
      status: "baru",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("NIK already exist");
    logger.error("error create employee: %o", response.body);
  });
});
