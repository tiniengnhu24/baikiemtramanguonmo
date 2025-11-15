import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const BUCKET = "product-images";

const ListProducts_SP_Admin = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    image: "",
    rating_rate: "",
    rating_count: "",
  });

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("product1")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("Lỗi khi tải sản phẩm:", error.message);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload ảnh lên Supabase, trả về public URL
  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileName = `product_${Date.now()}_${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, imageFile, { upsert: true });

    if (uploadError) {
      alert("❌ Lỗi upload ảnh: " + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Xử lý input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Thêm sản phẩm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    let imageUrl = await uploadImage();
    if (!imageUrl) imageUrl = "";

    const { error } = await supabase
      .from("product1")
      .insert([{ ...newProduct, image: imageUrl }]);

    if (error) alert("❌ Lỗi khi thêm sản phẩm: " + error.message);
    else {
      alert("✅ Thêm sản phẩm thành công!");
      setNewProduct({
        title: "",
        price: "",
        image: "",
        rating_rate: "",
        rating_count: "",
      });
      setImageFile(null);
      fetchProducts();
    }
  };

  // Cập nhật sản phẩm
  const handleEdit = async (e) => {
    e.preventDefault();
    let imageUrl = editingProduct.image;

    if (imageFile) {
      const uploaded = await uploadImage();
      if (uploaded) imageUrl = uploaded;
    }

    const { id, ...updated } = editingProduct;

    const { error } = await supabase
      .from("product1")
      .update({ ...updated, image: imageUrl })
      .eq("id", id);

    if (error) alert("❌ Lỗi khi cập nhật sản phẩm: " + error.message);
    else {
      alert("✅ Cập nhật sản phẩm thành công!");
      setEditingProduct(null);
      setImageFile(null);
      fetchProducts();
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      const { error } = await supabase.from("product1").delete().eq("id", id);
      if (error) alert("❌ Lỗi khi xóa sản phẩm: " + error.message);
      else {
        alert("🗑️ Đã xóa sản phẩm!");
        fetchProducts();
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-center text-blue-600">
        🛠️ Quản lý sản phẩm (Admin)
      </h2>

      {/* Form thêm/sửa */}
      <form
        onSubmit={editingProduct ? handleEdit : handleAdd}
        className="bg-white shadow-md rounded-lg p-6 mb-10 max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-medium mb-4">
          {editingProduct ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Tên sản phẩm"
            value={editingProduct ? editingProduct.title : newProduct.title}
            onChange={handleChange}
            className="border rounded-md p-2"
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Giá"
            value={editingProduct ? editingProduct.price : newProduct.price}
            onChange={handleChange}
            className="border rounded-md p-2"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border rounded-md p-2 col-span-2"
          />
          <input
            name="rating_rate"
            type="number"
            step="0.1"
            placeholder="Đánh giá 0–5"
            value={
              editingProduct
                ? editingProduct.rating_rate
                : newProduct.rating_rate
            }
            onChange={handleChange}
            className="border rounded-md p-2"
          />
          <input
            name="rating_count"
            type="number"
            placeholder="Lượt đánh giá"
            value={
              editingProduct
                ? editingProduct.rating_count
                : newProduct.rating_count
            }
            onChange={handleChange}
            className="border rounded-md p-2"
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          {editingProduct && (
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </button>
        </div>
      </form>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-sm rounded-xl p-4 border hover:shadow-lg flex flex-col items-center"
          >
            {/* Ảnh nhỏ kiểu thumbnail */}
            <img
              src={p.image || "https://via.placeholder.com/50"}
              alt={p.title}
              className="w-12 h-12 object-cover rounded-md mb-2"
            />
            <h4 className="font-semibold truncate text-center w-full text-sm">
              {p.title}
            </h4>
            <p className="text-red-500 font-bold text-sm">${p.price}</p>
            <p className="text-xs text-gray-600">
              ⭐ {p.rating_rate} ({p.rating_count})
            </p>

            <div className="flex justify-between mt-2 w-full gap-1">
              <button
                onClick={() => setEditingProduct(p)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs flex-1"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md text-xs flex-1"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProducts_SP_Admin;
