import { randomBytes, scryptSync } from "node:crypto";

if (!process.stdin.isTTY || !process.stdin.setRawMode) {
  console.error("Run this command in an interactive terminal.");
  process.exit(1);
}

function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    let password = "";
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") {
          process.stdin.setRawMode(false);
          process.stdin.off("data", onData);
          reject(new Error("Cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.off("data", onData);
          process.stdout.write("\n");
          resolve(password);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          password = password.slice(0, -1);
          continue;
        }
        if (character >= " ") password += character;
      }
    };

    process.stdin.on("data", onData);
  });
}

try {
  const password = await readHidden("New admin password (12+ characters): ");
  if (password.length < 12)
    throw new Error("Password must be at least 12 characters.");

  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  console.log(
    `ADMIN_PASSWORD_HASH=scrypt\\$${salt.toString("hex")}\\$${key.toString("hex")}`,
  );
  console.log(
    "Store this value in your server environment; it is not the password.",
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Unable to create password hash.",
  );
  process.exitCode = 1;
}
