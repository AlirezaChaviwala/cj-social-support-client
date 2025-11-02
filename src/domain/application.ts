export const LanguageOptions = {
  ENGLISH: "en",
  ARABIC: "ar",
} as const;

export const LanguageLabels: Record<LanguageType, string> = {
  [LanguageOptions.ENGLISH]: "English",
  [LanguageOptions.ARABIC]: "Arabic (العربية)",
} as const;

export type LanguageType =
  (typeof LanguageOptions)[keyof typeof LanguageOptions];

export type Gender = "male" | "female" | "other";

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export const MaritalStatusOptions = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
} as const;

export type EmploymentStatus =
  | "employed"
  | "unemployed"
  | "student"
  | "retired"
  | "self";

export const EmploymentStatusOptions = {
  EMPLOYED: "employed",
  UNEMPLOYED: "unemployed",
  STUDENT: "student",
  RETIRED: "retired",
  SELF: "self",
} as const;

export type HousingStatus = "rent" | "own" | "family" | "subsidized";

export const HousingStatusOptions = {
  RENT: "rent",
  OWN: "own",
  FAMILY: "family",
  SUBSIDIZED: "subsidized",
} as const;

export const GenderOptions = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type PersonalInformation = {
  name: string;
  nationalId: string;
  dateOfBirth?: string;
  gender?: Gender;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
};

export type FamilyAndFinancialInformation = {
  maritalStatus: MaritalStatus;
  dependents: number;
  employmentStatus: EmploymentStatus;
  monthlyIncome: number;
  housingStatus: HousingStatus;
};

export type SituationInformation = {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export type ApplicationData = {
  personal: PersonalInformation;
  family: FamilyAndFinancialInformation;
  situation: SituationInformation;
};

export const Step = {
  PersonalInformation: 0,
  FamilyAndFinancialInformation: 1,
  SituationInformation: 2,
  Submit: 3,
} as const;

export const StepTitles: Record<StepType, string> = {
  [Step.PersonalInformation]: "personalInformation",
  [Step.FamilyAndFinancialInformation]: "familyAndFinancialInformation",
  [Step.SituationInformation]: "situationInformation",
  [Step.Submit]: "submit",
};

export const StepRoutes = {
  [Step.PersonalInformation]: "/personalInformation",
  [Step.FamilyAndFinancialInformation]: "/familyAndFinancialInformation",
  [Step.SituationInformation]: "/situationInformation",
  [Step.Submit]: "/submit",
} as const;

export type StepType = (typeof Step)[keyof typeof Step];
