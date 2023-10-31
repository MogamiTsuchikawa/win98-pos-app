export type Item = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = Item & {
  addAt: Date;
};

export type ItemLimit = {
  id: string;
  limit: number;
};
