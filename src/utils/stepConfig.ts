import {
  Step,
  StepRoutes,
  StepTitles,
  type StepType,
} from "../domain/application";

export interface StepConfig {
  key: StepType;
  route: string;
  titleKey: string;
}

export const STEP_CONFIG: Record<StepType, StepConfig> = {
  [Step.PersonalInformation]: {
    key: Step.PersonalInformation,
    route: StepRoutes[Step.PersonalInformation],
    titleKey: StepTitles[Step.PersonalInformation],
  },
  [Step.FamilyAndFinancialInformation]: {
    key: Step.FamilyAndFinancialInformation,
    route: StepRoutes[Step.FamilyAndFinancialInformation],
    titleKey: StepTitles[Step.FamilyAndFinancialInformation],
  },
  [Step.SituationInformation]: {
    key: Step.SituationInformation,
    route: StepRoutes[Step.SituationInformation],
    titleKey: StepTitles[Step.SituationInformation],
  },
  [Step.Submit]: {
    key: Step.Submit,
    route: StepRoutes[Step.Submit],
    titleKey: StepTitles[Step.Submit],
  },
};

export const WIZARD_STEPS: StepType[] = [
  Step.PersonalInformation,
  Step.FamilyAndFinancialInformation,
  Step.SituationInformation,
];

export function getStepFromPath(pathname: string): StepType | null {
  for (const [step, config] of Object.entries(STEP_CONFIG)) {
    if (pathname === config.route || pathname.startsWith(config.route + "/")) {
      return Number(step) as StepType;
    }
  }
  return null;
}

export function getStepIndex(step: StepType): number {
  return WIZARD_STEPS.indexOf(step);
}
