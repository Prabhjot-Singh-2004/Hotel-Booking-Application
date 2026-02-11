const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user.js');
const cookieParser = require('cookie-parser');
const Place = require('./models/place.js');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const app = express();
const fs = require('fs');
const reviewRoutes = require('./routes/reviewRoutes.js');
const Booking = require('./models/booking.js');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

// ── Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

// ── Rate Limiting ──────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per window
    message: { error: 'rate_limited', message: 'Too many attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ── Auth Middleware ────────────────────────────────────────────────────
function requireAuth(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'unauthorized', message: 'Please log in' });
    }
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
            return res.status(401).json({ error: 'invalid_token', message: 'Invalid or expired token' });
        }
        req.userData = userData;
        next();
    });
}

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) return reject(err);
            resolve(userData);
        });
    });
}

// ── Database ───────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URL);

// ── Routes ─────────────────────────────────────────────────────────────

app.get('/test', (req, res) => {
    res.json('test ok and is running');
});

// ── Auth Routes (rate limited) ─────────────────────────────────────────

app.post('/register', authLimiter, async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'missing_fields', message: 'Name, email, and password are required' });
    }
    if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'invalid_name', message: 'Name must be at least 2 characters' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'invalid_email', message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'weak_password', message: 'Password must be at least 8 characters' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({ error: 'email_exists', message: 'Email already exists' });
        }

        const userDoc = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(422).json({ error: 'registration_failed', message: 'Registration failed' });
    }
});

app.post('/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'missing_fields', message: 'Email and password are required' });
    }

    try {
        const userDoc = await User.findOne({ email: email.toLowerCase().trim() });

        if (!userDoc) {
            return res.status(404).json({ error: 'not_found', message: 'No account found with this email' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(422).json({ error: 'wrong_password', message: 'Incorrect password' });
        }

        jwt.sign({
            email: userDoc.email,
            id: userDoc._id,
            name: userDoc.name,
        }, jwtSecret, {}, (err, token) => {
            if (err) {
                return res.status(500).json({ error: 'token_error', message: 'Failed to create session' });
            }
            res.cookie('token', token).json(userDoc);
        });
    } catch (error) {
        res.status(500).json({ error: 'server_error', message: 'Login failed' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) return res.status(401).json(null);
            try {
                const user = await User.findById(userData.id);
                if (!user) return res.json(null);
                const { name, email, _id } = user;
                res.json({ name, email, _id });
            } catch (error) {
                res.json(null);
            }
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

// ── Upload Routes ──────────────────────────────────────────────────────

app.post('/upload-by-link', requireAuth, async (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.status(400).json({ error: 'missing_link', message: 'Image link is required' });
    }
    try {
        const newName = 'photo' + Date.now() + '.jpg';
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        });
        res.json(newName);
    } catch (error) {
        res.status(422).json({ error: 'download_failed', message: 'Failed to download image' });
    }
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', requireAuth, photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads', ''));
    }
    res.json(uploadedFiles);
});

// ── Places Routes ──────────────────────────────────────────────────────

app.post('/places', requireAuth, async (req, res) => {
    const {
        title, address, addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price,
    } = req.body;

    if (!title || !address) {
        return res.status(400).json({ error: 'missing_fields', message: 'Title and address are required' });
    }
    if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({ error: 'invalid_price', message: 'Price must be a positive number' });
    }

    try {
        const placeDoc = await Place.create({
            owner: req.userData.id,
            title, address, photos: addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price,
        });
        res.json(placeDoc);
    } catch (error) {
        res.status(500).json({ error: 'create_failed', message: 'Failed to create place' });
    }
});

app.get('/user-places', requireAuth, async (req, res) => {
    try {
        res.json(await Place.find({ owner: req.userData.id }));
    } catch (error) {
        res.status(500).json({ error: 'fetch_failed', message: 'Failed to fetch your places' });
    }
});

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({ error: 'not_found', message: 'Place not found' });
        }
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: 'fetch_failed', message: 'Failed to fetch place' });
    }
});

app.put('/places', requireAuth, async (req, res) => {
    const {
        id, title, address, addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price,
    } = req.body;

    if (!id || !title || !address) {
        return res.status(400).json({ error: 'missing_fields', message: 'ID, title, and address are required' });
    }

    try {
        const placeDoc = await Place.findById(id);
        if (!placeDoc) {
            return res.status(404).json({ error: 'not_found', message: 'Place not found' });
        }
        if (req.userData.id !== placeDoc.owner.toString()) {
            return res.status(403).json({ error: 'forbidden', message: 'You can only edit your own places' });
        }
        placeDoc.set({
            title, address, photos: addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price,
        });
        await placeDoc.save();
        res.json('ok');
    } catch (error) {
        res.status(500).json({ error: 'update_failed', message: 'Failed to update place' });
    }
});

app.get('/places', async (req, res) => {
    try {
        const { search } = req.query;
        if (search && search.trim().length > 0) {
            const regex = new RegExp(search.trim(), 'i');
            const places = await Place.find({
                $or: [
                    { title: regex },
                    { address: regex },
                    { description: regex },
                ],
            });
            return res.json(places);
        }
        res.json(await Place.find());
    } catch (error) {
        res.status(500).json({ error: 'fetch_failed', message: 'Failed to fetch places' });
    }
});

// ── Reviews ────────────────────────────────────────────────────────────
app.use('/api/reviews', reviewRoutes);

// ── Bookings Routes ────────────────────────────────────────────────────

app.post('/bookings', requireAuth, async (req, res) => {
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;

    if (!place || !checkIn || !checkOut || !name || !phone) {
        return res.status(400).json({ error: 'missing_fields', message: 'All booking fields are required' });
    }
    if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({ error: 'invalid_price', message: 'Price must be a positive number' });
    }

    try {
        const doc = await Booking.create({
            place, checkIn, checkOut, numberOfGuests, name, phone, price,
            user: req.userData.id,
        });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'booking_failed', message: 'Failed to create booking' });
    }
});

app.get('/bookings', requireAuth, async (req, res) => {
    try {
        res.json(await Booking.find({ user: req.userData.id }).populate('place'));
    } catch (error) {
        res.status(500).json({ error: 'fetch_failed', message: 'Failed to fetch bookings' });
    }
});

app.delete('/bookings/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'not_found', message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.userData.id) {
            return res.status(403).json({ error: 'forbidden', message: 'You can only cancel your own bookings' });
        }
        await Booking.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'cancel_failed', message: 'Failed to cancel booking' });
    }
});

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'server_error', message: 'Something went wrong' });
});

app.listen(4000);
