import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Paper, Box, Alert } from '@mui/material';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Login from './components/Login';
import AppHeader from './components/AppHeader';
import { todoService, authService } from './services/api';
import './App.css';

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [authError, setAuthError] = useState(null);
    
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#3a6ea5',
            },
            secondary: {
                main: '#ff6b6b',
            },
            background: {
                default: darkMode ? '#121212' : '#f9f9f9',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
            },
        },
        typography: {
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 600 },
            h2: { fontWeight: 600 },
            h3: { fontWeight: 600 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                },
            },
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            // Verify token validity
            try {
                await authService.verifyToken();
                setAuthenticated(true);
                setUsername(localStorage.getItem('username') || 'User');
                await fetchTodos();
            } catch (error) {
                console.error('Token verification failed:', error);
                authService.logout();
                setAuthError('Your session has expired. Please log in again.');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            authService.logout();
        } finally {
            setLoading(false);
        }
    };

    const fetchTodos = async () => {
        try {
            const data = await todoService.getAll();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            // If unauthorized, log out
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                authService.logout();
                setAuthenticated(false);
            }
        }
    };

    const addTodo = async (todoData) => {
        try {
            const newTodo = await todoService.create(todoData);
            setTodos([...todos, newTodo]);
            return newTodo;
        } catch (error) {
            console.error('Error adding todo:', error);
            throw error;
        }
    };

    const deleteTodo = async (id) => {
        try {
            await todoService.delete(id);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            await todoService.update(id, { completed });
            setTodos(todos.map(todo => 
                todo._id === id ? { ...todo, completed } : todo
            ));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleLogin = (username) => {
        setAuthenticated(true);
        setUsername(username);
        localStorage.setItem('username', username);
        fetchTodos();
    };

    const handleLogout = () => {
        authService.logout();
        setAuthenticated(false);
        setUsername('');
        setTodos([]);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {authenticated ? (
                <>
                    <AppHeader 
                        username={username} 
                        onLogout={handleLogout}
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                    <Container maxWidth="md" sx={{ mb: 8 }}>
                        <Box sx={{ mb: 6, textAlign: 'center' }}>
                            <h1 className="app-title">Welcome to TaskFlow</h1>
                            <p className="app-subtitle">
                                Manage your tasks efficiently and stay productive
                            </p>
                        </Box>
                        
                        <TodoForm onAddTodo={addTodo} />
                        <TodoList 
                            todos={todos} 
                            onDeleteTodo={deleteTodo} 
                            onToggleComplete={toggleComplete}
                        />
                    </Container>
                </>
            ) : (
                <>
                    {authError && (
                        <Box sx={{ 
                            position: 'fixed', 
                            top: 20, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            zIndex: 9999
                        }}>
                            <Alert 
                                severity="error" 
                                onClose={() => setAuthError(null)}
                                sx={{ boxShadow: 3 }}
                            >
                                {authError}
                            </Alert>
                        </Box>
                    )}
                    <Login onLogin={handleLogin} />
                </>
            )}
        </ThemeProvider>
    );
}

export default App;