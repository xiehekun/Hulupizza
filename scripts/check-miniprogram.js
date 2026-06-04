const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appRoot = path.join(root, "miniprogram", "app");

const requiredFiles = [
  "app.js",
  "app.json",
  "app.wxss",
  "project.config.json",
  "sitemap.json",
  "utils/cart.js",
  "utils/mock-data.js"
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkRequiredFiles() {
  requiredFiles.forEach((file) => {
    const filePath = path.join(appRoot, file);
    assert(fs.existsSync(filePath), `Missing required file: ${file}`);
  });
}

function checkAppPages() {
  const appJson = readJson(path.join(appRoot, "app.json"));
  assert(Array.isArray(appJson.pages), "app.json pages must be an array");
  assert(appJson.pages.length > 0, "app.json must define at least one page");

  appJson.pages.forEach((page) => {
    ["js", "json", "wxml", "wxss"].forEach((ext) => {
      const filePath = path.join(appRoot, `${page}.${ext}`);
      assert(fs.existsSync(filePath), `Missing page file: ${page}.${ext}`);
    });
  });
}

function checkProjectConfig() {
  const projectConfig = readJson(path.join(appRoot, "project.config.json"));
  assert(projectConfig.compileType === "miniprogram", "project.config.json compileType must be miniprogram");
  assert(Boolean(projectConfig.projectname), "project.config.json projectname is required");
}

function checkJavaScriptSyntax() {
  const jsFiles = [];

  function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      if (entry.isFile() && entry.name.endsWith(".js")) jsFiles.push(entryPath);
    });
  }

  walk(appRoot);
  jsFiles.forEach((filePath) => {
    new Function(fs.readFileSync(filePath, "utf8"));
  });
}

function main() {
  checkRequiredFiles();
  checkAppPages();
  checkProjectConfig();
  checkJavaScriptSyntax();
  console.log("Hulupizza miniprogram environment check passed.");
}

main();
