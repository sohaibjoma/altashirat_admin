import { defineRule, configure } from "vee-validate";
import { required, email, alpha, numeric} from "@vee-validate/rules";
import { t } from "../i18n"; // Adjust the path to your i18n file

// Configure VeeValidate to use localized error messages
configure({
  generateMessage: ({ field, rule }) => {
    // Use the `t` function for localized error messages
    return t(`validation.${rule}`, { field });
  },
});


defineRule("required", (value) => {
  return value ? true : t("errorMsgs.required");
});

defineRule("requiredBoolean", (value) => {
  return typeof value === "boolean" ? true : t("errorMsgs.required");
});

defineRule("alpha", (value) => {
  return alpha(value) || t("errorMsgs.alpha");
})

defineRule("firstname", (value) => {
  if(!alpha(value)|| !(value.length >= 2 && value.length <= 30)){
    return t("errorMsgs.firstName");
  }
  return true;
})


defineRule("lastname", (value) => {
  if(!alpha(value)|| !(value.length >= 2 && value.length <= 30)){
    return t("errorMsgs.lastName");
  }
  return true;
})

defineRule("email", (value) => {
  return email(value) || t("errorMsgs.email");
});

defineRule('phoneno', value => {
  if(!numeric(value)|| !(value.length >= 10 && value.length <= 15)){
    return t("errorMsgs.phone");
  }
  return true;
});

defineRule('password', value => {
  if(!(value.length >= 8 && value.length <= 30)){
    return t("errorMsgs.password");
  }
  return true;
});


defineRule("confirmed", (value, [target]) => {
  // 'target' is the name of the field to compare against
  if (value === target) {
    return true;
  }
  return t("errorMsgs.confirmPassword");

});

