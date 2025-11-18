import supertest from "supertest";
import web from "../../src/app/web";
import { CompanyUtils, DisnakerUtils, UserUtils } from "./test-utlis";
import logger from "../../src/app/logging";

describe("POST /api/company/login", () => {
  beforeEach(async () => {
    await CompanyUtils.createCompany();
  });

  afterEach(async () => {
    await CompanyUtils.deleteCompany();
    await DisnakerUtils.deleteAdmin();
    await UserUtils.deleteUser();
  });

  it("should return 200", async () => {
    const request = {
      username: "user 1",
      password: "123456",
    };

    const response = await supertest(web).post("/api/company/login").send(request);
    logger.error("response login company: %o", response.body);
    expect(response.status).toBe(200);
  });
});
