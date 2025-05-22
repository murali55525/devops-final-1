const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://frontend', 'http://frontend:80'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(express.json());

// MongoDB connection - check environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tododb';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB at', MONGODB_URI))
    .catch(err => console.log('MongoDB connection error:', err));


// Todo Schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Middleware for authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Request path:', req.path);
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
        console.log('No authorization header provided');
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('No token found in authorization header');
        return res.status(401).json({ error: 'Unauthorized - Invalid header format' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ error: `Forbidden - ${err.message}` });
        }
        console.log('Token verified successfully for user:', decoded.username);
        req.user = decoded;
        next();
    });
};

// User routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
});

// Routes
app.get('/api/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/todos', authenticate, async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text,
            completed: req.body.completed || false,
            userId: req.user.id
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ error: 'Bad request' });
    }
});

app.put('/api/todos/:id', authenticate, async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(400).json({ error: 'Bad request' });
    }
});

app.delete('/api/todos/:id', authenticate, async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// Add a test route that doesn't require authentication
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Debug route to check authorization header
app.get('/api/debug/auth', (req, res) => {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    
    if (!authHeader) {
        return res.status(400).json({ 
            error: 'No authorization header present',
            headers: req.headers
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, 'secret_key');
        res.json({ 
            success: true, 
            message: 'Token is valid', 
            decoded,
            user: decoded.username
        });
    } catch (error) {
        res.status(401).json({ 
            error: 'Invalid token', 
            message: error.message,
            token: token.substring(0, 10) + '...'
        });
    }
});

// Start server
const PORT = 5000;
app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
  });
