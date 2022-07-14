import { makeAutoObservable } from "mobx";

export const userStore = makeAutoObservable({
  token: "123134",
  username: "amdin",
  userInfo: {},
});
