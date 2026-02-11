import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useToast } from "./Toast.jsx";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const toast = useToast();

    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;

    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        if (!user) {
            toast.error('Please log in to book a place');
            return;
        }
        if (!checkIn || !checkOut) {
            toast.error('Please select check-in and check-out dates');
            return;
        }
        if (numberOfNights <= 0) {
            toast.error('Check-out must be after check-in');
            return;
        }
        if (!name || !phone) {
            toast.error('Please fill in your name and phone number');
            return;
        }

        try {
            const response = await axios.post('/bookings', {
                checkIn, checkOut, numberOfGuests, name, phone,
                place: place._id,
                price: numberOfNights * place.price,
            });
            const bookingId = response.data._id;
            toast.success('Booking confirmed!');
            setRedirect(`/account/bookings/${bookingId}`);
        } catch (error) {
            const msg = error.response?.data?.message || 'Booking failed. Please try again.';
            toast.error(msg);
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow-md p-4 rounded-2xl">
            <div className="text-xl sm:text-2xl mb-2 text-center">
                Price: Rs {place.price}/per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex flex-col sm:flex-row">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        <input type="date"
                            value={checkIn}
                            onChange={(ev) => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-t sm:border-t-0 sm:border-l">
                        <label>Check out:</label>
                        <input type="date"
                            value={checkOut}
                            onChange={(ev) => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of Guests:</label>
                    <input type="number"
                        value={numberOfGuests}
                        onChange={(ev) => setNumberOfGuests(ev.target.value)} />
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your Full Name:</label>
                        <input type="text"
                            value={name}
                            onChange={(ev) => setName(ev.target.value)} />
                        <label>Phone Number:</label>
                        <input type="tel"
                            value={phone}
                            onChange={(ev) => setPhone(ev.target.value)} />
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="primary">
                Book this place
                {numberOfNights > 0 && (
                    <span> Rs{numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    );
}
