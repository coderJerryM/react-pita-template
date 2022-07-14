import { createContext, useContext } from "react";
import { userStore } from "./user";

export const stores = { userStore };

export const RootStoreContext = createContext(stores);

export const useStores = () => useContext(RootStoreContext);
