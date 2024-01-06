import { z } from "zod";

import * as common from "../../src/utils/common";

describe("Test formatValidationErrors() function", () => {
  test("Validation errors absent", () => {
    expect(common.formatValidationErrors([])).toEqual({});
  });

  test("Validation errors present", () => {
    let validationErrors = [
      { message: "message1", path: ["a", "b"] },
      { message: "message2", path: ["a", "b"] },
      { message: "message3", path: ["c"] },
    ];

    expect(common.formatValidationErrors(validationErrors)).toEqual({
      "a.b": "message1. message2",
      c: "message3",
    });
  });
});

describe("Test makeResponse() function", () => {
  test("When data is a valid object", () => {
    expect(common.makeResponse(true, "message1", { a: "message2" })).toEqual({
      success: true,
      message: "message1",
      data: { a: "message2" },
    });
  });

  test("When data is undefined", () => {
    expect(common.makeResponse(true, "message1", undefined)).toEqual({
      success: true,
      message: "message1",
    });
  });
});

describe("Test validateData() function", () => {
  const testSchema = z.object({ a: z.string().max(4, "Length can be upto 4") });

  test("Validation errors absent", () => {
    expect(common.validateData(testSchema, { a: "abc" })).toEqual(null);
  });

  test("Validation errors present", () => {
    expect(common.validateData(testSchema, { a: "abcde" })).toEqual({ a: "Length can be upto 4" });
  });
});
