import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { setLanguage } from "./store/uiSlice";
import { useTranslation } from "react-i18next";
import AppRouter from "./routes/AppRouter";
import { Button, Space, Typography } from "antd";
import { useEffect } from "react";
import { LanguageOptions, type LanguageType } from "./domain/application";

export default function App() {
  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.ui.language);
  const dispatch = useDispatch();

  const switchLanguage = (language: LanguageType) => {
    i18n.changeLanguage(language);
    dispatch(setLanguage(language));
  };

  useEffect(() => {
    document.dir = language === LanguageOptions.ARABIC ? "rtl" : "ltr";
  }, [language]);

  return (
    <>
      <div
        style={{
          padding: "12px 24px",
          background: "#fff",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {t("appTitle")}
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {t("appSubtitle")}
          </Typography.Title>
        </div>

        <Space>
          <span>{t("language")}:</span>
          <Button
            size="small"
            type={language === LanguageOptions.ENGLISH ? "primary" : "default"}
            onClick={() => switchLanguage(LanguageOptions.ENGLISH)}
          >
            {t("english")}
          </Button>
          <Button
            size="small"
            type={language === LanguageOptions.ARABIC ? "primary" : "default"}
            onClick={() => switchLanguage(LanguageOptions.ARABIC)}
          >
            {t("arabic")}
          </Button>
        </Space>
      </div>
      <AppRouter />
    </>
  );
}
