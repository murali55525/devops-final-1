import { useState } from 'react';
import { 
    TextField, 
    Button, 
    Paper, 
    Typography, 
    Box, 
    Container,
    Alert,
    Snackbar,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, PersonAdd } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

// Add debugging information to the Login component
function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [debugInfo, setDebugInfo] = useState(null);
    const [showDebug, setShowDebug] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        
        // Registration password validation
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            if (isLogin) {
                await authService.login({ username, password });
                onLogin(username);
            } else {
                await authService.register({ username, password });
                setOpenSnackbar(true);
                setIsLogin(true);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(isLogin ? 'Invalid credentials' : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const testAPI = async () => {
        try {
            setDebugInfo('Testing API connection...');
            const result = await authService.testAPI();
            setDebugInfo(`API test successful: ${JSON.stringify(result)}`);
        } catch (error) {
            setDebugInfo(`API test failed: ${error.message}`);
        }
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper 
                    elevation={4} 
                    sx={{ 
                        p: 4, 
                        mt: 8,
                        borderRadius: 3,
                        background: 'linear-gradient(to right bottom, white, #f9f9f9)'
                    }}
                >
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#3a6ea5' }}>
                            TaskFlow
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isLogin ? 'Sign in to manage your tasks' : 'Create an account to get started'}
                        </Typography>
                    </Box>

                    <Tabs 
                        value={isLogin ? 0 : 1} 
                        onChange={(_, value) => setIsLogin(value === 0)}
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Login" icon={<LoginIcon />} iconPosition="start" />
                        <Tab label="Register" icon={<PersonAdd />} iconPosition="start" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                        />
                        
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        {!isLogin && (
                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                        )}
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #3a6ea5 30%, #4e80b4 90%)',
                                boxShadow: '0 3px 10px rgba(58, 110, 165, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #2d5a8b 30%, #3d6a99 90%)',
                                }
                            }}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
            
            {/* Add debug section */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setShowDebug(!showDebug)}
                    sx={{ mb: 2 }}
                >
                    {showDebug ? 'Hide Debug' : 'Show Debug'}
                </Button>
                
                {showDebug && (
                    <Paper sx={{ p: 2, mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>Debug Tools</Typography>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={testAPI}
                            sx={{ mr: 1 }}
                        >
                            Test API
                        </Button>
                        
                        {debugInfo && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {debugInfo}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                )}
            </Box>
            
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Registration successful! You can now log in.
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Login;
