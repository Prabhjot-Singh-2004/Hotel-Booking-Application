import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="mt-4 grow flex items-center justify-center">
            <div className="text-center mb-32">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl text-gray-700 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
                <Link to="/" className="bg-primary text-white py-2 px-6 rounded-full inline-block">
                    Go back home
                </Link>
            </div>
        </div>
    );
}
