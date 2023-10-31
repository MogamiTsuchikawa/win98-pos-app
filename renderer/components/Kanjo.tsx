import { useState } from "react";
import { CartItem } from "../interfaces/item";

type Props = {
  cartItems: CartItem[];
  onSubmit: (inputMoney: number) => void;
  onCancel: () => void;
};

const Kanjo = ({ cartItems, onSubmit, onCancel }: Props) => {
  const [inputMoney, setInputMoney] = useState(0);
  const sumMoney = () => {
    let sum = 0;
    for (let i = 0; i < cartItems.length; i++) {
      sum += cartItems[i].price;
    }
    return sum;
  };
  return (
    <div>
      <table style={{ fontSize: 20 }}>
        <tbody>
          <tr>
            <td>合計</td>
            <td>{sumMoney()}円</td>
          </tr>
          <tr>
            <td>
              <button
                onClick={() => {
                  setInputMoney(sumMoney());
                }}
              >
                同額
              </button>
            </td>
            <td>
              <button
                onClick={() => {
                  setInputMoney(1500);
                }}
              >
                1500円
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button
                onClick={() => {
                  setInputMoney(1000);
                }}
              >
                1000円
              </button>
            </td>
            <td>
              <button
                onClick={() => {
                  setInputMoney(500);
                }}
              >
                500円
              </button>
            </td>
          </tr>
          <tr>
            <td>お預かり</td>
            <td>
              <input
                type="number"
                value={inputMoney}
                style={{ fontSize: 18, width: 90 }}
                onChange={(e) => {
                  setInputMoney(parseInt(e.target.value));
                }}
              />
              円
            </td>
          </tr>
        </tbody>
      </table>
      <button
        style={{ width: 200, marginBottom: 5 }}
        onClick={() => {
          onSubmit(inputMoney);
        }}
        disabled={inputMoney < sumMoney()}
      >
        購入
      </button>
      <br />
      <button style={{ width: 200 }} onClick={onCancel}>
        ｷｬﾝｾﾙ
      </button>
    </div>
  );
};

export default Kanjo;
