import { useEffect,useState,useCallback } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Reviews() {
  const [reviews,setReviews] = useState([]);
  const [loading,setLoading] = useState(true);

  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH
  ////////////////////////////////////////////////////////////////

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await API.get("/reviews/");

      const data = res.data;
      setReviews(data.reviews);  
    //   if (Array.isArray(data)) {
    //     setProducts(data);
    //   } else if (Array.isArray(data.products)) {
    //     setProducts(data.products);
    //   } else {
    //     console.warn("Unexpected API format:",data);
    //     setProducts([]);
    //   }
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch products ❌");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  },[]);

  ////////////////////////////////////////////////////////////////
  // ❌ DELETE
  ////////////////////////////////////////////////////////////////
  const deleteReviews = async (id) => {
    const result = await Swal.fire({
      title: "Delete review?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/reviews/${id}`);
      toast.success("Deleted");
      fetchReviews();
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
        <h1 className="text-2xl font-bold">💬 Reviews</h1>
      </div>


      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5 text-gray-500">
                  No Reviews found 😔
                </td>
              </tr>
            ) : (
              reviews.map((review,index) => (
                <tr key={review._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 text-blue-500">
                    {review._id.slice(-6)}
                  </td>

                  <td className="p-3">
                    {review.user?.name || "Unknown User"}
                  </td>

                  <td className="p-3">{review.product?.name || "Deleted Product"}</td>

                  <td className="p-3">{review.rating}</td>
                  <td className="p-3">{review.comment}</td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => deleteReviews(review._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1 bg-gray-100 rounded">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
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