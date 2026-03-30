import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/products/")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🛒 ADD TO CART
  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === item.id);
      if (exist) {
        return prev.map(p =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ➕➖ QTY
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 💳 ORDER BUTTON
  const handlePayAndOrder = () => {
    if (cart.length === 0) {
      alert("Please add product first ❌");
      return;
    }
    setShowOrderPage(true);
  };

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  const confirmOrder = () => {
    alert("Order placed successfully 🎉");
    setOrderPlaced(true);
    setCart([]);
  };

  const goBack = () => {
    setShowOrderPage(false);
    setOrderPlaced(false);
  };

  // 🔍 SEARCH
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#f5f5f6", minHeight: "100vh", padding: "20px" }}>

      {/* 🔥 NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        background: "linear-gradient(90deg,#ff3f6c,#ff9068)",
        padding: "15px",
        borderRadius: "10px",
        color: "white",
        marginBottom: "20px"
      }}>
        <h2>ShopNest 🛍️</h2>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            borderRadius: "20px",
            padding: "8px",
            border: "none"
          }}
        />

        <div>🛒 {cart.length}</div>
      </div>

      {/* 🛍️ PRODUCTS */}
      {!showOrderPage && (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "20px"
          }}>
            {filtered.map(item => (
              <div key={item.id} style={{
                background: "white",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />

                <h3>{item.name}</h3>
                <p style={{ color: "#ff3f6c" }}>₹{item.price}</p>

                <button
                  onClick={() => addToCart(item)}
                  style={{
                    background: "#ff3f6c",
                    color: "white",
                    border: "none",
                    padding: "8px",
                    marginRight: "5px",
                    borderRadius: "5px"
                  }}
                >
                  Add to Cart 🛒
                </button>

                {/* ⚡ ORDER NOW FIX */}
                <button
                  onClick={() => {
                    setCart([{ ...item, qty: 1 }]);
                    setShowOrderPage(true);
                  }}
                  style={{
                    background: "#00c853",
                    color: "white",
                    border: "none",
                    padding: "8px",
                    borderRadius: "5px"
                  }}
                >
                  Order Now ⚡
                </button>

              </div>
            ))}
          </div>

          {/* 🛒 CART */}
          <h2 style={{ marginTop: "20px" }}>Cart</h2>

          {cart.length === 0 && <p>Cart empty 🛒</p>}

          {cart.map(item => (
            <div key={item.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}>
              <div>
                <b>{item.name}</b> - ₹{item.price}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => decreaseQty(item.id)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>❌</button>
              </div>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button
            onClick={handlePayAndOrder}
            style={{
              background: "#2962ff",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px"
            }}
          >
            Pay & Order 💳
          </button>
        </>
      )}

      {/* 💳 ORDER PAGE */}
      {showOrderPage && (
        <div>
          <h2>Order Summary</h2>

          {cart.map(item => (
            <div key={item.id}>
              {item.name} × {item.qty}
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          {!orderPlaced ? (
            <button onClick={confirmOrder}>
              Confirm Order ✅
            </button>
          ) : (
            <div style={{
              background: "green",
              color: "white",
              padding: "20px",
              borderRadius: "10px"
            }}>
              🎉 Order Placed Successfully!
            </div>
          )}

          <button onClick={goBack}>⬅ Back</button>
        </div>
      )}

    </div>
  );
}

export default App;