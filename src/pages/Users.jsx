import { useEffect,useState,useCallback } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Users() {
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(true);

    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);


    const navigate = useNavigate();

    ////////////////////////////////////////////////////////////////
    // 🔥 FETCH
    ////////////////////////////////////////////////////////////////

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/users?page=${page}&limit=10`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    },[page]);


    // update role

    const updateUserRole = async (id) => {
        const result = await Swal.fire({
            title: "Update User Role?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Update",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await API.put(`/users/toggle-role/${id}`);
            const updatedUser = res.data.user;

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id
                        ? { ...user,role: updatedUser.role }
                        : user
                )
            );

            toast.success("Role updated");
        } catch (error) {
            toast.error("Update failed");
        }
    };


    ////////////////////////////////////////////////////////////////
    // ❌ DELETE
    ////////////////////////////////////////////////////////////////
    const deleteUsers = async (id) => {
        const result = await Swal.fire({
            title: "Delete user?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            await API.delete(`/users/${id}`);

            setUsers((prev) => prev.filter((u) => u._id !== id));

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
                <h1 className="text-2xl font-bold">👤 Users</h1>
            </div>



            {/* TABLE */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <SkeletonRows />
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-5 text-gray-500">
                                    No Users found 😔
                                </td>
                            </tr>
                        ) : (
                            users.map((user,index) => (
                                <tr key={user._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>

                                    <td className="p-3 text-blue-500">
                                        {user._id.slice(-6)}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {user.name}
                                    </td>

                                    <td className="p-3">{user.email}</td>

                                    <td className="p-3">{user.role}</td>

                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => deleteUsers(user._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateUserRole(user._id)
                                            }
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                         {user.role === "admin" ? "Make User" : "Make Admin"}
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
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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