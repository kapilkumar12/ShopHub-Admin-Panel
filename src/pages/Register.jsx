import { useState } from 'react'
import API from "../services/api";
import { useNavigate,Link } from 'react-router-dom';


const Register = () => {

    const [form,setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form,[e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const res = await API.post('/auth/sign-up',form);
            alert("Registered successfully ✅");
            localStorage.setItem("verifyEmail", form.email);
            navigate('/verify-otp');
        } catch (error) {
            alert('Register failed')
        }
    }

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div className="bg-white p-8 rounded shadow w-96">
                <h1 className="text-2xl font-bold mb-6">📝 Create Account</h1>
                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Name"
                    name="name"
                    onChange={handleChange}
                />
                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                />
                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                />
                <select
                    name="role"
                    className="w-full p-2 border mb-4 rounded"
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Signup
                </button>
                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register