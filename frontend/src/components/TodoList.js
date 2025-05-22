import './TodoList.css';
import { Box, Typography, Paper, Checkbox, IconButton, Tooltip, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function TodoList({ todos, onDeleteTodo, onToggleComplete }) {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, color: '#3a6ea5' }}>
                My Tasks ({todos.length})
            </Typography>
            
            {todos.length === 0 && (
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderRadius: 3
                    }}
                >
                    <Typography variant="body1" color="textSecondary">
                        You don't have any tasks yet. Start by adding a new one!
                    </Typography>
                </Paper>
            )}
            
            <AnimatePresence>
                {todos.map(todo => (
                    <TodoItem 
                        key={todo._id} 
                        todo={todo} 
                        onDeleteTodo={onDeleteTodo} 
                        onToggleComplete={onToggleComplete}
                    />
                ))}
            </AnimatePresence>
        </Box>
    );
}

function TodoItem({ todo, onDeleteTodo, onToggleComplete }) {
    const [elevation, setElevation] = useState(2);
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
        >
            <Paper 
                elevation={elevation}
                onMouseEnter={() => setElevation(4)}
                onMouseLeave={() => setElevation(2)}
                sx={{ 
                    p: 2, 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    borderRadius: 2,
                    borderLeft: todo.completed ? '4px solid #4caf50' : '4px solid #ff9800',
                    transition: 'all 0.3s ease'
                }}
            >
                <Checkbox 
                    checked={todo.completed} 
                    onChange={() => onToggleComplete(todo._id, !todo.completed)}
                    color="primary"
                />
                
                <Box sx={{ flex: 1, ml: 1 }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'text.secondary' : 'text.primary',
                            fontWeight: 500
                        }}
                    >
                        {todo.text}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
                        <Chip 
                            label={todo.completed ? "Completed" : "Active"} 
                            size="small" 
                            color={todo.completed ? "success" : "warning"}
                            sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
                
                <Tooltip title="Delete task">
                    <IconButton 
                        onClick={() => onDeleteTodo(todo._id)}
                        color="error"
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: 'rgba(244, 67, 54, 0.1)' 
                            } 
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Paper>
        </motion.div>
    );
}

export default TodoList;