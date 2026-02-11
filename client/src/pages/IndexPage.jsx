import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const debounceTimer = useRef(null);

    // Debounce: wait 500ms after user stops typing before searching
    function handleSearch(value) {
        setSearchInput(value);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            setDebouncedQuery(value);
        }, 500);
    }

    // Fetch places only when debounced query changes
    useEffect(() => {
        const params = debouncedQuery.trim() ? { search: debouncedQuery.trim() } : {};
        axios.get('/places', { params }).then(response => {
            setPlaces(response.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [debouncedQuery]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    // Only show full-page spinner on initial load
    if (loading && places.length === 0 && !searchInput) {
        return <Spinner />;
    }

    return (
        <div>
            {/* Search bar */}
            <div className="mt-6 mb-2 max-w-xl mx-auto">
                <input
                    type="text"
                    placeholder="Search hotels by location..."
                    value={searchInput}
                    onChange={ev => handleSearch(ev.target.value)}
                    className="w-full border border-gray-300 rounded-full py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {places.length === 0 && !loading && (
                <div className="text-center py-16 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 mx-auto mb-4 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <p className="text-lg">No places found{searchInput ? ` for "${searchInput}"` : ''}</p>
                    {searchInput && (
                        <button onClick={() => { setSearchInput(''); setDebouncedQuery(''); }} className="mt-4 text-primary underline">
                            Clear search
                        </button>
                    )}
                </div>
            )}

            <div className="mt-4 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {places.length > 0 && places.map(place => (
                    <Link to={'/place/' + place._id} key={place._id}>
                        <div className="bg-gray-500 mb-2 rounded-2xl">
                            {place.photos?.[0] && (
                                <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/' + place.photos?.[0]} alt="" />
                            )}
                        </div>

                        <h2 className="font-bold text-sm sm:text-base leading-4">{place.address}</h2>
                        <h3 className="text-xs sm:text-sm leading-4 text-gray-500">{place.title}</h3>
                        <div className="mt-1">
                            <span className="font-bold">Rs.{place.price}</span> per night
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
