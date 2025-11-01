import type { StepType } from "../domain/application";

export const isInvalidNavigation = (
  currentStep: StepType,
  targetStep: StepType
): boolean => {
  return currentStep < targetStep;
};
