import { db } from "@/db";
import { RunResult, Statement } from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export type User = {
  uuid: string;
  email: string;
};

export function newUser(email: string): User {
  return {
    uuid: uuidv4(),
    email,
  };
}

export async function addUser(user: User): Promise<User | undefined> {
  return new Promise(async (resolve, reject) => {
    (await db()).run(
      [`INSERT INTO users`, `(uuid, email)`, `VALUES (?, ?)`].join("\n\t"),
      [user.uuid, user.email],
      async function (this: RunResult, err: Error | null) {
        if (err !== null) {
          return reject(err);
        }

        resolve(await getUser({ uuid: user.uuid }));
      },
    );
  });
}

export async function getUser(request: {
  uuid?: string;
  email?: string;
}): Promise<User | undefined> {
  return new Promise(async (resolve, reject) => {
    const [conditions, values] = buildQuery(request);

    (await db()).get<User | undefined>(
      [`SELECT uuid, email`, `FROM users`, `WHERE ${conditions}`].join("\n\t"),
      values,
      function (this: Statement, err: Error | null, row: User | undefined) {
        if (err !== null) {
          return reject(err);
        }

        resolve(row);
      },
    );
  });
}

type QueryRequest = {
  uuid?: string;
  email?: string;
};

function buildQuery(request: QueryRequest): [string, any[]] {
  const conditions: string[] = [];
  const values: any[] = [];

  if (request.uuid !== undefined) {
    conditions.push(`uuid = ?`);
    values.push(request.uuid);
  }

  if (request.email !== undefined) {
    conditions.push(`email = ?`);
    values.push(request.email);
  }

  return [
    conditions.map((condition) => `(${condition})`).join(" AND "),
    values,
  ];
}
