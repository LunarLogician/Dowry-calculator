import { useEffect } from "react";

export default function AdUnit({ slot, format = "horizontal" }) {
  useEffect(() => {
    // Push ad when component mounts
    if (window.adsbygoogle && window.adsbygoogle.length > 0) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log("AdSense error:", e);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        textAlign: "center",
        margin: "20px 0",
      }}
      data-ad-client="ca-pub-5341942172209227"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
