const assert = require("assert");
const psd2json = require("../index.js");
const path = require("path");
const fs = require("fs");

const psdFilePath = path.join(__dirname, "sample.psd");
const outDir = path.join(__dirname, "output");

const testData = fs.readFileSync(path.join(__dirname, "sample_test.json"), "utf-8");

psd2json(psdFilePath);
assert.equal(
  testData,
  fs.readFileSync(path.join(__dirname, "sample.json"), "utf-8"),
  "Output JSON data is invalid"
);

psd2json(psdFilePath, outDir);
assert.e.equal(
  testData,
  fs.readFileSync(path.join(outDir, "sample.json"), "utf-8"),
  "Output JSON data is invalid"
);
