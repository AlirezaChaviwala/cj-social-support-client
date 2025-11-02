import { Modal, Input, Typography, message } from "antd";
import { useEffect, useState, useRef } from "react";
import { generateSuggestion } from "../services/openAIService";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  seedPrompt: string;
  onAccept: (text: string) => void;
  fieldLabel?: string;
};

export default function AIAssistModal({
  open,
  onClose,
  seedPrompt,
  onAccept,
  fieldLabel,
}: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);
  const textareaRef = useRef<any>(null);

  const getFallbackText = (): string => {
    const genericFallback = t("ai.fallback.generic", {
      defaultValue:
        "I am experiencing financial difficulties and respectfully request assistance to help me through this challenging time. Any support provided would be greatly appreciated and used to cover essential living expenses.",
    });

    if (!fieldLabel) {
      return genericFallback;
    }

    switch (fieldLabel) {
      case t("form.currentFinancialSituation"):
        return t("ai.fallback.financialSituation", {
          defaultValue:
            "I am currently experiencing financial difficulties due to reduced income and increased expenses. My monthly income is insufficient to cover basic necessities such as rent, utilities, and food. I am seeking assistance to help stabilize my financial situation during this challenging period.",
        });

      case t("form.employmentCircumstances"):
        return t("ai.fallback.employment", {
          defaultValue:
            "I have recently lost my employment and am actively seeking new job opportunities. The loss of steady income has significantly impacted my ability to meet my financial obligations. I am committed to finding new employment as soon as possible while requesting temporary support during this transition period.",
        });

      case t("form.reasonForApplying"):
        return t("ai.fallback.reasonForApplying", {
          defaultValue:
            "I am applying for financial support to help cover essential living expenses during a period of financial hardship. This assistance will enable me to maintain housing stability and meet basic needs while I work toward improving my financial situation. I am committed to using this support responsibly and am grateful for any assistance provided.",
        });

      default:
        return genericFallback;
    }
  };

  useEffect(() => {
    if (open && textareaRef.current && !loading) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [open, loading]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  useEffect(() => {
    const run = async () => {
      if (!open) {
        setText("");
        setUsedFallback(false);
        return;
      }

      setLoading(true);
      setUsedFallback(false);

      const fallbackText = getFallbackText();

      try {
        const suggestion = await generateSuggestion(seedPrompt);

        if (!suggestion || suggestion.trim().length < 10) {
          setText(fallbackText);
          setUsedFallback(true);
          return;
        }

        setText(suggestion);
        setUsedFallback(false);
      } catch (error) {
        setText(fallbackText);
        setUsedFallback(true);
        message.info(
          t("ai.usingFallback", {
            defaultValue:
              "AI service unavailable. Showing a template suggestion you can edit.",
          })
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, seedPrompt, t, fieldLabel]);

  const handleOk = () => {
    if (!text.trim()) {
      message.warning(
        t("modal.waitForSuggestion", {
          defaultValue: "Please wait for a suggestion or close this dialog.",
        })
      );
      return;
    }
    onAccept(text);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={t("suggestionTitle")}
      onOk={handleOk}
      onCancel={onClose}
      okText={t("accept", { defaultValue: "Accept" })}
      cancelText={t("discard", { defaultValue: "Discard" })}
      confirmLoading={loading}
      okButtonProps={{
        disabled: !text.trim() || loading,
        "aria-label": t("accept", { defaultValue: "Accept suggestion" }),
      }}
      cancelButtonProps={{
        "aria-label": t("discard", { defaultValue: "Discard suggestion" }),
      }}
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-description"
    >
      <div id="ai-modal-description">
        {renderTypography()}
        {renderInput()}
      </div>
    </Modal>
  );

  function renderTypography() {
    if (loading) {
      return (
        <Typography.Paragraph role="status" aria-live="polite" aria-busy="true">
          {t("loading", { defaultValue: "Generating suggestion..." })}
        </Typography.Paragraph>
      );
    }

    if (usedFallback) {
      return (
        <Typography.Paragraph
          type="secondary"
          style={{ fontSize: 12, marginBottom: 8 }}
        >
          {t("ai.fallbackNote", {
            defaultValue:
              "Note: This is a template suggestion. Please edit it to reflect your specific situation.",
          })}
        </Typography.Paragraph>
      );
    }

    return null;
  }

  function renderInput() {
    const textareaId = "ai-suggestion-textarea";

    if (loading) {
      return (
        <Input.TextArea
          id={textareaId}
          rows={8}
          disabled
          aria-label={t("suggestionTextarea", {
            defaultValue: "AI suggestion text area",
          })}
          aria-busy="true"
        />
      );
    }

    return (
      <Input.TextArea
        id={textareaId}
        ref={textareaRef}
        rows={8}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder={
          loading
            ? t("loading", { defaultValue: "Generating..." })
            : t("editSuggestion", {
                defaultValue: "Edit the suggestion or wait for it to load...",
              })
        }
        aria-label={t("suggestionTextarea", {
          defaultValue: "AI suggestion text area",
        })}
        aria-describedby="ai-modal-description"
      />
    );
  }
}
