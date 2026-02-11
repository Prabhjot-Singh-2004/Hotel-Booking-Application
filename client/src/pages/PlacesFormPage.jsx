import PhotosUploader from "../PhotosUploader";
import Perks from "../perks";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import { useToast } from "../Toast.jsx";

export default function PlacesFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(Array.isArray(data.photos) ? data.photos : []);
            setDescription(data.description);
            setPerks(Array.isArray(data.perks) ? data.perks : []);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
            setLoading(false);
        }).catch(() => {
            toast.error('Failed to load place data');
            setLoading(false);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <div>
                {inputHeader(header)}
                {inputDescription(description)}
            </div>
        );
    }

    async function savePlace(ev) {
        ev.preventDefault();

        if (!title || !address) {
            toast.error('Title and address are required');
            return;
        }

        const placeData = {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price,
        };

        try {
            if (id) {
                await axios.put('/places', { id, ...placeData });
                toast.success('Place updated successfully');
            } else {
                await axios.post('/places', placeData);
                toast.success('Place created successfully');
            }
            setRedirect(true);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to save place';
            toast.error(msg);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
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
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place. Should be short and catchy as in advertisement.')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My Lovely apt." />
                {preInput('Address', 'Address to this place.')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
                {preInput('Photos', 'more = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput('Description', 'Description of the place')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput('Perks', 'Select all the perks of your place')}
                <div className="grid mt-2 gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preInput('Extra Info', 'House rules, etc')}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                {preInput('Check in&out times, max guests', 'add check in and out times, remember to have some time window for cleaning the room between guests.')}
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type="text" value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}
                            placeholder="14" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input type="text" value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            placeholder="11" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type="number" value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)} />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price}
                            onChange={ev => setPrice(ev.target.value)} />
                    </div>
                </div>
                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    );
}
