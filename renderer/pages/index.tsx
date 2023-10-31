import { useEffect } from "react";
import Link from "next/link";
import Cart from "../components/Cart";
import ItemBox from "../components/ItemBox";

const IndexPage = () => {
  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex" }}>
      <div style={{ width: 300 }}>
        <Cart />
      </div>
      <div style={{ overflowY: "auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <ItemBox />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
