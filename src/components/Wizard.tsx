import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Progress } from "antd";
import { useTranslation } from "react-i18next";
import { useMemo, useEffect, useRef, type CSSProperties } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { StepRoutes, Step } from "../domain/application";
import {
  WIZARD_STEPS,
  getStepFromPath,
  getStepIndex,
} from "../utils/stepConfig";
import { STEP_CONFIG } from "../utils/stepConfig";

const contentStyle: CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  width: "100%",
};

const layoutStyle: CSSProperties = {
  minHeight: "100vh",
  padding: 24,
};

export default function Wizard() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const savedStep = useSelector((state: RootState) => state.application.step);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const pathStep = getStepFromPath(location.pathname);
    const expectedRoute = StepRoutes[savedStep];

    if (
      savedStep !== Step.Submit &&
      expectedRoute &&
      (location.pathname === "/" || pathStep !== savedStep)
    ) {
      navigate(expectedRoute, { replace: true });
    }

    hasInitialized.current = true;
  }, []);

  const currentStepIndex = useMemo(() => {
    const pathStep = getStepFromPath(location.pathname);
    return pathStep !== null ? getStepIndex(pathStep) : 0;
  }, [location.pathname]);

  const progressPercentage = useMemo(() => {
    const totalSteps = WIZARD_STEPS.length;
    return Math.round(((currentStepIndex + 1) / totalSteps) * 100);
  }, [currentStepIndex]);

  const currentStepTitle = useMemo(() => {
    const currentStep = WIZARD_STEPS[currentStepIndex];
    return currentStep !== undefined
      ? t(STEP_CONFIG[currentStep].titleKey)
      : "";
  }, [currentStepIndex, t]);

  const renderProgressBar = () => {
    return (
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {currentStepTitle}
            </h2>
            <span
              style={{
                fontSize: 14,
                color: "#666",
              }}
            >
              {t("wizard.step", {
                defaultValue: "Step",
              })}{" "}
              {currentStepIndex + 1} {t("wizard.of", { defaultValue: "of" })}{" "}
              {WIZARD_STEPS.length}
            </span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#1890ff" }}>
            {progressPercentage}%
          </span>
        </div>
        <Progress
          percent={progressPercentage}
          showInfo={false}
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
          trailColor="#f0f0f0"
          strokeWidth={10}
          aria-label={t("wizard.progressBar", {
            defaultValue: `Application progress: ${progressPercentage} percent complete`,
          })}
        />
      </div>
    );
  };

  return (
    <Layout style={layoutStyle}>
      <Layout.Content style={contentStyle}>
        {renderProgressBar()}
        <main
          aria-label={t("wizard.content", {
            defaultValue: "Application form content",
          })}
        >
          <div style={{ marginTop: 24 }}>
            <Outlet />
          </div>
        </main>
      </Layout.Content>
    </Layout>
  );
}
