const assert = require('assert');
const psd2json = require('../index.js');
const path = require('path');
const fs = require('fs');

const PSD_FILE_NAME = 'sample.psd';
const OUTPUT_FILE_NAME = 'sample.json';

const OUTPUT_DATA = fs.readFileSync(path.join(__dirname, 'sample_test.json'), 'utf-8');

describe('Passing a file path.', function() {

  const PSD_FILE_PATH = path.join(__dirname, PSD_FILE_NAME);
  const OUT_FILE_PATH = path.join(__dirname, OUTPUT_FILE_NAME);

  before(function(done) {
    fs.unlink(OUT_FILE_PATH, () => {
      psd2json(PSD_FILE_PATH);
      done();
    });
  });

  it('Correct output path.', function() {
    assert.ok(fs.statSync(OUT_FILE_PATH));
  });

  it('Correct output JSON.', function() {
    assert.equal(
      OUTPUT_DATA,
      fs.readFileSync(OUT_FILE_PATH, 'utf-8')
    );
  });
});

describe('Passing file path and directory path.', function() {

  const PSD_FILE_PATH = path.join(__dirname, PSD_FILE_NAME);
  const OUTPUT_DIR = path.join(__dirname, 'output');
  const OUT_FILE_PATH = path.join(OUTPUT_DIR, OUTPUT_FILE_NAME);

  before(function(done) {
    fs.unlink(OUT_FILE_PATH, () => {
      psd2json(PSD_FILE_PATH, OUTPUT_DIR);
      done();
    });
  });

  it('Correct output path.', function() {
    assert.ok(fs.statSync(OUT_FILE_PATH));
  });

  it('Correct output JSON.', function() {
    assert.equal(
      OUTPUT_DATA,
      fs.readFileSync(OUT_FILE_PATH, 'utf-8')
    );
  });
});
