type AuthMobileBrandingProps = {
  variant?: "sign-in" | "sign-up";
};

export default function AuthMobileBranding({
  variant = "sign-in",
}: AuthMobileBrandingProps) {
  const isSignUp = variant === "sign-up";

  return (
    <div
      className={`lg:hidden flex items-center gap-sm ${isSignUp ? "mb-xl" : "mb-2xl"}`}
    >
      <span
        className={`material-symbols-outlined text-[32px] ${
          isSignUp ? "text-primary text-[28px]" : "text-primary-container"
        }`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        construction
      </span>
      <span
        className={`font-display font-extrabold ${
          isSignUp
            ? "text-h3 text-primary"
            : "text-h2 text-primary-container"
        }`}
      >
        Toolsify
      </span>
    </div>
  );
}
