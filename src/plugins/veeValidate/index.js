import { defineRule, configure } from "vee-validate";
import { required, email, alpha, numeric} from "@vee-validate/rules";
import { t } from "../i18n"; // Adjust the path to your i18n file

// Configure VeeValidate to use localized error messages
configure({
  generateMessage: ({ field, rule }) => {
    return t(`validation.${rule}`, { field });
  },
});

// Required field validation
defineRule("required", (value) => {
  return value ? true : t("errorMsgs.required");
});

defineRule("requiredBoolean", (value) => {
  return typeof value === "boolean" ? true : t("errorMsgs.required");
});

// Alphabetical validation
defineRule("alpha", (value) => {
  return alpha(value) || t("errorMsgs.alpha");
});

// Define a custom alpha rule that allows spaces
defineRule("alphaWithSpaces", (value) => {
  // If value is empty, return true (this can be handled by required rule if needed)
  if (!value || !value.length) {
    return true;
  }
  
  // Test for alpha characters and spaces only
  // This regex allows alphabetic characters (both cases) and spaces
  const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
  
  return alphaWithSpacesRegex.test(value) || t("errorMsgs.alphaWithSpaces");
});

// First name validation (2 to 30 characters, only letters)
defineRule("firstname", (value) => {
  if (!value || typeof value !== "string" || !alpha(value) || value.length < 2 || value.length > 30) {
    return t("errorMsgs.firstName");
  }
  return true;
});

// Last name validation (2 to 30 characters, only letters)
defineRule("lastname", (value) => {
  if (!value || typeof value !== "string" || !alpha(value) || value.length < 2 || value.length > 30) {
    return t("errorMsgs.lastName");
  }
  return true;
});

// Email validation
defineRule("email", (value) => {
  return email(value) || t("errorMsgs.email");
});

// Phone number validation (10-15 digits)
defineRule("phoneno", (value) => {
  if (!value || typeof value !== "string" || !numeric(value) || value.length < 10 || value.length > 15) {
    return t("errorMsgs.phone");
  }
  return true;
});

// Password validation (8 to 30 characters)
defineRule("password", (value) => {
  if (!value || typeof value !== "string" || value.length < 8 || value.length > 30) {
    return t("errorMsgs.password");
  }
  return true;
});

// Confirm password validation
defineRule("confirmed", (value, [target]) => {
  return value === target ? true : t("errorMsgs.confirmPassword");
});

// Textarea validation (Max 40,000 characters)
defineRule("textArea", (value) => {
  if (!value || typeof value !== "string" || value.length > 40000) {
    return t("errorMsgs.textArea");
  }
  return true;
});

// Range validation (0 to 100)
defineRule("range", (value) => {
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return t("errorMsgs.numeric");
  }
  if (numValue < 0 || numValue > 100) {
    return t("errorMsgs.rangeError", { min: 0, max: 100 });
  }
  return true;
});

// Number validation (0 to 999999)
defineRule("numberRule", (value) => {
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return t("errorMsgs.numeric");
  }
  if (numValue < 0 || numValue > 999999) {
    return t("errorMsgs.numberError", { min: 0, max: 999999 });
  }
  return true;
});


defineRule("maxDigits", (value, [limit]) => {
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return t("errorMsgs.numeric");
  }
  if (value.toString().length > limit) {
    return t("errorMsgs.maxDigits", { max: limit });
  }
  return true;
});

defineRule("textArea", (value)=>{
  if (!(value.length <= 40000)) {
    return t("errorMsgs.textArea");
  }
  return true;
})

defineRule("requiredSelect", (value) => {
  return value !== null && value !== undefined ? true : t("errorMsgs.required");
});

defineRule("range", (value) => {
  if (!numeric(value)) {
    return t("errorMsgs.numeric");
  }
  const numValue = Number(value);
  if (numValue < 0 || numValue > 100) {
    return t("errorMsgs.rangeError", { min: 0, max: 100 });
  }
  return true;
});

defineRule("numberRule", (value) => {
  if (!numeric(value)) {
    return t("errorMsgs.numeric");
  }
  const numValue = Number(value);
  if (numValue < 0 || numValue > 999999) {
    return t("errorMsgs.numberError", { min: 0, max: 999999 });
  }
  return true;
});
