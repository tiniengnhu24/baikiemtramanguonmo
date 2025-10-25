// import { products } from "./data/product";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ListProducts = () => {
  const [listproduct, SetListProduct] = useState([]);

  useEffect(() => {
    const LayDulieutuBackend = async () => {
      try {
        const res = await axios.get(
          "https://68fc79cb96f6ff19b9f53b04.mockapi.io/PRODUCT"
        );
        SetListProduct(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    LayDulieutuBackend();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh", // Chiếm toàn bộ chiều cao màn hình
        display: "flex",
        justifyContent: "center", // Căn giữa ngang

        backgroundColor: "#f9f9f9", // Tuỳ chọn
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          maxWidth: "1000px", // Giới hạn chiều rộng
          width: "100%",
        }}
      >
        {listproduct.map((motsp) => (
          <div
            key={motsp.id}
            style={{
              height: "300px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={motsp.image}
              alt={motsp.title}
              style={{
                height: "140px",

                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <h3 style={{ margin: "10px 0 5px" }}>{motsp.title}</h3>
            <p>{motsp.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProducts;