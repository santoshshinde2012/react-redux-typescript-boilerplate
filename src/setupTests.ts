// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// ReferenceError: TextEncoder is not defined
if (typeof TextEncoder === "undefined") {
  // eslint-disable-next-line unicorn/prefer-module
  global.TextEncoder = require("node:util").TextEncoder;
}

// ReferenceError: TextDecoder is not defined
if (typeof TextDecoder === "undefined") {
  // eslint-disable-next-line unicorn/prefer-module
  global.TextDecoder = require("node:util").TextDecoder;
}
