import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from './Toast.jsx';

export default function ReviewSystem({ placeId }) {
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const toast = useToast();

    useEffect(() => {
        axios.get(`/api/reviews/${placeId}`).then(response => {
            const data = response.data;
            setReviews(Array.isArray(data.reviews) ? data.reviews : Array.isArray(data) ? data : []);
        }).catch(() => {
            setReviews([]);
        });
    }, [placeId]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        if (!text.trim()) {
            toast.error('Please write a review');
            return;
        }
        try {
            const res = await axios.post('/api/reviews', { placeId, text, rating });
            setReviews([res.data, ...reviews]);
            setText('');
            setRating(0);
            toast.success('Review submitted');
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const deleteReview = async (id) => {
        try {
            await axios.delete(`/api/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
            toast.success('Review deleted');
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    return (
        <div className="max-w-full mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
            <form onSubmit={submitReview} className="mb-6">
                <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star
                            key={star}
                            filled={star <= (hover || rating)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <textarea
                    className="w-full border rounded-md p-2 mb-2"
                    rows="3"
                    placeholder="Write your review..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary"
                >
                    Submit Review
                </button>
            </form>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Reviews:</h2>
                {reviews.length === 0 && <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
                {reviews.map((review) => (
                    <div key={review._id} className="mb-4 p-4 bg-white rounded shadow relative">
                        <div className="flex items-center gap-2 mb-1">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} filled={true} />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                                <Star key={i} filled={false} />
                            ))}
                        </div>
                        <p>{review.text}</p>
                        <p className="text-gray-500 text-xs">{review.date}</p>
                        <button
                            onClick={() => deleteReview(review._id)}
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-2xl p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Star({ filled, onClick, onMouseEnter, onMouseLeave }) {
    return (
        <svg
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            xmlns="http://www.w3.org/2000/svg"
            fill={filled ? 'gold' : 'none'}
            viewBox="0 0 24 24"
            stroke="gold"
            className="w-6 h-6 cursor-pointer"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 0 0 .95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.976 2.89a1 1 0 0 0-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.89a1 1 0 0 0-1.176 0l-3.976 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 0 0-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 0 0 .951-.69l1.52-4.674z"
            />
        </svg>
    );
}
