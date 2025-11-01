import { Modal, Input, Typography, message } from "antd";
import { useEffect, useState, useRef } from "react";
import { generateSuggestion } from "../services/openAIService";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  seedPrompt: string;
  onAccept: (text: string) => void;
};

export default function AIAssistModal({
  open,
  onClose,
  seedPrompt,
  onAccept,
}: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [hasError, setHasError] = useState(false);
  const textareaRef = useRef<any>(null);

  // Focus management: focus textarea when modal opens
  useEffect(() => {
    if (open && textareaRef.current && !loading) {
      // Delay to ensure modal is fully rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [open, loading]);

  // Keyboard handler: Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
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
        setHasError(false);
        return;
      }

      setLoading(true);
      setHasError(false);

      try {
        const suggestion = await generateSuggestion(seedPrompt);
        if (!suggestion || suggestion.trim() === "") {
          setHasError(true);
          message.error(
            t("errors.generic", {
              defaultValue: "Something went wrong. Please try again.",
            })
          );
          setText("");
        } else {
          setText(suggestion);
        }
      } catch (error) {
        setHasError(true);
        message.error(
          t("errors.generic", {
            defaultValue: "Something went wrong. Please try again.",
          })
        );
        setText("");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, seedPrompt, t]);

  const handleOk = () => {
    if (!text.trim() || hasError) {
      message.warning(
        t("modal.waitForSuggestion", {
          defaultValue:
            "Please wait for a valid suggestion or close this dialog.",
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
        disabled: !text.trim() || hasError || loading,
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

    if (hasError) {
      return (
        <Typography.Paragraph type="danger" role="alert" aria-live="assertive">
          {t("errors.generic", {
            defaultValue: "Failed to generate suggestion. Please try again.",
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
          if (hasError && e.target.value.trim()) {
            setHasError(false);
          }
        }}
        placeholder={
          loading
            ? t("loading", { defaultValue: "Generating..." })
            : t("editSuggestion", {
                defaultValue: "Edit the suggestion or wait for it to load...",
              })
        }
        // placeholder={t("editSuggestion", {
        //   defaultValue: "Edit the suggestion or wait for it to load...",
        // })}
        aria-label={t("suggestionTextarea", {
          defaultValue: "AI suggestion text area",
        })}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby="ai-modal-description"
      />
    );
  }
}
