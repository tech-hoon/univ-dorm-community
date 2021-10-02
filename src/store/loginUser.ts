import { atom, selector } from 'recoil';

interface loginUserType {
  displayName?: string | null;
  uid?: string;
}

export const loginUserState = atom<loginUserType>({
  key: 'login_user',
  default: {},
});

export const loginState = selector({
  key: 'is_logged_in',
  get: ({ get }) =>
    !(Object.keys(get(loginUserState)).length === 0 && get(loginUserState).constructor === Object),
});
