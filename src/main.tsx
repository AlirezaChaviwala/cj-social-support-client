import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/index";
import type { RootState } from "./store";
import "./i18n";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { LanguageOptions } from "./domain/application";

function Shell() {
  const language = useSelector((state: RootState) => state.ui.language);
  const direction = language === LanguageOptions.ARABIC ? "rtl" : "ltr";
  return (
    <ConfigProvider
      direction={direction}
      theme={{ algorithm: theme.defaultAlgorithm }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Shell />
    </Provider>
  </React.StrictMode>
);
