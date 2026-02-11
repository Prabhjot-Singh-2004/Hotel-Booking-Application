import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../Toast.jsx";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const toast = useToast();

    function validatePassword(pw) {
        if (pw.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(pw)) {
            return 'Password must contain at least one capital letter';
        }
        if (!/[0-9]/.test(pw)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw)) {
            return 'Password must contain at least one special character';
        }
        return '';
    }

    function handlePasswordChange(ev) {
        const value = ev.target.value;
        setPassword(value);
        if (value.length > 0) {
            setPasswordError(validatePassword(value));
        } else {
            setPasswordError('');
        }
    }

    async function registerUser(ev) {
        ev.preventDefault();
        setEmailError('');

        const pwError = validatePassword(password);
        if (pwError) {
            setPasswordError(pwError);
            return;
        }

        try {
            await axios.post('/register', { name, email, password });
            toast.success('Registration successful. You can now log in.');
        } catch (error) {
            if (error.response?.data?.error === 'email_exists') {
                setEmailError('Email already exists');
            } else {
                const msg = error.response?.data?.message || 'Registration failed. Please try again.';
                toast.error(msg);
            }
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto px-4 sm:px-0" onSubmit={registerUser}>
                    <input type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={ev => setName(ev.target.value)} />
                    <input type="email"
                        className={emailError ? 'border-red-500 border-2' : ''}
                        placeholder={'your@email.com'}
                        value={email}
                        onChange={ev => { setEmail(ev.target.value); setEmailError(''); }} />
                    {emailError && (
                        <p className="text-red-500 text-sm mt-1 mb-1">{emailError}</p>
                    )}
                    <input type="password"
                        className={passwordError ? 'border-red-500 border-2' : ''}
                        placeholder={'password'}
                        value={password}
                        onChange={handlePasswordChange} />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1 mb-1">{passwordError}</p>
                    )}
                    {!passwordError && password.length > 0 && (
                        <p className="text-green-500 text-sm mt-1 mb-1">Password is strong</p>
                    )}
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
