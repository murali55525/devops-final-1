import { useState } from 'react';
import { TextField, Button, Box, Snackbar, Alert, Paper } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { motion } from 'framer-motion';
import './TodoForm.css';

function TodoForm({ onAddTodo }) {
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) {
            setError('Please enter a task');
            return;
        }
        
        try {
            await onAddTodo({
                text: newTodo.trim(),
                completed: false
            });
            setNewTodo('');
            setError('');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error in form submission:', error);
            setError('Failed to add task. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="What needs to be done?"
                        error={!!error}
                        helperText={error}
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { borderRadius: 2 }
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<AddTaskIcon />}
                        sx={{ 
                            borderRadius: 2, 
                            py: 1.5,
                            background: 'linear-gradient(45deg, #3a6ea5 30%, #4e80b4 90%)',
                            boxShadow: '0 3px 10px rgba(58, 110, 165, 0.2)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #2d5a8b 30%, #3d6a99 90%)',
                                boxShadow: '0 5px 15px rgba(58, 110, 165, 0.3)',
                            }
                        }}
                    >
                        Add Task
                    </Button>
                </Box>
            </Paper>
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Task added successfully!
                </Alert>
            </Snackbar>
        </motion.div>
    );
}

export default TodoForm;