import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index";

const root = createRoot(document.getElementById("react-root")!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
