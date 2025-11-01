import { Button, Form, InputNumber, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { updateFamilyInformation } from "../store/applicationSlice";
import { useTranslation } from "react-i18next";
import {
  EmploymentStatusOptions,
  HousingStatusOptions,
  MaritalStatusOptions,
  Step,
} from "../domain/application";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useEffect, useRef } from "react";
import { isInvalidNavigation } from "../utils/routerHelper";
type FormValues = {
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  dependents: number;
  employmentStatus: "employed" | "unemployed" | "student" | "retired" | "self";
  monthlyIncome: number;
  housingStatus: "rent" | "own" | "family" | "subsidized";
};

export default function FamilyAndFinancialInformation() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToNextStep, goToPreviousStep, goToStep } = useStepNavigation();
  const family = useSelector((state: RootState) => state.application.family);
  const currentStep = useSelector((state: RootState) => state.application.step);

  const previousFamilyRef = useRef(family);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: family,
    mode: "onChange",
  });

  useEffect(() => {
    if (isInvalidNavigation(currentStep, Step.FamilyAndFinancialInformation)) {
      goToStep(currentStep);
    }
  }, []);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(previousFamilyRef.current) !== JSON.stringify(family);
    if (hasChanged) {
      reset(family);
      previousFamilyRef.current = family;
    }
  }, [family, reset]);

  const onSubmit = (values: FormValues) => {
    dispatch(updateFamilyInformation(values));
    previousFamilyRef.current = values;
    goToNextStep(Step.FamilyAndFinancialInformation);
  };

  const renderMaritalStatusFormItem = () => {
    const fieldId = "maritalStatus-input";

    return (
      <Form.Item label={t("form.maritalStatus")}>
        <Controller
          name="maritalStatus"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id={fieldId}
              {...field}
              aria-label="marital-status"
              aria-describedby={fieldId}
              aria-required="true"
              value={field.value || undefined}
              options={[
                { value: MaritalStatusOptions.SINGLE, label: t("form.single") },
                {
                  value: MaritalStatusOptions.MARRIED,
                  label: t("form.married"),
                },
                {
                  value: MaritalStatusOptions.DIVORCED,
                  label: t("form.divorced"),
                },
                {
                  value: MaritalStatusOptions.WIDOWED,
                  label: t("form.widowed"),
                },
              ]}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderDependentsFormItem = () => {
    const fieldId = "dependents-input";

    return (
      <Form.Item label={t("form.dependents")}>
        <Controller
          name="dependents"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <InputNumber
              id={fieldId}
              {...field}
              min={0}
              style={{ width: "100%" }}
              aria-label="dependents"
              aria-describedby={fieldId}
              aria-required="true"
              value={field.value ?? 0}
              onChange={(value) => field.onChange(Number(value || 0))}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderEmploymentStatusFormItem = () => {
    const fieldId = "employmentStatus-input";

    return (
      <Form.Item label={t("form.employmentStatus")}>
        <Controller
          name="employmentStatus"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id={fieldId}
              {...field}
              aria-label="employment-status"
              aria-describedby={fieldId}
              aria-required="true"
              value={field.value || undefined}
              options={[
                {
                  value: EmploymentStatusOptions.EMPLOYED,
                  label: t("form.employed"),
                },
                {
                  value: EmploymentStatusOptions.UNEMPLOYED,
                  label: t("form.unemployed"),
                },
                {
                  value: EmploymentStatusOptions.STUDENT,
                  label: t("form.student"),
                },
                {
                  value: EmploymentStatusOptions.RETIRED,
                  label: t("form.retired"),
                },
                { value: EmploymentStatusOptions.SELF, label: t("form.self") },
              ]}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderMonthlyIncomeFormItem = () => {
    const fieldId = "monthlyIncome-input";

    return (
      <Form.Item label={t("form.monthlyIncome")}>
        <Controller
          name="monthlyIncome"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <InputNumber
              id={fieldId}
              {...field}
              min={0}
              style={{ width: "100%" }}
              aria-label="monthly-income"
              aria-describedby={fieldId}
              aria-required="true"
              value={field.value ?? 0}
              onChange={(v) => field.onChange(Number(v || 0))}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderHousingStatusFormItem = () => {
    const fieldId = "housingStatus-input";

    return (
      <Form.Item label={t("form.housingStatus")}>
        <Controller
          name="housingStatus"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id={fieldId}
              {...field}
              aria-label="housing-status"
              aria-describedby={fieldId}
              aria-required="true"
              value={field.value || undefined}
              options={[
                { value: HousingStatusOptions.RENT, label: t("form.rent") },
                { value: HousingStatusOptions.OWN, label: t("form.own") },
                { value: HousingStatusOptions.FAMILY, label: t("form.family") },
                {
                  value: HousingStatusOptions.SUBSIDIZED,
                  label: t("form.subsidized"),
                },
              ]}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderNavigationButtons = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {renderBackButton()}
        {renderNextButton()}
      </div>
    );
  };

  const renderNextButton = () => {
    const fieldId = "next-button";

    return (
      <Button
        id={fieldId}
        type="primary"
        htmlType="submit"
        aria-label={fieldId}
        aria-describedby={fieldId}
        aria-required="true"
      >
        {t("next")}
      </Button>
    );
  };

  const renderBackButton = () => {
    const fieldId = "back-button";

    return (
      <Button
        onClick={() => goToPreviousStep(Step.FamilyAndFinancialInformation)}
        aria-label={fieldId}
        aria-describedby={fieldId}
        aria-required="true"
      >
        {t("back")}
      </Button>
    );
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      aria-label={t("form.familyInfo", {
        defaultValue: "Family Information Form",
      })}
      role="form"
    >
      {renderMaritalStatusFormItem()}
      {renderDependentsFormItem()}
      {renderEmploymentStatusFormItem()}
      {renderMonthlyIncomeFormItem()}
      {renderHousingStatusFormItem()}
      {renderNavigationButtons()}
    </Form>
  );
}
