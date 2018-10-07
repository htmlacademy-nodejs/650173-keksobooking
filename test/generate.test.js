'use strict';

const assert = require(`assert`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const GenerateData = require(`../src/generate`);

const access = promisify(fs.access);
const unlink = promisify(fs.unlink);

describe(`Generate JSON command`, function () {
  it(`should fail on non existing folder`, function () {
    const tempFileName = `${__dirname}/folder/testfile.json`;
    const generateData = new GenerateData(tempFileName);

    return generateData.saveData(``)
      .then(() => assert.fail(`Path ${tempFileName} should not be available`))
      .catch((e) => assert.ok(e));
  });

  it(`should create new file`, function () {
    const tempFileName = `${__dirname}/testfile.json`;
    const generateData = new GenerateData(tempFileName);

    return generateData.saveData(``)
      .then(access(tempFileName))
      .then(unlink(tempFileName));
  });
});
