const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const NPM_DIR = path.join(ROOT, "npm");
const SRC_DIST = path.join(ROOT, "dist");
const DST_DIST = path.join(NPM_DIR, "dist");

const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
const npmPkg = JSON.parse(fs.readFileSync(path.join(NPM_DIR, "package.json"), "utf-8"));

if (rootPkg.version !== npmPkg.version) {
  npmPkg.version = rootPkg.version;
  fs.writeFileSync(path.join(NPM_DIR, "package.json"), JSON.stringify(npmPkg, null, 2) + "\n", "utf-8");
  console.log(`[publish-npm] 已同步版本号: ${npmPkg.version}`);
}

if (fs.existsSync(DST_DIST)) fs.rmSync(DST_DIST, { recursive: true });
fs.cpSync(SRC_DIST, DST_DIST, { recursive: true });
console.log(`[publish-npm] 已复制 dist/ -> npm/dist/`);

const readme = path.join(ROOT, "README.md");
if (fs.existsSync(readme)) {
  fs.copyFileSync(readme, path.join(NPM_DIR, "README.md"));
  console.log(`[publish-npm] 已复制 README.md`);
}

console.log(`[publish-npm] 正在发布 ${npmPkg.name}@${rootPkg.version} ...`);
execSync("npm publish", { cwd: NPM_DIR, stdio: "inherit" });
