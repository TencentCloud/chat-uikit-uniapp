import en from './en';
import zh_cn from './zh_cn';
import zh_tw from './zh_tw';
import TUILocales from '../TUIKit/locales/index';

const demoLocales = {
  ...en,
  ...zh_cn,
  ...zh_tw,
};

const locales = {};

const allLanguages = new Set([
  ...Object.keys(demoLocales),
  ...Object.keys(TUILocales),
]);

allLanguages.forEach((lang) => {
  locales[lang] = {
    ...(demoLocales[lang] || {}),
    ...(TUILocales[lang] || {}),
  };
});

export { locales, demoLocales };
