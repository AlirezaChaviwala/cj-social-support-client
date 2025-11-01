import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LanguageOptions, type LanguageType } from "../domain/application";

type UIState = { language: LanguageType };

const initialState: UIState = { language: LanguageOptions.ENGLISH };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageType>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
