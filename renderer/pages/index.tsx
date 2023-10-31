import { useEffect, useState } from "react";
import Link from "next/link";
import Cart from "../components/Cart";
import ItemBox from "../components/ItemBox";
import { useRecoilState } from "recoil";
import { itemsState, itemLimitsState } from "../atom";
import { Item, CartItem } from "../interfaces/item";
import Kanjo from "../components/Kanjo";

const IndexPage = () => {
  const [items, setItems] = useRecoilState(itemsState);
  const [itemLimits, setItemLimits] = useRecoilState(itemLimitsState);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    global.ipcRenderer.on("loadedJson", (event, arg) => {
      setItems(arg.items);
      setItemLimits(arg.itemLimits);
    });
    global.ipcRenderer.send("loadJson");
    return () => {
      global.ipcRenderer.removeAllListeners("loaded");
    };
  }, []);
  const onCancel = () => {
    setCartItems([]);
  };
  const onSubmit = (inputMoney: number) => {
    global.ipcRenderer.send("submit", { inputMoney, cartItems });
    setCartItems([]);
  };
  if (items.length === 0 || itemLimits.length === 0)
    return <div>loading...</div>;
  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex" }}>
      <div style={{ width: 300 }}>
        <Cart
          items={cartItems}
          onCancel={(i) => {
            setCartItems(
              cartItems.filter(
                (ci) =>
                  ci.addAt.toLocaleTimeString() !== i.addAt.toLocaleTimeString()
              )
            );
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            marginBottom: "10px",
          }}
        >
          <Kanjo
            cartItems={cartItems}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </div>
      </div>
      <div style={{ overflowY: "auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {items.map((item) => (
            <ItemBox
              key={item.id}
              item={item}
              itemLimit={
                itemLimits ? itemLimits.find((l) => l.id === item.id) : null
              }
              onClick={(it) => {
                setCartItems([...cartItems, { ...it, addAt: new Date() }]);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
