import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import ReviewSystem from "../ReviewSystem";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data)
        });
    }, [id]);

    if (!place) return '';

    
    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
            <h1 className="text-3xl">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place} />

            <div className="mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    <b>Check-in:</b> {place.checkIn} <br />
                    <b>Check-out:</b> {place.checkOut} <br />
                    <b>Max number of Guests:</b> {place.maxGuests}

                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="max-w-full mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
                <div>
                <h2 className="font-semibold text-2xl">Extra Information</h2>
            </div>
            <div className="mb-4 mt-1 text-sm text-gray-700 leading-5">
                {place.extraInfo}
            </div>
            </div>

            <div>
                <ReviewSystem placeId={place._id} />
            </div>
        </div>
    );
}