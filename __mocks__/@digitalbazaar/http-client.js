/* eslint-disable */
// add mock to fix https://github.com/digitalbazaar/jsonld.js/issues/451
// this is just a copy of the content of https://github.com/digitalbazaar/http-client/blob/master/main.js
/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const kyOriginal = require("ky-universal");

const DEFAULT_HEADERS = {
  Accept: "application/ld+json, application/json",
};

const ky = kyOriginal.create({ headers: DEFAULT_HEADERS });

const proxyMethods = new Set(["get", "post", "push", "patch", "head", "delete"]);

const httpClient = new Proxy(ky, {
  get(target, propKey) {
    const propValue = target[propKey];

    // only intercept particular methods
    if (!proxyMethods.has(propKey)) {
      return propValue;
    }
    return async function () {
      let response;
      try {
        response = await propValue.apply(this, arguments);
      } catch (e) {
        return _handleError(e);
      }
      // a 204 will not include a content-type header
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("json")) {
        response.data = await response.json();
      }
      return response;
    };
  },
});

async function _handleError(e) {
  // handle network errors that do not have a response
  if (!e.response) {
    if (e.message === "Failed to fetch") {
      e.message = `${e.message}. Possible CORS error.`;
    }
    throw e;
  }

  // always move status up to the root of e
  e.status = e.response.status;

  const contentType = e.response.headers.get("content-type");
  if (contentType && contentType.includes("json")) {
    const errorBody = await e.response.json();
    // the HTTPError received from ky has a generic message based on status
    // use that if the JSON body does not include a message
    e.message = errorBody.message || e.message;
    e.data = errorBody;
  }
  throw e;
}

module.exports = {
  httpClient,
  ky: kyOriginal,
  DEFAULT_HEADERS,
};
