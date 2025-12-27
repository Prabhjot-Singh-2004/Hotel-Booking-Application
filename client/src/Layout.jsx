import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./footer";

export default function Layout() {
    return (
        <div>
            <div className="py-4 px-8 flex flex-col min-h-screen">
                <Header />
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}