import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bearerToken, setBearerToken] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setShowerr(json.error || 'Invalid credentials');
            }
        } catch (e) {
            setShowerr('Error during login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h2 className="text-center mb-4">Login</h2>
                        {showerr && <div className="alert alert-danger">{showerr}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <p className="mt-3 text-center">New user? <Link to="/app/register">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
