import Link from "next/link";

interface FormPrivacyNoticeProps {
  /** Customize the notice text for the specific form. */
  text?: string;
  className?: string;
}

const defaultText =
  "We will only use your details to respond to your enquiry. See our";

export function FormPrivacyNotice({
  text = defaultText,
  className,
}: FormPrivacyNoticeProps) {
  return (
    <p className={`text-xs text-muted-foreground ${className ?? ""}`}>
      {text}{" "}
      <Link href="/privacy" className="text-primary hover:underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
