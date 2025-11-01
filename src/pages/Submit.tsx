import { Result, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { Step } from "../domain/application";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useEffect } from "react";
import { isInvalidNavigation } from "../utils/routerHelper";

export default function Submit() {
  const { t } = useTranslation();
  const { goToStep } = useStepNavigation();
  const currentStep = useSelector((state: RootState) => state.application.step);

  useEffect(() => {
    if (isInvalidNavigation(currentStep, Step.Submit)) {
      goToStep(currentStep);
    }
  }, []);

  const handleNavigateToHome = () => {
    goToStep(Step.PersonalInformation);
  };

  return (
    <Result
      status="success"
      title={t("applicationSubmitted")}
      extra={[
        <Button type="primary" key="home" onClick={handleNavigateToHome}>
          {t("home")}
        </Button>,
      ]}
    />
  );
}
