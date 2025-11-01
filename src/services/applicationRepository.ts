import type { ApplicationData } from "../domain/application";

const KEY = "social-support-app";

const empty: ApplicationData = {
  personal: {
    name: "",
    nationalId: "",
    dateOfBirth: "",
    gender: undefined,
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
  },
  family: {
    maritalStatus: "single",
    dependents: 0,
    employmentStatus: "unemployed",
    monthlyIncome: 0,
    housingStatus: "rent",
  },
  situation: {
    currentFinancialSituation: "",
    employmentCircumstances: "",
    reasonForApplying: "",
  },
};

export function loadApplication(): ApplicationData {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : empty;
  } catch (error) {
    console.error(error);
    return empty;
  }
}

export function saveApplication(data: ApplicationData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

export function getEmptyApplication(): ApplicationData {
  return structuredClone
    ? structuredClone(empty)
    : JSON.parse(JSON.stringify(empty));
}
