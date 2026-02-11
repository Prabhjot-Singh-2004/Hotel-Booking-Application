import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import { differenceInCalendarDays, format } from "date-fns";
import Spinner from "../Spinner";
import { useToast } from "../Toast.jsx";

export default function BookingPlace() {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({ _id }) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        }
    }, [id]);

    async function cancelBooking() {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await axios.delete(`/bookings/${id}`);
            toast.success('Booking cancelled successfully');
            navigate('/account/bookings');
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    }

    if (loading) {
        return <Spinner />;
    }

    if (!booking) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p className="text-lg">Booking not found</p>
            </div>
        );
    }

    return (
        <div className="my-8">
            <h1 className="text-2xl md:text-3xl">{booking.place.title}</h1>
            <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
            <div className="bg-gray-200 p-4 mb-4 mt-6 rounded-2xl items-center flex flex-col sm:flex-row gap-4 sm:justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold">Your booking information:</h2>
                    <div className="flex flex-wrap gap-2 mt-2 items-center">
                        <div className="flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                            {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} Nights
                        </div>
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
                    <button
                        onClick={cancelBooking}
                        className="mt-3 bg-red-500 text-white py-1 px-4 rounded-full text-sm hover:bg-red-600"
                    >
                        Cancel Booking
                    </button>
                </div>
                <div className="bg-primary text-white rounded-2xl p-3 text-center sm:text-left">
                    <div className="text-lg sm:text-xl">Total Price</div>
                    <div className="text-2xl sm:text-3xl">Rs{booking.price}</div>
                </div>
            </div>
            <PlaceGallery place={booking.place} />
        </div>
    );
}
