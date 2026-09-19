import { readFileSync, writeFileSync } from "node:fs";

const files = process.argv.slice(2);

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const imports = [];
  const seen = new Map();

  const rewritten = source.replace(
    /require\((["'])([^"']+)\1\)/g,
    (_match, _quote, specifier) => {
      if (!seen.has(specifier)) {
        const name = `img${seen.size}`;
        seen.set(specifier, name);
        imports.push(`import ${name} from "${specifier}";`);
      }
      return seen.get(specifier);
    }
  );

  if (imports.length === 0) continue;

  // Insert generated imports directly after the final existing import.
  const lines = rewritten.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^import\s/.test(lines[i])) lastImport = i;
  }
  lines.splice(lastImport + 1, 0, ...imports);

  writeFileSync(file, lines.join("\n"));
  console.log(`${file}: converted ${imports.length} imports`);
}
