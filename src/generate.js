'use strict';

const fs = require(`fs`);
const Data = require(`../src/data`).Data;

const readline = require(`readline`);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DefaulsFileParams = {
  NAME: `offers`,
  WRITE_OPTIONS: {encoding: `utf-8`, mode: 0o644}
};
const Questions = {
  OFFERS_COUNT: `Let's generate a new data. How many offers do you want to generate? `,
  FILENAME: `Enter the filename(default: ${DefaulsFileParams.NAME}): `,
  REWRITE_FILE: `File already exists. Do you want to rewrite it? (yes/no) `
};
const POSITIVE_ANSWERS = [`yes`, `y`];

class GenerateData {
  constructor(filePath) {
    this.dataCount = 1;
    this.filePath = filePath;
  }

  static createFilePath(fileName) {
    return `${process.cwd()}/tmp/${fileName}.json`;
  }

  start() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.offersCountStep();
    });
  }

  offersCountStep() {
    rl.question(Questions.OFFERS_COUNT, (dataCount) => {
      this.dataCount = parseInt(dataCount, 0);

      if (this.dataCount > 0) {
        console.log(`Ok. Let's generate ${ this.dataCount } offers`);
        this.fileNameStep();
      } else {
        console.error(`You have an error. We can't generate an offers`);
        rl.close();
        this.resolve();
      }
    });
  }

  fileNameStep() {
    rl.question(Questions.FILENAME, (fileName) => {
      fileName = fileName.trim() === `` ? DefaulsFileParams.NAME : fileName;
      this.filePath = GenerateData.createFilePath(fileName);

      fs.access(this.filePath, fs.constants.F_OK, (err) => {
        if (err) {
          this.saveDataToFileStep();
          rl.close();
        } else {
          this.rewriteFileStep();
        }
      });
    });
  }

  saveDataToFileStep() {
    let fileData = [];

    for (let i = 0; i < this.dataCount; i++) {
      fileData.push(Data.generate());
    }

    this.saveData(fileData, this.filePath)
      .then(() => {
        console.log(`Data has been saved successfully`);
        rl.close();
        this.resolve();
      })
      .catch((error) => console.log(`We have a problem on this: ${ error }`));
  }

  rewriteFileStep() {
    rl.question(Questions.REWRITE_FILE, (answer) => {
      if (POSITIVE_ANSWERS.includes(answer)) {
        this.saveDataToFileStep();
        rl.close();
      } else {
        console.log(`Okay :(`);
        this.resolve();
      }
    });
  }

  saveData(fileData) {
    console.log(`Saving data to file: ${this.filePath}`);

    const data = JSON.stringify(fileData);

    return new Promise((success, fail) => {
      fs.writeFile(this.filePath, data, DefaulsFileParams.WRITE_OPTIONS, (err) => {
        if (err) {
          return fail(err);
        }

        return success();
      });
    });
  }
}

module.exports = GenerateData;
