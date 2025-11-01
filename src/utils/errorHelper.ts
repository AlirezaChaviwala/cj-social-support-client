export const getErrorHelp = <T>(
  fieldName: keyof T,
  error: any,
  t: (key: string, options?: any) => string
) => {
  if (!error) return "";

  const fieldLabel = t(`form.${String(fieldName)}`);

  switch (error.type) {
    case "required":
      return t("form.errors.required", { field: fieldLabel });

    case "minLength":
      const minValue = error.ref?.value
        ? (error as any).min
        : error.message?.match(/\d+/)?.[0] || 2;
      return t("form.errors.minLength", {
        field: fieldLabel,
        min: parseInt(minValue),
      });

    case "pattern":
      return t("form.errors.invalidFormat", { field: fieldLabel });

    default:
      return "";
  }
};
