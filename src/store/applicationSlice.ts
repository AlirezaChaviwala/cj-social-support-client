import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type ApplicationData,
  type PersonalInformation,
  type FamilyAndFinancialInformation,
  type SituationInformation,
  type StepType,
  Step,
} from "../domain/application";
import {
  loadApplication,
  saveApplication,
  getEmptyApplication,
} from "../services/applicationRepository";

type ApplicationState = ApplicationData & {
  step: StepType;
};

const initialData = loadApplication();

const initialState: ApplicationState = {
  ...initialData,
  step: (initialData as ApplicationState).step ?? Step.PersonalInformation,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    updatePersonalInformation(
      state,
      action: PayloadAction<Partial<PersonalInformation>>
    ) {
      state.personal = { ...state.personal, ...action.payload };
      saveApplication(state);
    },
    updateFamilyInformation(
      state,
      action: PayloadAction<Partial<FamilyAndFinancialInformation>>
    ) {
      state.family = { ...state.family, ...action.payload };
      saveApplication(state);
    },
    updateSituationInformation(
      state,
      action: PayloadAction<Partial<SituationInformation>>
    ) {
      state.situation = { ...state.situation, ...action.payload };
      saveApplication(state);
    },
    setStep(state, action: PayloadAction<StepType>) {
      state.step = action.payload;
      saveApplication(state);
    },
    resetApplication(state) {
      const empty = getEmptyApplication();
      state.personal = empty.personal;
      state.family = empty.family;
      state.situation = empty.situation;
      state.step = Step.PersonalInformation;
      saveApplication(state);
    },
  },
});

export const {
  updatePersonalInformation,
  updateFamilyInformation,
  updateSituationInformation,
  setStep,
  resetApplication,
} = applicationSlice.actions;
export default applicationSlice.reducer;
