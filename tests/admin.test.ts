import { describe, test, expect, it } from "@jest/globals";
import supertest from "supertest";
import web from "../src/app/web";
import logger from "../src/app/logging";
import { AdminUtils, CompanyUtils } from "./test-utlis";

describe("POST /api/admin/register", () => {
  beforeEach(async () => {
    await CompanyUtils.createCompany();
  });

  afterEach(async () => {
    await AdminUtils.deleteAdmin();
    await CompanyUtils.deleteCompany();
  });

  it("should register admin successfully", async () => {
    const request = {
      body: {
        username: "admin1",
        password: "123456",
        role_code: "PNJMDSKR",
        id_perusahaan: 1,
      },
    };
    const result = await supertest(web).post("/api/admin/register").send(request.body);

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Admin registered successfully");
  });

  it("should return 400 if username already exist", async () => {
    await AdminUtils.createAdmin();

    const request = {
      body: {
        username: "admin1",
        password: "123456",
        role_code: "PNJMDSKR",
        id_perusahaan: 1,
      },
    };
    await supertest(web).post("/api/admin/register").send(request.body);
    const result = await supertest(web).post("/api/admin/register").send(request.body);

    expect(result.body.errors).toBe("username already exist");
    expect(result.status).toBe(400);
  });

  it("should return 400 if request is invalid", async () => {
    const request = {
      body: {
        username: "admin1",
        password: "",
        role_code: "PNJMDSKR",
        id_perusahaan: 1,
      },
    };
    const result = await supertest(web).post("/api/admin/register").send(request.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
