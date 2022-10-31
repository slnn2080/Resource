import { 
  SwitchTestPassResponseType,
  SwitchTestPassRequestType,
  GetTestPassRequestType,
  GetTestPassResponseType
} from '~/store/types/adapters/testPassAdapter';

const switchTestPassRes: SwitchTestPassResponseType | any = {
  status: 200,
  message: 'OK'
};
const getTestPassRes: GetTestPassResponseType | any = {
  status: 200,
  message: 'OK',
  result: {
    status: 1,
  }
};

export default {
  post({ data }: SwitchTestPassRequestType | any) {
    console.log('[Axios Mock Request Data] :', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, switchTestPassRes]);
      }, 500);
    });
  },
  get({ data }: GetTestPassRequestType | any) {
    console.log('[Axios Mock Request Data] :', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, getTestPassRes]);
      }, 500);
    });
  }
};
