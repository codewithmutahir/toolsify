import type { Appearance } from "@clerk/types";

const clerkFormFieldInput =
  "!h-auto !max-h-none min-h-12 box-border bg-surface-container-low border border-outline-variant rounded-lg px-md py-3 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body text-body leading-normal";

const clerkFormButtonPrimary =
  "!h-auto !max-h-none min-h-12 box-border w-full bg-primary-container hover:brightness-110 text-on-primary rounded-lg font-display font-bold text-body py-3 px-md shadow-sm active:scale-[0.98] transition-all";

const clerkSocialButton =
  "!h-auto !max-h-none min-h-11 box-border flex items-center justify-center gap-sm bg-white border border-outline-variant rounded-lg py-3 px-md hover:bg-surface-container-low active:scale-[0.98] transition-all font-body text-body text-on-surface font-medium";

const clerkLayoutElements = {
  rootBox: "w-full overflow-visible",
  cardBox: "shadow-none overflow-visible h-auto",
  card: "shadow-none border-0 bg-transparent p-0 gap-md overflow-visible h-auto",
  scrollBox: "overflow-visible max-h-none h-auto",
  main: "gap-md overflow-visible",
  form: "gap-md overflow-visible",
  formFieldRow: "overflow-visible",
  formField: "overflow-visible",
  formFieldInputGroup: "overflow-visible min-h-12",
};

export const clerkAuthAppearance: Appearance = {
  elements: {
    ...clerkLayoutElements,
    rootBox: "w-full max-w-[440px] overflow-visible",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton: clerkSocialButton,
    socialButtonsBlockButtonText:
      "font-body text-body text-on-surface font-medium leading-normal",
    dividerLine: "bg-outline-variant",
    dividerText:
      "bg-surface-container-lowest px-md text-on-surface-variant uppercase font-label text-label",
    formButtonPrimary: clerkFormButtonPrimary,
    formFieldInput: clerkFormFieldInput,
    formFieldLabel:
      "font-label text-label text-on-surface-variant uppercase tracking-wider",
    footerActionLink: "text-primary-container font-semibold hover:underline",
    identityPreviewEditButton: "text-primary-container",
    formFieldAction: "text-primary hover:underline font-small text-small",
    footer: "mt-xl overflow-visible pt-md",
    footerActionText: "font-body text-body text-on-surface-variant",
    alternativeMethodsBlockButton:
      "border border-outline-variant rounded-lg hover:bg-surface-container-low min-h-11",
  },
  variables: {
    colorPrimary: "#ff6b35",
    colorBackground: "#ffffff",
    colorText: "#1a1a2e",
    colorTextSecondary: "#594139",
    colorInputBackground: "#f5f2ff",
    colorInputText: "#1a1a2e",
    borderRadius: "0.5rem",
    fontFamily: "Inter, sans-serif",
  },
};

export const clerkSignUpAppearance: Appearance = {
  ...clerkAuthAppearance,
  elements: {
    ...clerkAuthAppearance.elements,
    rootBox: "w-full max-w-[480px] overflow-visible",
    formFieldInput:
      "!h-auto !max-h-none min-h-12 box-border bg-surface border border-outline-variant rounded-lg px-md py-3 focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all font-body text-body leading-normal",
    formFieldLabel: "font-label text-on-surface-variant",
    dividerText:
      "bg-surface-container-lowest px-md font-label text-outline text-[10px] uppercase tracking-widest",
    footerActionLink: "text-primary font-bold hover:underline",
    otpCodeField: "hidden",
    otpCodeFieldInputs: "hidden",
    otpCodeFieldInput: "hidden",
    verificationLinkStatusBox: "hidden",
  },
};

export const userButtonAppearance: Appearance = {
  elements: {
    avatarBox: "w-9 h-9",
    userButtonPopoverCard:
      "border border-outline-variant shadow-xl rounded-xl",
    userButtonPopoverActionButton:
      "hover:bg-surface-container-low rounded-lg",
    userButtonPopoverActionButtonText:
      "font-body text-body text-on-surface",
  },
  variables: {
    colorPrimary: "#ff6b35",
    borderRadius: "0.5rem",
  },
};
