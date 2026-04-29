import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("verifyEmail");

useEffect(() => {
  if (!email) {
    alert("Session expired, please register again");
    navigate("/register");
  }
}, []);
   
  //////////////////////////////////////////////////////////////////
  // 🔥 HANDLE CHANGE (auto next focus)
  //////////////////////////////////////////////////////////////////
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  //////////////////////////////////////////////////////////////////
  // 🔥 HANDLE BACKSPACE
  //////////////////////////////////////////////////////////////////
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  //////////////////////////////////////////////////////////////////
  // 🔥 HANDLE PASTE
  //////////////////////////////////////////////////////////////////
const handlePaste = (e) => {
  const pasteData = e.clipboardData.getData("text").slice(0, 6);

  if (!/^\d+$/.test(pasteData)) return;

  const newOtp = pasteData.split("");
  setOtp(newOtp);
};

  //////////////////////////////////////////////////////////////////
  // 🔥 VERIFY OTP
  //////////////////////////////////////////////////////////////////
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return alert("Enter complete OTP");
    }

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      alert("OTP verified ✅");
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid OTP ❌");
    }
  };

  //////////////////////////////////////////////////////////////////
  // 🔥 RESEND OTP
  //////////////////////////////////////////////////////////////////
  const handleResend = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      setTimer(30);
      alert("OTP resent 📩");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  //////////////////////////////////////////////////////////////////
  // 🔥 TIMER
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  //////////////////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////////////////
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded shadow w-96 text-center">
        
        <h1 className="text-2xl font-bold mb-4">
          🔐 Verify OTP
        </h1>

        <p className="text-gray-500 mb-6">
          Enter OTP sent to <br />
          <span className="font-semibold">{email}</span>
        </p>

        {/* 🔥 OTP BOXES */}
        <div
          className="flex justify-between mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 border rounded text-center text-xl focus:outline-blue-500"
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mb-4"
        >
          Verify OTP
        </button>

        {/* RESEND */}
        <p className="text-sm">
          {timer > 0 ? (
            <span className="text-gray-400">
              Resend in {timer}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-500 font-semibold"
            >
              Resend OTP
            </button>
          )}
        </p>

      </div>
    </div>
  );
}