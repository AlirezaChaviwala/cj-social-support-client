import { useForm, Controller } from "react-hook-form";
import { Button, Form, Input, DatePicker, Radio, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { updatePersonalInformation } from "../store/applicationSlice";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getAllCountries,
  getStatesByCountryCode,
  getCitiesByStateAndCountry,
  findCountryByName,
  findStateByName,
  type ICountry,
  type IState,
  type ICity,
} from "../services/geoDataService";
import { GenderOptions, Step } from "../domain/application";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { getErrorHelp } from "../utils/errorHelper";

type FormValues = {
  name: string;
  nationalId: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
};

export default function PersonalInformation() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const personal = useSelector(
    (state: RootState) => state.application.personal
  );
  const { goToNextStep } = useStepNavigation();

  const [countries] = useState<ICountry[]>(() => getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const previousPersonalRef = useRef(personal);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: personal,
    mode: "onChange",
  });

  useEffect(() => {
    const hasPersonalChanged =
      JSON.stringify(previousPersonalRef.current) !== JSON.stringify(personal);

    if (hasPersonalChanged) {
      reset(personal);
      previousPersonalRef.current = personal;
    }
  }, [personal, reset]);

  useEffect(() => {
    if (!personal.country) {
      return;
    }

    const countryData = findCountryByName(personal.country);
    if (!countryData) {
      return;
    }

    const countryStates = getStatesByCountryCode(countryData.isoCode);
    setStates(countryStates);

    if (!personal.state) {
      return;
    }

    const stateData = findStateByName(personal.state, countryData.isoCode);
    if (!stateData) {
      return;
    }

    const stateCities = getCitiesByStateAndCountry(
      countryData.isoCode,
      stateData.isoCode
    );
    setCities(stateCities);
  }, [personal.country, personal.state]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const selectedCountryData = useMemo(() => {
    if (!selectedCountry) return null;
    return findCountryByName(selectedCountry);
  }, [selectedCountry]);

  const selectedStateData = useMemo(() => {
    if (!selectedState || !selectedCountryData) return null;
    return findStateByName(selectedState, selectedCountryData.isoCode);
  }, [selectedState, selectedCountryData]);

  useEffect(() => {
    let states: IState[] = [];

    if (selectedCountryData) {
      states = getStatesByCountryCode(selectedCountryData.isoCode);
    }

    setStates(states);
    setCities([]);
  }, [selectedCountryData]);

  useEffect(() => {
    let cities: ICity[] = [];

    if (selectedCountryData && selectedStateData) {
      cities = getCitiesByStateAndCountry(
        selectedCountryData.isoCode,
        selectedStateData.isoCode
      );
    }

    setCities(cities);
  }, [selectedCountryData, selectedStateData]);

  const onSubmit = (values: FormValues) => {
    dispatch(updatePersonalInformation(values));
    previousPersonalRef.current = values;
    goToNextStep(Step.PersonalInformation);
  };

  const renderNameFormItem = () => {
    const fieldId = "name-input";
    const errorId = errors.name ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.name")}
        validateStatus={errors.name ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "name" as keyof FormValues,
          errors.name,
          t
        )}
      >
        <Controller
          name="name"
          control={control}
          rules={{
            required: true,
            minLength: {
              value: 2,
              message: "minLength:2",
            },
          }}
          render={({ field }) => (
            <Input
              id={fieldId}
              type="text"
              {...field}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderNationalIdFormItem = () => {
    const fieldId = "nationalId-input";
    const errorId = errors.nationalId ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.nationalId")}
        validateStatus={errors.nationalId ? "error" : ""}
        help={
          <span id={errorId} role="alert" aria-live="polite">
            {getErrorHelp<FormValues>(
              "nationalId" as keyof FormValues,
              errors.nationalId,
              t
            )}
          </span>
        }
      >
        <Controller
          name="nationalId"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: /^[A-Z0-9-]+$/i,
              message: "pattern",
            },
          }}
          render={({ field }) => (
            <Input
              id={fieldId}
              type="text"
              {...field}
              aria-invalid={errors.nationalId ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderDateOfBirthFormItem = () => {
    const fieldId = "dateOfBirth-input";
    const errorId = errors.dateOfBirth ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.dateOfBirth")}
        validateStatus={errors.dateOfBirth ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "dateOfBirth" as keyof FormValues,
          errors.dateOfBirth,
          t
        )}
      >
        <Controller
          name="dateOfBirth"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              id={fieldId}
              style={{ width: "100%" }}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                const dateValue = date ? dayjs(date).format("YYYY-MM-DD") : "";
                field.onChange(dateValue);
              }}
              aria-label="date-of-birth"
              aria-invalid={errors.dateOfBirth ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderGenderFormItem = () => {
    const fieldId = "gender-input";
    const errorId = errors.gender ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.gender")}
        validateStatus={errors.gender ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "gender" as keyof FormValues,
          errors.gender,
          t
        )}
      >
        <Controller
          name="gender"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Radio.Group
              id={fieldId}
              {...field}
              value={field.value}
              aria-label="gender"
              aria-invalid={errors.gender ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            >
              <Radio value={GenderOptions.MALE}>{t("form.male")}</Radio>
              <Radio value={GenderOptions.FEMALE}>{t("form.female")}</Radio>
              <Radio value={GenderOptions.OTHER}>{t("form.other")}</Radio>
            </Radio.Group>
          )}
        />
      </Form.Item>
    );
  };

  const renderAddressFormItem = () => {
    const fieldId = "address-input";
    const errorId = errors.address ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.address")}
        validateStatus={errors.address ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "address" as keyof FormValues,
          errors.address,
          t
        )}
      >
        <Controller
          name="address"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              id={fieldId}
              type="text"
              {...field}
              aria-label="address"
              aria-invalid={errors.address ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderCountryFormItem = () => {
    const fieldId = "country-input";
    const errorId = errors.country ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.country")}
        validateStatus={errors.country ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "country" as keyof FormValues,
          errors.country,
          t
        )}
      >
        <Controller
          name="country"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id={fieldId}
              {...field}
              aria-label="country"
              aria-invalid={errors.country ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
              showSearch
              placeholder={t("form.selectCountry", {
                defaultValue: "Select Country",
              })}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={countries.map((country) => ({
                value: country.name,
                label: `${country.flag} ${country.name}`,
              }))}
              value={field.value || undefined}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderStateFormItem = () => {
    const fieldId = "state-input";
    const errorId = errors.state ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.state")}
        validateStatus={errors.state ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "state" as keyof FormValues,
          errors.state,
          t
        )}
      >
        <Controller
          name="state"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id={fieldId}
              {...field}
              aria-label="state"
              aria-invalid={errors.state ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
              showSearch
              placeholder={t("form.selectState", {
                defaultValue: "Select State",
              })}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={states.map((state) => ({
                value: state.name,
                label: state.name,
              }))}
              disabled={!selectedCountryData}
              notFoundContent={
                !selectedCountryData
                  ? t("form.selectCountryFirst", {
                      defaultValue: "Please select a country first",
                    })
                  : states.length === 0 && selectedCountryData
                  ? t("form.noStatesAvailable", {
                      defaultValue: "No states available",
                    })
                  : null
              }
              value={field.value || undefined}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderCityFormItem = () => {
    const fieldId = "city-input";
    const errorId = errors.city ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.city")}
        validateStatus={errors.city ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "city" as keyof FormValues,
          errors.city,
          t
        )}
      >
        <Controller
          name="city"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id={fieldId}
              {...field}
              aria-label="city"
              aria-invalid={errors.city ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
              showSearch
              placeholder={t("form.selectCity", {
                defaultValue: "Select City",
              })}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={cities.map((city) => ({
                value: city.name,
                label: city.name,
              }))}
              disabled={!selectedStateData}
              notFoundContent={
                !selectedStateData
                  ? t("form.selectStateFirst", {
                      defaultValue: "Please select a state first",
                    })
                  : null
              }
              value={field.value || undefined}
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderPhoneFormItem = () => {
    const fieldId = "phone-input";
    const errorId = errors.phone ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.phone")}
        validateStatus={errors.phone ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "phone" as keyof FormValues,
          errors.phone,
          t
        )}
      >
        <Controller
          name="phone"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: /^[+]?[\d\s-()]+$/,
              message: "pattern",
            },
          }}
          render={({ field }) => (
            <Input
              id={fieldId}
              type="text"
              {...field}
              aria-label="phone"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderEmailFormItem = () => {
    const fieldId = "email-input";
    const errorId = errors.email ? `${fieldId}-error` : undefined;

    return (
      <Form.Item
        label={t("form.email")}
        validateStatus={errors.email ? "error" : ""}
        help={getErrorHelp<FormValues>(
          "email" as keyof FormValues,
          errors.email,
          t
        )}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: "pattern",
            },
          }}
          render={({ field }) => (
            <Input
              id={fieldId}
              type="email"
              {...field}
              aria-label="email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errorId}
              aria-required="true"
            />
          )}
        />
      </Form.Item>
    );
  };

  const renderNextButton = () => {
    const fieldId = "next-button";

    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
      </div>
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      aria-label={t("form.personalInfo", {
        defaultValue: "Personal Information Form",
      })}
      role="form"
    >
      {renderNameFormItem()}
      {renderNationalIdFormItem()}
      {renderDateOfBirthFormItem()}
      {renderGenderFormItem()}
      {renderAddressFormItem()}
      {renderCountryFormItem()}
      {renderStateFormItem()}
      {renderCityFormItem()}
      {renderPhoneFormItem()}
      {renderEmailFormItem()}
      {renderNextButton()}
    </Form>
  );
}
