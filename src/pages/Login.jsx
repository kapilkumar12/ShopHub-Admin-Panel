import { useState } from 'react'
import API from "../services/api";
import { useNavigate, Link  } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


const Login = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const handleLogin = async () => {
        try {
            const res = await API.post('/auth/login',{ email,password });
            await fetchUser();
            navigate('/');
        } catch (error) {
            alert('Login failed')
        }
    }

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div className="bg-white p-8 rounded shadow w-96">
                <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>

                <p className="text-center mt-4 text-sm">
                    You don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 font-semibold">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login