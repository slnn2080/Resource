import Vue from 'vue';
import * as VeeValidate from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ja from 'vee-validate/dist/locale/ja.json';
import * as defaultRules from 'vee-validate/dist/rules';
import { Plugin } from '@nuxt/types';
import { customRules } from '@/utils/ValidationCustomRoles'

for (const [name, rule] of Object.entries(defaultRules)) {
  VeeValidate.extend(name, rule as any);
}
for (const [name, rule] of Object.entries(customRules)) {
  VeeValidate.extend(name, rule as any);
}

Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
// default lang 'ja'
VeeValidate.localize('ja', ja);
const validationMessages: any = {
  ja,
  en
};
const veeValidate: Plugin = (context, inject) => {
  inject('changeValidationLanguage', (lang: string) => {
    VeeValidate.localize(`${lang}`, validationMessages[lang]);
  });
};
export default veeValidate;
