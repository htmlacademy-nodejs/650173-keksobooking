'use strict';

const showDataByAcceptType = (req, res, data) => {
  switch (req.accepts([`json`, `html`])) {
    case `json`:
      res.setHeader(`Content-Type`, `application/json`);
      break;
    case `html`:
      res.setHeader(`Content-Type`, `text/html`);
      break;
  }

  res.send(JSON.stringify(data));
};

module.exports = showDataByAcceptType;
