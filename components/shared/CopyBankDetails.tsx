"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function CopyBankDetails() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `Bank: ${site.bankDetails.bankName}\nAccount name: ${site.bankDetails.accountName}\nAccount number: ${site.bankDetails.accountNumber}\nSWIFT: ${site.bankDetails.swiftCode}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? "Copied" : "Copy bank details"}
    </Button>
  );
}
