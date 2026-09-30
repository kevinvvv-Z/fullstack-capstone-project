import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            const json = await res.json();
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', email);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setShowerr(json.error || 'Registration failed');
            }
        } catch (e) {
            setShowerr('Error in registration');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h2 className="text-center mb-4">Register</h2>
                        {showerr && <div className="alert alert-danger">{showerr}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <label>First Name</label>
                                <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label>Last Name</label>
                                <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                        <p className="mt-3 text-center">Already a member? <Link to="/app/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
