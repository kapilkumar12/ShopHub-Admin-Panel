import { useState } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";

const AddProducts = () => {
  const [form,setForm] = useState({
    name: "",
    description: "",
    basePrice: "",          // ✅ MRP
    category: "",
    stock: "",
    gstPercent: "",         // ✅ GST
    discountPercent: "",    // ✅ Discount
    shippingCost: "",       // ✅ Shipping
  });

  const [images,setImages] = useState([]);
  const [preview,setPreview] = useState([]);
  const [progress,setProgress] = useState(0);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 INPUT CHANGE
  ////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setForm({ ...form,[e.target.name]: e.target.value });
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 FILE SELECT
  ////////////////////////////////////////////////////////////////
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previewUrls);
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 DRAG & DROP
  ////////////////////////////////////////////////////////////////
  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previewUrls);
  };

  ////////////////////////////////////////////////////////////////
  // ❌ REMOVE IMAGE
  ////////////////////////////////////////////////////////////////
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreview = [...preview];

    newImages.splice(index,1);
    newPreview.splice(index,1);

    setImages(newImages);
    setPreview(newPreview);
  };

  ////////////////////////////////////////////////////////////////
  // 🚀 SUBMIT WITH PROGRESS
  ////////////////////////////////////////////////////////////////
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (form.basePrice < 0 || form.stock < 0) {
      return alert("Price & Stock must be positive");
    }

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key,form[key]);
      });

      images.forEach((img) => {
        formData.append("images",img);
      });

      await API.post("/products/add-product",formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      alert("Product added successfully ✅");
      navigate("/products");

    } catch (error) {
      alert("Upload failed ❌");
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen relative">
      <Link to="/products" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition absolute top-0 right-0">
        List Products
      </Link>

      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📝 Add Product</h1>

        <form onSubmit={handleAddProduct}>
          
          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Product Name"
            name="name"
            onChange={handleChange}
          />

          <textarea
            className="w-full p-2 border mb-3 rounded"
            placeholder="Description"
            name="description"
            onChange={handleChange}
          />

          <div className="flex gap-2 flex-wrap">

            {/* ✅ MRP */}
            <input
              type="number"
              min="0"
              className="w-full p-2 border mb-3 rounded"
              placeholder="MRP (Base Price)"
              name="basePrice"
              onChange={handleChange}
            />

            {/* ✅ Discount */}
            <input
              type="number"
              min="0"
              className="w-full p-2 border mb-3 rounded"
              placeholder="Discount %"
              name="discountPercent"
              onChange={handleChange}
            />

            {/* ✅ GST */}
            <input
              type="number"
              min="0"
              className="w-full p-2 border mb-3 rounded"
              placeholder="GST %"
              name="gstPercent"
              onChange={handleChange}
            />

            {/* ✅ Shipping */}
            <input
              type="number"
              min="0"
              className="w-full p-2 border mb-3 rounded"
              placeholder="Shipping Cost"
              name="shippingCost"
              onChange={handleChange}
            />

            {/* CATEGORY */}
            <input
              className="w-full p-2 border mb-3 rounded"
              placeholder="Category"
              name="category"
              onChange={handleChange}
            />

            {/* STOCK */}
            <input
              type="number"
              min="0"
              className="w-full p-2 border mb-3 rounded"
              placeholder="Stock"
              name="stock"
              onChange={handleChange}
            />
          </div>

          {/* DRAG AREA */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed p-6 text-center mb-4 rounded"
          >
            Drag & Drop Images Here
          </div>

          {/* FILE INPUT */}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mb-4"
          />

          {/* PREVIEW */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {preview.map((img,i) => (
              <div key={i} className="relative">
                <img
                  src={img}
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
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{progress}% uploaded</p>
            </div>
          )}

          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Save Product
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProducts;