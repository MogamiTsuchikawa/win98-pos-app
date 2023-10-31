import { Item, ItemLimit } from "../interfaces/item";

type Props = {
  item: Item;
  itemLimit: ItemLimit;
  onClick: (item: Item) => void;
};
const ItemBox = ({ item, itemLimit, onClick }: Props) => {
  return (
    <div
      style={{
        width: 150,
        height: 250,
        border: "1px solid black",
        boxSizing: "border-box",
        margin: 5,
      }}
    >
      <img
        src="https://mogami.dev/myicon.jpg"
        style={{ width: "100%", height: 150, objectFit: "cover" }}
      />
      <div style={{ padding: 5 }}>
        <div style={{ fontWeight: "bold", fontSize: 12 }}>{item.name}</div>
        <div style={{ display: "flex" }}>
          <div style={{ width: 150 }}>
            <div style={{ fontWeight: "bold" }}>{item.price}円</div>
            {itemLimit.limit > 0 ? (
              <div style={{}}>在庫: {itemLimit.limit}</div>
            ) : (
              <div style={{ color: "red" }}>売り切れ</div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            <button
              style={{ width: "100%", height: "50px", fontSize: 20 }}
              onClick={() => {
                onClick(item);
              }}
            >
              追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBox;
