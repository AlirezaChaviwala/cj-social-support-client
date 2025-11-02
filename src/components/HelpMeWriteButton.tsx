import { Button } from "antd";
import { useState } from "react";
import AIAssistModal from "./AIAssistModal";
import { useTranslation } from "react-i18next";

type Props = {
  seedPrompt: string;
  onAccept: (text: string) => void;
  fieldLabel?: string;
};

export default function HelpMeWriteButton({
  seedPrompt,
  onAccept,
  fieldLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const ariaLabel = fieldLabel
    ? t("helpMeWriteForField", {
        defaultValue: "Help me write {{field}}",
        field: fieldLabel,
      })
    : t("helpMeWrite");

  return (
    <>
      <Button
        size="small"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
      >
        {t("helpMeWrite")}
      </Button>
      <AIAssistModal
        open={open}
        onClose={() => setOpen(false)}
        seedPrompt={seedPrompt}
        onAccept={onAccept}
        fieldLabel={fieldLabel}
      />
    </>
  );
}
