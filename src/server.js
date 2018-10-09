'use strict';

const http = require(`http`);
const path = require(`path`);
const url = require(`url`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const readfile = promisify(fs.readFile);

const MIME = {
  '.css': `text/css`,
  '.html': `text/html; charset=UTF-8`,
  '.jpg': `image/jpeg`,
  '.png': `image/png`,
  '.ico': `image/x-icon`
};

const PLAIN_TEXT = `text/plain`;

class Server {
  constructor(port = 3000) {
    this.hostname = `127.0.0.1`;
    this.port = port;
  }

  start() {
    return new Promise(() => {
      this._executeServer();
    });
  }

  _executeServer() {
    this._server.listen(this.port, this.hostname, () => {
      console.log(`Server running at ${ this._serverAddress }`);
    });
  }

  get _serverAddress() {
    return `http://${ this.hostname }:${ this.port }/`;
  }

  get _server() {
    return http.createServer((req, res) => {
      const absolutePath = this._absolutePath(req.url);

      (async () => {
        try {
          await this._readFile(absolutePath, res);
        } catch (e) {
          this._fileNotFound(res);
        }
      })().catch((error) => this._serverError(res, error));
    });
  }

  async _readFile(filePath, res) {
    const data = await readfile(filePath);

    res.statusCode = 200;
    res.statusMessage = http.STATUS_CODES[200];
    res.setHeader(`Content-Type`, this._mimeType(filePath));
    res.end(data);
  }

  _serverError(res, error) {
    res.writeHead(500, http.STATUS_CODES[500], {'Content-Type': PLAIN_TEXT});
    res.end(error.message);
  }

  _fileNotFound(res) {
    res.writeHead(404, http.STATUS_CODES[404]);
    res.end();
  }

  _absolutePath(requestUrl) {
    const localPath = this._localPath(requestUrl);
    return __dirname + `/../static` + localPath;
  }

  _localPath(requestUrl) {
    const pathName = url.parse(requestUrl).pathname;
    return pathName.endsWith(`/`) ? pathName + `index.html` : pathName;
  }

  _mimeType(filePath) {
    const extName = path.extname(filePath);
    return MIME[extName] || PLAIN_TEXT;
  }
}

module.exports = Server;
