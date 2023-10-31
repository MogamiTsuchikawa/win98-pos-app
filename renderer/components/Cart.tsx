const Cart = () => {
  const items = [];
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {items.map((item) => (
        <div key={item} style={{ width: "100%" }}></div>
      ))}
    </div>
  );
};

export default Cart;
