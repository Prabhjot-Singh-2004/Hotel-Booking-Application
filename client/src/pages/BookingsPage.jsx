import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlacesImg from "../PlacesImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { useToast } from "../Toast.jsx";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        axios.get('/bookings').then(response => {
            setBookings(response.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    async function cancelBooking(ev, bookingId) {
        ev.preventDefault();
        ev.stopPropagation();
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await axios.delete(`/bookings/${bookingId}`);
            setBookings(prev => prev.filter(b => b._id !== bookingId));
            toast.success('Booking cancelled successfully');
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    }

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

            {bookings.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 mx-auto mb-4 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                    </svg>
                    <p className="text-lg">You have no bookings yet</p>
                    <p className="text-sm mt-1">Browse places and book your next stay</p>
                    <Link to="/" className="mt-4 inline-block text-primary underline">Browse places</Link>
                </div>
            )}

            <div className="space-y-4">
                {bookings.map(booking => (
                    <Link to={`/account/bookings/${booking._id}`} key={booking._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-500 bg-gray-200 rounded-2xl overflow-hidden">
                        <div className="w-full sm:w-60 h-48 sm:h-auto shrink-0">
                            <PlacesImg place={booking.place} />
                        </div>
                        <div className="py-3 grow pr-3">
                            <h2 className="text-xl">{booking.place.title}</h2>
                            <div className="text-l">
                                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                    <div className="flex gap-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                                        </svg>
                                        {format(new Date(booking.checkIn), 'yyyy-MM-dd')}
                                    </div>
                                    &rarr;
                                    <div className="flex gap-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                                        </svg>
                                        {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
                                    </div>
                                </div>
                                <div className="text-xl">
                                    <div className="flex gap-1 items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                        </svg>
                                        {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} Nights
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                        </svg>
                                        Total Price: Rs{booking.price}
                                    </div>
                                </div>
                                <button
                                    onClick={(ev) => cancelBooking(ev, booking._id)}
                                    className="mt-3 bg-red-500 text-white py-1 px-4 rounded-full text-sm hover:bg-red-600"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
