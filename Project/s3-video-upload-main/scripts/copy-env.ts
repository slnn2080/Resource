#!/usr/bin/env ts-node
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const tsPath = join(__dirname, "..", "env.ts");
const jsPath = join(__dirname, "..", "examples", "env.js");

// copy ../env.ts to ../examples/env.js and comment export line
(async () => {
  const tsData = await readFile(tsPath, "utf8");
  const jsData = tsData.replace(/export/g, "// export");
  await writeFile(jsPath, jsData);
})();
