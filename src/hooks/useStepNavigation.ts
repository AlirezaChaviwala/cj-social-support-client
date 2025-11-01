import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStep } from "../store/applicationSlice";
import { Step, StepRoutes, type StepType } from "../domain/application";

export function useStepNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToStep = (step: StepType, updateRedux = true) => {
    if (updateRedux) {
      dispatch(setStep(step));
    }
    navigate(StepRoutes[step]);
  };

  const goToNextStep = (currentStep: StepType) => {
    const nextStep = (currentStep + 1) as StepType;
    if (nextStep <= Step.SituationInformation) {
      goToStep(nextStep);
    }
  };

  const goToPreviousStep = (currentStep: StepType) => {
    const prevStep = (currentStep - 1) as StepType;
    if (prevStep >= Step.PersonalInformation) {
      goToStep(prevStep, false);
    }
  };

  return {
    goToStep,
    goToNextStep,
    goToPreviousStep,
  };
}
