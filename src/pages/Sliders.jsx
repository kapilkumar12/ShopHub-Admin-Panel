import { useEffect,useState,useCallback } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Sliders() {
    const [sliders,setSliders] = useState([]);
    const [loading,setLoading] = useState(true);

    const navigate = useNavigate();

    ////////////////////////////////////////////////////////////////
    // 🔥 FETCH
    ////////////////////////////////////////////////////////////////

    const fetchSliders = async () => {
        try {
            setLoading(true);
            const res = await API.get("/hero-slider");
            setSliders(res.data.sliders);
        } catch (error) {
            toast.error("Failed to load sliders");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSliders();
    },[]);



    ////////////////////////////////////////////////////////////////
    // ❌ DELETE
    ////////////////////////////////////////////////////////////////
    const deleteSliders = async (id) => {
        const result = await Swal.fire({
            title: "Delete slider?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            await API.delete(`/hero-slider/delete/${id}`);

            setSliders((prev) => prev.filter((u) => u._id !== id));

            toast.success("Deleted");

        } catch (error) {
            toast.error("Delete failed");
        }
    };



    ////////////////////////////////////////////////////////////////
    // UI
    ////////////////////////////////////////////////////////////////
    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">🎚️ Sliders</h1>
                <Link
                    to="/sliders/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Add Slider
                </Link>
            </div>



            {/* TABLE */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">ID</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <SkeletonRows />
                        ) : sliders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-5 text-gray-500">
                                    No Sliders found 😔
                                </td>
                            </tr>
                        ) : (
                            sliders.map((slider,index) => (
                                <tr key={slider._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>

                                    <td className="p-3 text-blue-500">
                                        {slider._id.slice(-6)}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {slider.title}
                                    </td>

                                    <td className="p-3">{slider.description}</td>

                                    <td className="p-3"> <img
                                        src={slider.image?.[0]?.url}
                                        alt={slider.title}
                                        className="w-24 h-14 object-cover rounded"
                                    /></td>

                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => deleteSliders(slider._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            onClick={() =>
                                                navigate(`/sliders/edit/${slider._id}`)
                                            }
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                        Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    );
}

//////////////////////////////////////////////////////////////////
// 🔥 SKELETON
//////////////////////////////////////////////////////////////////

function SkeletonRows() {
    return Array(5)
        .fill(0)
        .map((_,i) => (
            <tr key={i} className="border-t animate-pulse">
                <td className="p-3"><div className="h-4 bg-gray-300 rounded w-6"></div></td>
                <td className="p-3"><div className="h-4 bg-gray-300 rounded w-16"></div></td>
                <td className="p-3"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                <td className="p-3"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
                <td className="p-3"><div className="h-4 bg-gray-300 rounded w-24"></div></td>
            </tr>
        ));
}