'use strict';

const showDataByAcceptType = (req, res, data) => {
  switch (req.accepts([`json`, `html`])) {
    case `json`:
      res.setHeader(`Content-Type`, `application/json`);
      res.send(data);
      break;
    case `html`:
      res.setHeader(`Content-Type`, `text/html`);
      res.send(JSON.stringify(data));
      break;
  }

  res.end();
};

module.exports = showDataByAcceptType;
