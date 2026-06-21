import { useEffect, useState } from "react";
import QR from "qrcode";

export function QRCode({ value, size = 200 }: { value: string; size?: number }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QR.toDataURL(value, { width: size, margin: 1, color: { dark: "#0B1220", light: "#FFFFFF" } })
      .then(setSrc)
      .catch(() => setSrc(""));
  }, [value, size]);
  if (!src) return <div style={{ width: size, height: size }} className="animate-pulse rounded-xl bg-slate-100" />;
  return <img src={src} width={size} height={size} alt="QR Code" className="rounded-xl" />;
}
