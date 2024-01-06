import { LogMessages } from "../../src/constants/message";
import * as notification from "../../src/utils/notification";

const sendMailMock = jest.fn();
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockImplementation(() => ({ sendMail: sendMailMock })),
}));

describe("Test sendMail() function", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(global.console, "log");
  });

  afterEach(() => {
    logSpy.mockRestore();
    sendMailMock.mockClear();
  });

  test("Mail sent successfully", async () => {
    sendMailMock.mockImplementation((_mailOption, cb) => cb(null, { response: "ok" }));

    await notification.sendMail("subject", "body", "receiver@example.com");

    expect(sendMailMock).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(LogMessages.SEND_EMAIL_SUCCESS, "ok");
  });

  test("Failed to send mail", async () => {
    sendMailMock.mockImplementation((_mailOption, cb) => cb("error", {}));

    await notification.sendMail("subject", "body", "receiver@example.com");

    expect(sendMailMock).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(LogMessages.SEND_EMAIL_FAILURE, "error");
  });
});
