// const fs = require("fs");
// const path = require("path");

// const SRC = path.resolve(__dirname, "..");
// const TEST_ROOT = path.join(SRC, "__tests__");

// function walk(dir) {
//   return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
//     const res = path.join(dir, entry.name);
//     if (res === TEST_ROOT) return [];
//     if (entry.isDirectory()) return walk(res);
//     if (entry.isFile() && res.endsWith(".tsx")) return [res];
//     return [];
//   });
// }

// (async () => {
//   const files = walk(SRC);

//   for (const file of files) {
//     const rel = path.relative(SRC, file);
//     // Skip Next.js App folder to avoid import-time errors
//     const isLayout = path.basename(file) === "layout.tsx";
//     const dir = path.dirname(rel);
//     const base = path.basename(file, ".tsx");
//     const compName = base[0].toUpperCase() + base.slice(1);
//     const testDir = path.join(TEST_ROOT, dir);
//     const testFile = path.join(testDir, `${base}.test.tsx`);

//     if (fs.existsSync(testFile)) continue;
//     fs.mkdirSync(testDir, { recursive: true });

//     // Compute import path for the actual component under test
//     // Compute a path to import the module under test
//     const importPath = path
//       .relative(testDir, file)
//       .replace(/\\/g, "/")
//       .replace(/\.tsx$/, "");

//     const lines = [];
//     if (isLayout) {
//       lines.push(
//         "jest.mock('next/font/google', () => new Proxy({}, { get: () => () => ({}) }));",
//         ""
//       );
//     }
//     lines.push(
//       `import * as ${compName} from '${importPath}';`,
//       "",
//       `test('loads ${compName} module', () => {`,
//       `  expect(${compName}).toBeTruthy();`,
//       "});",
//       ""
//     );
//     const content = lines.join("\n");

//     fs.writeFileSync(testFile, content, "utf8");
//     console.log(`✔ Created stub test for ${compName}`);
//   }

//   console.log("All stub tests generated.");
// })();

const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "..");
const TEST_ROOT = path.join(SRC, "__tests__");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const res = path.join(dir, entry.name);
    if (res === TEST_ROOT) return [];
    if (entry.isDirectory()) return walk(res);
    if (entry.isFile() && res.endsWith(".tsx")) return [res];
    return [];
  });
}

(async () => {
  const files = walk(SRC);

  for (const file of files) {
    // relative path under src/, e.g. "app/dashboard/page.tsx"
    const rel = path.relative(SRC, file);
    const isLayout = path.basename(file) === "layout.tsx";
    const dir = path.dirname(rel);
    const base = path.basename(file, ".tsx");
    const compName = base[0].toUpperCase() + base.slice(1);
    const testDir = path.join(TEST_ROOT, dir);
    const testFile = path.join(testDir, `${base}.test.tsx`);

    if (fs.existsSync(testFile)) continue;
    fs.mkdirSync(testDir, { recursive: true });

    // compute true relative import path from test file to component
    const importPath = path
      .relative(testDir, file)
      .replace(/\\/g, "/")
      .replace(/\.tsx$/, "");

    const lines = [];
    if (isLayout) {
      // stub all next/font/google exports (including Geist_Mono)
      lines.push(
        "jest.mock('next/font/google', () => new Proxy({}, { get: () => () => ({}) }));",
        ""
      );
    }

    lines.push(
      // import via true relative path
      `import * as ${compName} from '${importPath}';`,
      "",
      `test('loads ${compName} module', () => {`,
      `  expect(${compName}).toBeTruthy();`,
      "});",
      ""
    );

    const content = lines.join("\n");
    fs.writeFileSync(testFile, content, "utf8");
    console.log(`✔ Created stub test for ${compName}`);
  }

  console.log("All stub tests generated.");
})();
