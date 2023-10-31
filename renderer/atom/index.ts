import { atom } from "recoil";
import { Item, ItemLimit } from "../interfaces/item";

export const itemsState = atom<Item[]>({
  key: "items",
  default: [],
});

export const itemLimitsState = atom<ItemLimit[]>({
  key: "itemLimits",
  default: [],
});
