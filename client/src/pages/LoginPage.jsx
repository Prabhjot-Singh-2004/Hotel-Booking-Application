import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";
import { useToast } from "../Toast.jsx";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);
    const toast = useToast();

    async function handleLoginSubmit(ev) {
        ev.preventDefault();

        try {
            const { data } = await axios.post('/login', { email, password });
            setUser(data);
            toast.success('Login successful');
            setRedirect(true);
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed';
            toast.error(msg);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto px-4 sm:px-0" onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder={'your@email.com'} value={email}
                        onChange={ev => setEmail(ev.target.value)} />
                    <input type="password" placeholder={'password'} value={password}
                        onChange={ev => setPassword(ev.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
