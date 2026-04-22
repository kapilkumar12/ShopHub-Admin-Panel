import { useEffect,useState,useCallback } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Products() {
  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("");
  const [sort,setSort] = useState("");
  const [priceRange,setPriceRange] = useState(10000);

  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);

  const [categories,setCategories] = useState([]);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH
  ////////////////////////////////////////////////////////////////

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/products/filter",{
        params: {
          search,
          category,
          sort,
          maxPrice: Number(priceRange),
          page,
          limit: 5,
        },
      });

      const data = res.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.warn("Unexpected API format:",data);
        setProducts([]);
      }
      setTotalPages(data.totalPages || 1);
      setCategories(data.categories || []);
    } catch (error) {
      toast.error("Failed to fetch products ❌");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  },[search,category,sort,priceRange,page]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts,400);
    return () => clearTimeout(timer);
  },[fetchProducts]);

  ////////////////////////////////////////////////////////////////
  // ❌ DELETE
  ////////////////////////////////////////////////////////////////
  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/products/delete-product/${id}`);
      toast.success("Deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔍 HIGHLIGHT SEARCH
  ////////////////////////////////////////////////////////////////
  const highlight = (text) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`,"gi"));
    return parts.map((part,i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">📦 Products</h1>

        <Link
          to="/products/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Product
        </Link>
      </div>

      {/* 🔥 FILTER BAR */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded w-64"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat,index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
          <option value="latest">Latest</option>
        </select>

        {/* PRICE RANGE */}
        <div className="flex items-center gap-2">
          <span>₹0</span>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange}
            onChange={(e) => {
              setPriceRange(Number(e.target.value));
              setPage(1);
            }}
          />
          <span>₹{priceRange}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5 text-gray-500">
                  No products found 😔
                </td>
              </tr>
            ) : (
              products.map((product,index) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 text-blue-500">
                    {product._id.slice(-6)}
                  </td>

                  <td className="p-3 font-medium">
                    {highlight(product.name)}
                  </td>

                  <td className="p-3">₹{product.price}</td>

                  <td className="p-3">{product.category}</td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/products/edit/${product._id}`)
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