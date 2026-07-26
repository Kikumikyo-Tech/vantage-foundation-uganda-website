import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Splits a SQL script into individual statements, respecting:
 * - Dollar-quoted blocks ($$ ... $$)
 * - Single-quoted strings (' ... ')
 * - Double-quoted identifiers (" ... ")
 *
 * Simple semicolon splitting breaks on DO $$ ... END $$ blocks.
 */
function splitSql(sql) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let dollarTag = null;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    current += ch;

    if (dollarTag !== null) {
      // Inside a dollar-quoted block; look for the closing $tag$.
      if (ch === "$") {
        const rest = sql.slice(i);
        if (rest.startsWith(dollarTag)) {
          current += sql.slice(i + 1, i + dollarTag.length);
          i += dollarTag.length - 1;
          dollarTag = null;
        }
      }
      continue;
    }

    if (ch === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (ch === "$" && !inSingleQuote && !inDoubleQuote) {
      // Check for dollar-quote start: $tag$
      const match = sql.slice(i).match(/^\$(\w*)\$/);
      if (match) {
        dollarTag = match[0];
        current += sql.slice(i + 1, i + match[0].length);
        i += match[0].length - 1;
      }
    } else if (ch === ";" && !inSingleQuote && !inDoubleQuote) {
      // End of statement.
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      current = "";
    }
  }

  const trimmed = current.trim();
  if (trimmed.length > 0) {
    statements.push(trimmed);
  }

  return statements;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Error: DATABASE_URL is not set.");
    console.error("Set it in your environment or in .env.local, then run this script again.");
    process.exit(1);
  }

  const sql = neon(url);
  const schema = await readFile(join(__dirname, "..", "lib", "db", "schema.sql"), "utf8");

  const statements = splitSql(schema);

  for (const statement of statements) {
    await sql.query(statement);
    console.log("Executed:", statement.split("\n")[0].trim(), "...");
  }

  console.log("Database setup complete.");
}

main().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
