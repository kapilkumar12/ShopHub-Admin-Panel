import { useEffect,useState } from "react";
import API from "../services/api";
import { useNavigate,useParams,Link } from "react-router-dom";

const EditSlider = () => {
    const { id } = useParams();

    const [form,setForm] = useState({
        title: "",
        description: "",
    });

    const [image,setImage] = useState([]);
    const [preview,setPreview] = useState([]);
    const [progress,setProgress] = useState(0);
    const [deleteImage,setDeleteImage] = useState(false);

    const navigate = useNavigate();

    ////////////////////////////////////////////////////////////////
    // 🔥 FETCH SLIDER DATA
    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        fetchSlider();
    },[]);

    const fetchSlider = async () => {
        try {
            const res = await API.get(`/hero-slider/single/${id}`);

            const slider = res.data.slider;
            setForm({
                title: slider.title,
                description: slider.description,
            });

            // existing images preview (from backend URLs)
            if (Array.isArray(slider.image)) {
                setPreview(slider.image);
            } else if (slider.image) {
                setPreview([slider.image]);
            } else {
                setPreview([]);
            }


        } catch (error) {
            alert("Failed to load slider ❌");
        }
    };

    ////////////////////////////////////////////////////////////////
    // 🔥 INPUT CHANGE
    ////////////////////////////////////////////////////////////////
    const handleChange = (e) => {
        setForm({ ...form,[e.target.name]: e.target.value });
    };

    ////////////////////////////////////////////////////////////////
    // 🔥 IMAGE CHANGE
    ////////////////////////////////////////////////////////////////
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setPreview([URL.createObjectURL(file)]);
        setImage([file]);
        setDeleteImage(false);
    };

    ////////////////////////////////////////////////////////////////
    // ❌ REMOVE IMAGE
    ////////////////////////////////////////////////////////////////
    const removeImage = (index) => {
        setPreview([]);
        setImage([]);
        setDeleteImage(true);
    };

    ////////////////////////////////////////////////////////////////
    // 🚀 UPDATE SLIDER
    ////////////////////////////////////////////////////////////////
    const handleUpdateSlider = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                formData.append(key,form[key]);
            });

            if (deleteImage) {
                formData.append("deleteImage","true");
            }

            // new images
            if (image.length > 0) {
                formData.append("image",image[0]);
            }

            const res = await API.put(
                `/hero-slider/update/${id}`,
                formData,
                {

                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                            progressEvent.total
                        );
                        setProgress(percent);
                    },
                }
            );

            alert("Slider updated successfully ✅");

            navigate("/sliders");

        } catch (error) {
            alert("Update failed ❌");
        }
    };

    return (
        <div className="bg-gray-100 p-8 min-h-screen relative">

            <Link
                to="/sliders"
                className="bg-blue-500 text-white px-4 py-2 rounded absolute top-4 right-4"
            >
                Back
            </Link>

            <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    ✏️ Edit Slider
                </h1>

                <form onSubmit={handleUpdateSlider}>
                    <input
                        className="w-full p-2 border mb-3 rounded"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title Name"
                    />

                    <textarea
                        className="w-full p-2 border mb-3 rounded"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />

                    {/* FILE INPUT */}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="my-4"
                    />

                    {/* PREVIEW */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {preview.map((img,i) => (
                            <div key={i} className="relative">
                                <img
                                    src={img?.url ? img.url : img}
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
                        Update Slider
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditSlider;