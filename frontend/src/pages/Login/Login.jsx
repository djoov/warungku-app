import React, { useContext, useState } from 'react'
import './Login.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { auth, googleProvider, signInWithPopup } from '../../firebase'

const Login = () => {
    const { url, setToken, setUserRole, fetchUserProfile } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login")
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);
    
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const processLoginResponse = async (response) => {
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            const role = response.data.role || "user";
            setUserRole(role);
            localStorage.setItem("userRole", role);
            await fetchUserProfile(response.data.token);
            toast.success("Welcome to WarungKu!");
            if (role === "admin") {
                navigate('/admin/dashboard');
            } else {
                navigate('/'); 
            }
        } else {
            toast.error(response.data.message)
        }
    }

    const switchToRegister = (email, name) => {
        setCurrState("Sign Up");
        setData(prev => ({ 
            ...prev, 
            email: email || prev.email, 
            name: name || "" 
        }));
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");
        
        try {
            const response = await axios.post(newUrl, data);
            await processLoginResponse(response);
        } catch (error) {
            if (error.response && error.response.data) {
                const errData = error.response.data;
                // Check if the error is about unregistered account
                if (error.response.status === 404 && currState === "Login") {
                    toast.warn("⚠️ " + (errData.message || "Akun belum terdaftar. Silakan daftar terlebih dahulu."), {
                        autoClose: 4000,
                    });
                    switchToRegister(data.email, "");
                } else {
                    toast.error(errData.message || "Terjadi kesalahan.");
                }
            } else {
                toast.error("Login failed or Server Error");
            }
        }
    }

    // Google Login Handler
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const mode = currState === "Login" ? "login" : "register";
            const response = await axios.post(url + "/api/user/sso-login", { idToken, mode });
            await processLoginResponse(response);
        } catch (error) {
            if (error.response && error.response.data) {
                const errData = error.response.data;
                if (error.response.status === 404) {
                    toast.warn("⚠️ " + (errData.message || "Akun Google belum terdaftar."), {
                        autoClose: 4000,
                    });
                    switchToRegister(errData.email || "", errData.name || "");
                } else {
                    toast.error(errData.message || "Google Sign-In gagal.");
                }
            } else if (error.code && error.code.startsWith("auth/")) {
                // Firebase auth errors (popup closed, etc.)
                if (error.code !== "auth/popup-closed-by-user") {
                    toast.error("Google Sign-In dibatalkan atau gagal.");
                }
            } else {
                console.error(error);
                toast.error("Google Sign-In failed.");
            }
        }
    }

    return (
        <div className='login-page'>
            <div className="login-page-container">
                <div className="login-page-title">
                    <h2>{currState === "Login" ? "Masuk" : "Buat Akun"}</h2>
                    <p className="login-subtitle">
                        {currState === "Login" 
                            ? "Selamat datang kembali! Masuk ke akun Anda." 
                            : "Daftar gratis dan mulai pesan makanan favorit."
                        }
                    </p>
                </div>
                
                <form onSubmit={onLogin} className="login-page-inputs">
                    {currState === "Sign Up" && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Nama lengkap" required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Email" required />
                    <div className="password-input-container">
                        <input 
                            name='password' 
                            onChange={onChangeHandler} 
                            value={data.password} 
                            className='password' 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            required 
                            minLength={currState === "Sign Up" ? 8 : 1}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    {currState === "Sign Up" && (
                        <p style={{fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px'}}>
                            * Password minimal 8 karakter
                        </p>
                    )}
                    <button type='submit' className="login-btn">{currState === "Sign Up" ? "Buat Akun" : "Masuk"}</button>
                </form>

                <div className="sso-divider">
                    <span>ATAU</span>
                </div>
                <div className="sso-buttons">
                    <button onClick={handleGoogleLogin} type="button" className="sso-btn google-btn">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                        {currState === "Login" ? "Masuk dengan Google" : "Daftar dengan Google"}
                    </button>
                </div>

                <div className="login-page-condition">
                    <input type="checkbox" required />
                    <p>Saya menyetujui <Link to="/privacy-policy" className="toggle-link">Kebijakan Privasi</Link> WarungKu.</p>
                </div>
                {currState === "Login"
                    ? <p>Belum punya akun? <span className="toggle-link" onClick={() => setCurrState("Sign Up")}>Daftar di sini</span></p>
                    : <p>Sudah punya akun? <span className="toggle-link" onClick={() => setCurrState("Login")}>Masuk di sini</span></p>
                }
            </div>
        </div>
    )
}

export default Login