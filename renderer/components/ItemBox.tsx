const ItemBox = () => {
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
        <div style={{ fontWeight: "bold", fontSize: 12 }}>
          芝じいアクリルキーホルダー
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <div style={{ fontWeight: "bold" }}>600円</div>
            <div style={{}}>在庫: 10</div>
            <div style={{ color: "red" }}>売り切れ</div>
          </div>
          <div>
            <button>追加</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBox;
