const assert = require('assert');
const psd2json = require('../index.js');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const FILE_NAME = 'sample';
const PSD_FILE_NAME = FILE_NAME + '.psd';
const OUTPUT_FILE_NAME = FILE_NAME + '.json';

const OUTPUT_DATA = fs.readFileSync(path.join(__dirname, 'sample_test.json'), 'utf-8');

describe('Passing a file path.', function() {

  const PSD_FILE_PATH = path.join(__dirname, PSD_FILE_NAME);
  const OUT_FILE_PATH = path.join(__dirname, OUTPUT_FILE_NAME);

  let returnData = '';

  before(function(done) {
    fs.unlink(OUT_FILE_PATH, () => {
      returnData = psd2json(PSD_FILE_PATH);
      done();
    });
  });

  it('File is not output.', function() {
    assert.throws(() => {
      fs.exist.statSync(OUT_FILE_PATH);
    });
  });

  it('Correct return JSON.', function() {
    assert.equal(
      OUTPUT_DATA,
      returnData
    );
  });
});

describe('Passing file path and JSON directory path.', function() {

  const PSD_FILE_PATH = path.join(__dirname, PSD_FILE_NAME);
  const OUTPUT_DIR = path.join(__dirname, 'output');
  const OUT_FILE_PATH = path.join(OUTPUT_DIR, OUTPUT_FILE_NAME);

  let returnData = '';

  before(function(done) {
    rimraf.sync(OUTPUT_DIR);
    returnData = psd2json(PSD_FILE_PATH, {outJsonDir:OUTPUT_DIR});
    done();
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

  it('Correct return JSON.', function() {
    assert.equal(
      OUTPUT_DATA,
      returnData
    );
  });
});

describe('Passing file path and IMG directory path.', function() {

  const PSD_FILE_PATH = path.join(__dirname, PSD_FILE_NAME);
  const OUTPUT_DIR = path.join(__dirname, 'output');

  let returnData = '';

  before(function(done) {
    rimraf.sync(OUTPUT_DIR);
    returnData = psd2json(PSD_FILE_PATH, {outImgDir:OUTPUT_DIR});
    done();
  });

  it('Correct output path.', function() {
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'background', 'ground.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'background', 'object.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'background', 'sky.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'field', 'player.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'ui', 'footer', 'back.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'ui', 'footer', 'button1.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'ui', 'footer', 'button2.png')));
    assert.ok(fs.statSync(path.join(OUTPUT_DIR, FILE_NAME, 'ui', 'footer', 'button3.png')));
  });

  it('Correct return JSON.', function() {
    assert.equal(
      OUTPUT_DATA,
      returnData
    );
  });
});
