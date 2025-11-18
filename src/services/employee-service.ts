import { prismaClient } from "../app/database";
import logger from "../app/logging";
import { CreateEmployeeRequest, EmployeeResponse, UpdateEmployeeRequest } from "../models/employe-model";
import { EmployeeValidation } from "../validations/employee-validation";
import { Validation } from "../validations/validation";

export default class EmployeeService {
  static async create(request: CreateEmployeeRequest): Promise<EmployeeResponse> {
    // validate request
    const validatedRequest = Validation.validate(EmployeeValidation.CREATE, request);

    // create data
    const record: CreateEmployeeRequest = {
      ...validatedRequest,
    };

    // checking unique NIK
    const checkUnique = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
      },
    });

    if (checkUnique) {
      throw new Error("NIK already exist");
    }

    const employee = await prismaClient.employees.create({
      data: record,
    });

    logger.error("create data employee: %o", employee);

    return {
      message: "Employee created successfully",
    };
  }

  static async update(request: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    // validate request
    const validatedRequest = Validation.validate(EmployeeValidation.UPDATE, request);

    // create data
    const record: UpdateEmployeeRequest = {
      ...validatedRequest,
    };

    // checking unique NIK
    const checkUnique = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
        NOT: {
          NIK: record.NIK,
        },
      },
    });

    if (checkUnique) {
      throw new Error("NIK already exist");
    }

    const employee = await prismaClient.employees.update({
      where: {
        NIK: record.NIK,
      },
      data: record,
    });

    logger.error("update data employee: %o", employee);

    return {
      message: "Employee updated successfully",
    };
  }
}
