import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const AddSliders = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState([]);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 INPUT CHANGE
  ////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 FILE SELECT
  ////////////////////////////////////////////////////////////////
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImage(files);

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

    setImage(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previewUrls);
  };

  ////////////////////////////////////////////////////////////////
  // ❌ REMOVE IMAGE
  ////////////////////////////////////////////////////////////////
  const removeImage = (index) => {
    const newImages = [...image];
    const newPreview = [...preview];

    newImages.splice(index, 1);
    newPreview.splice(index, 1);

    setImage(newImages);
    setPreview(newPreview);
  };

  ////////////////////////////////////////////////////////////////
  // 🚀 SUBMIT WITH PROGRESS
  ////////////////////////////////////////////////////////////////
  const handleAddSlider = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      image.forEach((img) => {
        formData.append("image", img);
      });

      const res = await API.post("/hero-slider/create", formData, {
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

      alert("Slider added successfully ✅");

      navigate("/sliders");

    } catch (error) {
      alert("Upload failed ❌");
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen relative">
        <Link to="/products" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition absolute top-0 right-0">List Products</Link>
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📝 Add Hero Sliders</h1>

        <form onSubmit={handleAddSlider}>
          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Title Name"
            name="title"
            onChange={handleChange}
          />

          <textarea
            className="w-full p-2 border mb-3 rounded"
            placeholder="Description"
            name="description"
            onChange={handleChange}
          />


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

          {/* 🔥 PREVIEW + REMOVE */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {preview.map((img, i) => (
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

          {/* 🚀 PROGRESS BAR */}
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSliders;