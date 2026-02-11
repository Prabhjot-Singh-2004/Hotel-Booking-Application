import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlacesImg from "../PlacesImg";
import Spinner from "../Spinner";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div>
                <AccountNav />
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Place
                </Link>
            </div>

            {places.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 mx-auto mb-4 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                    </svg>
                    <p className="text-lg">You have no accommodations listed yet</p>
                    <p className="text-sm mt-1">Click "Add New Place" to get started</p>
                </div>
            )}

            <div className="mt-4 space-y-4">
                {places.length > 0 && places.map(place => (
                    <Link to={'/account/places/' + place._id} key={place._id} className="flex flex-col sm:flex-row cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                        <div className="flex w-full sm:w-32 h-48 sm:h-32 bg-gray-300 shrink-0">
                            <PlacesImg place={place} />
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
