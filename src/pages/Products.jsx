import { useEffect,useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Products() {
    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 500); // debounce

    return () => clearTimeout(delay);
  }, [search, page]);
    

    const fetchProducts = async () => {
        try {
            setLoading(true);
           const res = await API.get("/products/filter", {
      params: {
        search,
        page,
        limit: 10,
      },
    });
            setProducts(res.data.products);
            setLoading(false);
        } catch (error) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async(id)=>{
        const result = await Swal.fire({
    title: "Are you sure?",
    text: "This product will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });
  if (!result.isConfirmed) return;
        try {
             const res = await API.delete(`/products/delete-product/${id}`);
             toast.success("Product deleted successfully");
             fetchProducts();
        } catch (error) {
            console.log("DELETE ERROR:", error.response?.data || error.message);
             toast.error("Failed to delete product");
        }
    }

    return (
        <div className="relative">
            <h1 className="text-2xl font-bold mb-6">📦 Products</h1>
             <Link to="/products/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition absolute top-0 right-0">Add Products</Link>
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Sr. No</th>
                            <th className="p-3">Product ID</th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <SkeletonRows />
                        ) : (products.map((product,index) => (
                            <tr key={product._id} className="border-t">
                                <td className="p-3">{index + 1}</td>
                                <td
                                    className="p-3 text-blue-500 cursor-pointer hover:underline"
                                >{product._id}</td>
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">₹{product.price}</td>
                                <td className="p-3">{product.category}</td>


                                {/* ACTIONS */}
                                <td className="p-3 space-x-2">
                                    <button onClick={() => deleteProduct(product._id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>


                                    <button onClick={() => navigate(`/products/edit/${product._id}`)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


//////////////////////////////////////////////////////////////////
// 🔥 SKELETON LOADER
//////////////////////////////////////////////////////////////////

function SkeletonRows() {
    return Array(5)
        .fill(0)
        .map((_,i) => (
            <tr key={i} className="border-t animate-pulse">
                <td className="p-3">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                </td>
                <td className="p-3">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
                <td className="p-3">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                </td>
                <td className="p-3">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                </td>
                <td className="p-3">
                    <div className="h-4 bg-gray-300 rounded w-40"></div>
                </td>
            </tr>
        ));
}