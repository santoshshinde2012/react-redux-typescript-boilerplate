import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

test("renders learn react link", () => {
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  container.querySelector(".landing");
  expect(container.firstChild).toMatchSnapshot();
});
