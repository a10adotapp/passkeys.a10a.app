import { Database, RunResult } from "sqlite3";

let sharedDb: Database;

export async function db(): Promise<Database> {
  if (sharedDb) {
    return sharedDb;
  }

  sharedDb = new Database("./db.sqlite");

  sharedDb.on("trace", (sql) => {
    console.log("📔", sql);
  });

  for (const sql of [
    [`CREATE TABLE IF NOT EXISTS users`, `(uuid TEXT, email TEXT)`].join(
      "\n\t",
    ),
    [
      `CREATE TABLE IF NOT EXISTS passkey_authenticators`,
      `(user_uuid TEXT, credential_id TEXT, credential_public_key TEXT, credential_device_type TEXT, credential_backed_up INTEGER, counter INTEGER)`,
    ].join("\n\t"),
  ]) {
    await new Promise((resolve, reject) => {
      sharedDb.run(sql, function (this: RunResult, err: Error | null) {
        if (err !== null) {
          return reject(err);
        }

        resolve(this);
      });
    });
  }

  return sharedDb;
}
