import { describe, test, expect, it } from "@jest/globals";
import supertest from "supertest";
import web from "../src/app/web";
import logger from "../src/app/logging";

describe("POST /api/employe", () => {
  it("should ", async () => {
    const response = await supertest(web).get("/api/employee");
    logger.info(response.body);
  });
});
