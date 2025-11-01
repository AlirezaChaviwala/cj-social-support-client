import { Button, Form, Input, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  resetApplication,
  updateSituationInformation,
} from "../store/applicationSlice";
import { useTranslation } from "react-i18next";
import HelpMeWriteButton from "../components/HelpMeWriteButton";
import axios from "axios";
import {
  LanguageLabels,
  Step,
  type SituationInformation,
} from "../domain/application";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useEffect, useRef } from "react";
import { getErrorHelp } from "../utils/errorHelper";
import { isInvalidNavigation } from "../utils/routerHelper";

type FormValues = {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export default function Situation() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToStep, goToPreviousStep } = useStepNavigation();
  const situation = useSelector(
    (state: RootState) => state.application.situation
  );
  const application = useSelector((state: RootState) => state.application);
  const language = useSelector((state: RootState) => state.ui.language);
  const currentStep = useSelector((state: RootState) => state.application.step);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: situation,
    mode: "onChange",
  });

  const prevSituationRef = useRef(situation);

  useEffect(() => {
    if (isInvalidNavigation(currentStep, Step.SituationInformation)) {
      goToStep(currentStep);
    }
  }, []);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(prevSituationRef.current) !== JSON.stringify(situation);
    if (hasChanged) {
      reset(situation);
      prevSituationRef.current = situation;
    }
  }, [situation, reset]);

  const onSubmit = async (values: FormValues) => {
    dispatch(updateSituationInformation(values));

    await axios
      .post("/api/mock-submit", { ...application, situation: values })
      .catch(() => {});
    message.success(t("submitted"));
    dispatch(resetApplication());
    goToStep(Step.Submit);
  };

  const makeAccept = (field: keyof FormValues) => (text: string) => {
    setValue(field, text, { shouldValidate: true });
    dispatch(
      updateSituationInformation({
        [field]: text,
      } as Partial<SituationInformation>)
    );
  };

  const renderCurrentFinancialSituationFormItem = () => {
    const fieldId = "currentFinancialSituation-input";

    return (
      <Form.Item
        label={t("form.currentFinancialSituation")}
        validateStatus={errors.currentFinancialSituation ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "currentFinancialSituation" as keyof FormValues,
          errors.currentFinancialSituation,
          t
        )}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Controller
            name="currentFinancialSituation"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 10,
                message: "minLength:10",
              },
            }}
            render={({ field }) => (
              <Input.TextArea
                id={fieldId}
                rows={4}
                {...field}
                value={field.value || ""}
                aria-label="current-financial-situation"
                aria-describedby={fieldId}
                aria-required="true"
              />
            )}
          />
          <HelpMeWriteButton
            seedPrompt={`Help me describe my current financial situation in the ${
              LanguageLabels[language]
            } language : ${
              getValues("currentFinancialSituation") ||
              "I have limited income and high expenses."
            }`}
            onAccept={makeAccept("currentFinancialSituation")}
          />
        </div>
      </Form.Item>
    );
  };

  const renderEmploymentCircumstancesFormItem = () => {
    const fieldId = "employmentCircumstances-input";

    return (
      <Form.Item
        label={t("form.employmentCircumstances")}
        validateStatus={errors.employmentCircumstances ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "employmentCircumstances" as keyof FormValues,
          errors.employmentCircumstances,
          t
        )}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Controller
            name="employmentCircumstances"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 10,
                message: "minLength:10",
              },
            }}
            render={({ field }) => (
              <Input.TextArea
                id={fieldId}
                rows={4}
                {...field}
                value={field.value || ""}
                aria-label="employment-circumstances"
                aria-describedby={fieldId}
                aria-required="true"
              />
            )}
          />

          <HelpMeWriteButton
            seedPrompt={`Describe employment circumstances in a respectful tone in the ${
              LanguageLabels[language]
            } language: ${
              getValues("employmentCircumstances") ||
              "I was recently laid off and I am actively looking for a job."
            }`}
            onAccept={makeAccept("employmentCircumstances")}
          />
        </div>
      </Form.Item>
    );
  };

  const renderReasonForApplyingFormItem = () => {
    const fieldId = "reasonForApplying-input";

    return (
      <Form.Item
        label={t("form.reasonForApplying")}
        validateStatus={errors.reasonForApplying ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "reasonForApplying" as keyof FormValues,
          errors.reasonForApplying,
          t
        )}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Controller
            name="reasonForApplying"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 10,
                message: "minLength:10",
              },
            }}
            render={({ field }) => (
              <Input.TextArea
                id={fieldId}
                rows={4}
                {...field}
                value={field.value || ""}
                aria-label="reason-for-applying"
                aria-describedby={fieldId}
                aria-required="true"
              />
            )}
          />

          <HelpMeWriteButton
            seedPrompt={`Explain the reason for applying for financial support in the ${
              LanguageLabels[language]
            } language: ${
              getValues("reasonForApplying") ||
              "I need support to cover rent and basic utilities while I look for work."
            }`}
            onAccept={makeAccept("reasonForApplying")}
          />
        </div>
      </Form.Item>
    );
  };

  const renderNavigationButtons = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {renderBackButton()}
        {renderSubmitButton()}
      </div>
    );
  };

  const renderBackButton = () => {
    const fieldId = "back-button";

    return (
      <Button
        onClick={() => goToPreviousStep(Step.SituationInformation)}
        aria-label={fieldId}
        aria-describedby={fieldId}
        aria-required="true"
      >
        {t("back")}
      </Button>
    );
  };

  const renderSubmitButton = () => {
    const fieldId = "submit-button";

    return (
      <Button
        id={fieldId}
        type="primary"
        htmlType="submit"
        aria-label={fieldId}
        aria-describedby={fieldId}
        aria-required="true"
      >
        {t("submit")}
      </Button>
    );
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      aria-label={t("form.situationInfo", {
        defaultValue: "Situation Information Form",
      })}
      role="form"
    >
      {renderCurrentFinancialSituationFormItem()}
      {renderEmploymentCircumstancesFormItem()}
      {renderReasonForApplyingFormItem()}
      {renderNavigationButtons()}
    </Form>
  );
}
