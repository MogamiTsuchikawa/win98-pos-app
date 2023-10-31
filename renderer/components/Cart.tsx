import { CartItem } from "../interfaces/item";

type Props = {
  items: CartItem[];
  onCancel: (item: CartItem) => void;
};
const Cart = ({ items, onCancel }: Props) => {
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>商品名</th>
          <th>金額</th>
          <th>キャンセル</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.addAt.toLocaleTimeString()}>
            <td>{item.name}</td>
            <td>{item.price}円</td>
            <td>
              <button
                onClick={() => {
                  onCancel(item);
                }}
              >
                ｷｬﾝｾﾙ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Cart;
