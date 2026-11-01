// `npm run samples`: serve the site locally with SHOW_SAMPLES=1 (works on Windows and Mac).
// Pass --build to build once instead of serving.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const bin = fileURLToPath(new URL("../node_modules/@11ty/eleventy/cmd.cjs", import.meta.url));
const args = process.argv.includes("--build") ? [] : ["--serve"];
const child = spawn(process.execPath, [bin, ...args], { stdio: "inherit", env: { ...process.env, SHOW_SAMPLES: "1" } });
child.on("exit", (code) => process.exit(code ?? 0));
