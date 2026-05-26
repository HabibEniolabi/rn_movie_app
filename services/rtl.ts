import { I18nManager } from "react-native";

export const isRTL = () => I18nManager.isRTL;

export const getRowDirection = () =>
  I18nManager.isRTL ? "row-reverse" : "row";

export const getTextAlign = () =>
  I18nManager.isRTL ? "right" : "left";

export const getWritingDirection = () =>
  I18nManager.isRTL ? "rtl" : "ltr";