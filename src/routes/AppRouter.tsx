import { Routes, Route, Navigate } from "react-router-dom";
import Wizard from "../components/Wizard";
import PersonalInformation from "../pages/PersonalInformation";
import FamilyAndFinancialInformation from "../pages/FamilyAndFinancialInformation";
import SituationInformation from "../pages/SituationInformation";
import Submit from "../pages/Submit";
import { WIZARD_STEPS } from "../utils/stepConfig";
import { Step, StepRoutes } from "../domain/application";
import { useMemo } from "react";

export default function AppRouter() {
  const STEP_COMPONENTS = useMemo(() => {
    return {
      [Step.PersonalInformation]: PersonalInformation,
      [Step.FamilyAndFinancialInformation]: FamilyAndFinancialInformation,
      [Step.SituationInformation]: SituationInformation,
      [Step.Submit]: Submit,
    };
  }, []);

  const mapRoutes = () => {
    return WIZARD_STEPS.map((step) => {
      const Component = STEP_COMPONENTS[step];
      const path = StepRoutes[step].replace("/", "");
      return <Route key={step} path={path} element={<Component />} />;
    });
  };

  const mapSubmitRoute = () => {
    const Component = STEP_COMPONENTS[Step.Submit];
    const path = StepRoutes[Step.Submit].replace("/", "");
    return <Route key={Step.Submit} path={path} element={<Component />} />;
  };

  return (
    <Routes>
      <Route path="/" element={<Wizard />}>
        <Route
          index
          element={
            <Navigate to={StepRoutes[Step.PersonalInformation]} replace />
          }
        />
        {mapRoutes()}
        {mapSubmitRoute()}
      </Route>
    </Routes>
  );
}
