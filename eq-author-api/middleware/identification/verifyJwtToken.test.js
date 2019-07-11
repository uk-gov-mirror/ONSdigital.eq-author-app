const fs = require("fs");
const verifyJwtToken = require("./verifyJwtToken");
const { createSignedToken } = require("../../tests/utils/createSignedToken");

const mockKid = "MY_SECRET_KEY";
const mockUserId = "MOCK_USER_ID";

const mockCertPublic = fs.readFileSync(__dirname + "/__mock__/rsa-public.pem");

const mockGoogleKeys = {
  [mockKid]: mockCertPublic.toString(),
};

const loggerInfo = jest.fn();
const loggerError = jest.fn();

const logger = {
  error: loggerError,
  info: loggerInfo,
};

const mockGoogleFetchError = {
  error: {
    code: 404,
    message: "Requested entity was not found.",
    status: "NOT_FOUND",
  },
};

jest.mock("node-fetch");
const fetch = require("node-fetch");

describe("verify Jwt token", () => {
  describe("fetch google public keys error", () => {
    beforeEach(() => {
      fetch.mockImplementation(() => {
        return {
          json: () => Promise.resolve(mockGoogleFetchError),
        };
      });
    });

    it("should log error google public keys fetching error but still decode token", async () => {
      const accessToken = createSignedToken(mockUserId);

      const validToken = await verifyJwtToken(
        accessToken,
        {
          kid: mockKid,
        },
        mockUserId,
        logger
      );

      expect(loggerError).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching Google Service Keys"),
        mockGoogleFetchError.error
      );

      expect(validToken).toEqual(true);
    });
  });

  describe("fetch google public keys 404", () => {
    beforeEach(() => {
      fetch.mockImplementation(() => {
        return {
          json: () => Promise.resolve(mockGoogleFetchError),
        };
      });
    });

    it("should log error google public keys fetching 404 but still decode token", async () => {
      const accessToken = createSignedToken(mockUserId);

      const validToken = await verifyJwtToken(
        accessToken,
        {
          kid: mockKid,
        },
        mockUserId,
        logger
      );

      expect(loggerError).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching Google Service Keys"),
        mockGoogleFetchError.error
      );

      expect(validToken).toEqual(true);
    });
  });

  describe("with valid Google Public Keys", () => {
    beforeEach(() => {
      fetch.mockImplementation(() => {
        return {
          json: () => Promise.resolve(mockGoogleKeys),
        };
      });
    });

    it("should return resolved promise if called with valid token", async () => {
      const accessToken = createSignedToken(mockUserId);

      const validToken = await verifyJwtToken(
        accessToken,
        {
          kid: mockKid,
        },
        mockUserId,
        logger
      );

      expect(validToken).toEqual(true);
    });

    it("should return false if called with invalid kid identifier", async () => {
      const accessToken = createSignedToken(mockUserId);

      const validToken = await verifyJwtToken(
        accessToken,
        {
          kid: "invalid.kid",
        },
        mockUserId,
        logger
      );

      expect(validToken).toEqual(false);
    });

    it("should return false if called with invalid token", async () => {
      const validToken = await verifyJwtToken(
        "invalid.token",
        {
          kid: mockKid,
        },
        mockUserId,
        logger
      );

      expect(loggerInfo).toHaveBeenCalledWith(
        expect.stringContaining("Failed token verification"),
        expect.anything()
      );
      expect(validToken).toEqual(false);
    });
  });
});
