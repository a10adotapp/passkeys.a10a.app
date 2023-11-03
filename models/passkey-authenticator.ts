import { db } from "@/db";
import { CredentialDeviceType } from "@simplewebauthn/typescript-types";
import base64url from "base64url";
import { RunResult, Statement } from "sqlite3";

export type PasskeyAuthenticator = {
  userUuid: string;
  credentialID: Uint8Array;
  credentialPublicKey: Uint8Array;
  credentialDeviceType: CredentialDeviceType;
  credentialBackedUp: boolean;
  counter: number;
};

export async function addPasskeyAuthenticator(
  passkeyAuthenticator: PasskeyAuthenticator,
): Promise<PasskeyAuthenticator | undefined> {
  return new Promise(async (resolve, reject) => {
    const credentialId = base64url.encode(
      Buffer.from(passkeyAuthenticator.credentialID),
    );
    const credentialPublicKey = base64url.encode(
      Buffer.from(passkeyAuthenticator.credentialPublicKey),
    );

    (await db()).run(
      [
        `INSERT INTO passkey_authenticators`,
        `(user_uuid, credential_id, credential_public_key, credential_device_type, credential_backed_up, counter)`,
        `VALUES (?, ?, ?, ? ,?, ?)`,
      ].join("\n\t"),
      [
        passkeyAuthenticator.userUuid,
        credentialId,
        credentialPublicKey,
        passkeyAuthenticator.credentialDeviceType,
        passkeyAuthenticator.credentialBackedUp,
        passkeyAuthenticator.counter,
      ],
      async function (this: RunResult, err: Error | null) {
        if (err !== null) {
          return reject(err);
        }

        resolve(
          await getPasskeyAuthenticator({
            credentialId,
          }),
        );
      },
    );
  });
}

export async function listPasskeyAuthenticator(
  request: QueryRequest,
): Promise<PasskeyAuthenticator[]> {
  type Row = {
    user_uuid: string;
    credential_id: string;
    credential_public_key: string;
    credential_device_type: string;
    credential_backed_up: number;
    counter: number;
  };

  return new Promise(async (resolve, reject) => {
    const [conditions, values] = buildQuery(request);

    (await db()).all<Row>(
      [
        `SELECT user_uuid, credential_id, credential_public_key, credential_device_type, credential_backed_up, counter`,
        `FROM passkey_authenticators`,
        `WHERE ${conditions}`,
      ].join("\n\t"),
      values,
      function (this: Statement, err: Error | null, rows: Row[]) {
        if (err !== null) {
          return reject(err);
        }

        resolve(
          rows.map((row) => ({
            userUuid: row.user_uuid,
            credentialID: Uint8Array.from(
              base64url.toBuffer(row.credential_public_key),
            ),
            credentialPublicKey: Uint8Array.from(
              base64url.toBuffer(row.credential_public_key),
            ),
            credentialDeviceType:
              row.credential_device_type as CredentialDeviceType,
            credentialBackedUp: row.credential_backed_up === 1,
            counter: row.counter,
          })),
        );
      },
    );
  });
}

export async function getPasskeyAuthenticator(
  request: QueryRequest,
): Promise<PasskeyAuthenticator | undefined> {
  type Row = {
    user_uuid: string;
    credential_id: string;
    credential_public_key: string;
    credential_device_type: string;
    credential_backed_up: number;
    counter: number;
  };

  return new Promise(async (resolve, reject) => {
    const [conditions, values] = buildQuery(request);

    (await db()).get<Row | undefined>(
      [
        `SELECT user_uuid, credential_id, credential_public_key, credential_device_type, credential_backed_up, counter`,
        `FROM passkey_authenticators`,
        `WHERE ${conditions}`,
      ].join("\n\t"),
      values,
      function (this: Statement, err: Error | null, row: Row | undefined) {
        if (err !== null) {
          return reject(err);
        }

        resolve(
          row !== undefined
            ? {
                userUuid: row.user_uuid,
                credentialID: Uint8Array.from(
                  base64url.toBuffer(row.credential_public_key),
                ),
                credentialPublicKey: Uint8Array.from(
                  base64url.toBuffer(row.credential_public_key),
                ),
                credentialDeviceType:
                  row.credential_device_type as CredentialDeviceType,
                credentialBackedUp: row.credential_backed_up === 1,
                counter: row.counter,
              }
            : undefined,
        );
      },
    );
  });
}

type QueryRequest = {
  userUuid?: string;
  credentialId?: string;
};

function buildQuery(request: QueryRequest): [string, any[]] {
  const conditions: string[] = [];
  const values: any[] = [];

  if (request.userUuid !== undefined) {
    conditions.push("user_uuid = ?");
    values.push(request.userUuid);
  }

  if (request.credentialId !== undefined) {
    conditions.push("credential_id = ?");
    values.push(request.credentialId);
  }

  return [
    conditions.map((condition) => `(${condition})`).join(" AND "),
    values,
  ];
}
