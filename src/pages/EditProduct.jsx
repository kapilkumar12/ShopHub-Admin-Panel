import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    category: "",
    stock: "",
    gstPercent: "",
    discountPercent: "",
    shippingCost: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [progress, setProgress] = useState(0);
  const [deletedImages, setDeletedImages] = useState([]);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH PRODUCT
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/get-single-product/${id}`);
      const product = res.data.product;

      setForm({
        name: product.name || "",
        description: product.description || "",
        basePrice: product.basePrice || "",
        category: product.category || "",
        stock: product.stock || "",
        gstPercent: product.gstPercent || "",
        discountPercent: product.discountPercent || "",
        shippingCost: product.shippingCost || "",
      });

      setPreview(product.images || []);
    } catch (error) {
      alert("Failed to load product ❌");
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 INPUT CHANGE
  ////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 IMAGE CHANGE
  ////////////////////////////////////////////////////////////////
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview((prev) => [...prev, ...previewUrls]);
    setImages((prev) => [...prev, ...files]);
  };

  ////////////////////////////////////////////////////////////////
  // ❌ REMOVE IMAGE
  ////////////////////////////////////////////////////////////////
  const removeImage = (index) => {
    const removedImage = preview[index];
    let newPreview = [...preview];

    if (removedImage?.fileId) {
      setDeletedImages((prev) => [...prev, removedImage]);
    } else {
      let newImages = [...images];

      const blobIndex = preview
        .slice(0, index)
        .filter((img) => typeof img === "string").length;

      newImages.splice(index - blobIndex, 1);
      setImages(newImages);
    }

    newPreview.splice(index, 1);
    setPreview(newPreview);
  };

  ////////////////////////////////////////////////////////////////
  // 🚀 UPDATE PRODUCT
  ////////////////////////////////////////////////////////////////
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (form.basePrice < 0 || form.stock < 0) {
      return alert("Price & Stock must be positive");
    }

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("deletedImages", JSON.stringify(deletedImages));

      images.forEach((img) => {
        formData.append("images", img);
      });

      await API.put(`/products/update-product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );
          setProgress(percent);
        },
      });

      alert("Product updated successfully ✅");
      navigate("/products");

    } catch (error) {
      alert("Update failed ❌");
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen relative">

      <Link
        to="/products"
        className="bg-blue-500 text-white px-4 py-2 rounded absolute top-4 right-4"
      >
        Back
      </Link>

      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          ✏️ Edit Product
        </h1>

        <form onSubmit={handleUpdateProduct}>
          <input
            className="w-full p-2 border mb-3 rounded"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
          />

          <textarea
            className="w-full p-2 border mb-3 rounded"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <div className="flex gap-2 flex-wrap">

            <input
              type="number"
              min="0"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="MRP (Base Price)"
            />

            <input
              type="number"
              min="0"
              name="discountPercent"
              value={form.discountPercent}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Discount %"
            />

            <input
              type="number"
              min="0"
              name="gstPercent"
              value={form.gstPercent}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="GST %"
            />

            <input
              type="number"
              min="0"
              name="shippingCost"
              value={form.shippingCost}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Shipping Cost"
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Category"
            />

            <input
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Stock"
            />
          </div>

          {/* FILE INPUT */}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="my-4"
          />

          {/* PREVIEW */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url || img}
                  alt="preview"
                  className="w-full h-24 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* PROGRESS */}
          {progress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm">{progress}% uploaded</p>
            </div>
          )}

          <button className="w-full bg-green-500 text-white p-2 rounded">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;