import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Box, 
    Tooltip, 
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon
} from '@mui/material';
import { 
    Logout, 
    DarkMode, 
    LightMode, 
    Dashboard as DashboardIcon 
} from '@mui/icons-material';
import { useState } from 'react';

function AppHeader({ username, onLogout, darkMode, toggleDarkMode }) {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    
    const handleLogout = () => {
        onLogout();
        handleCloseMenu();
    };
    
    return (
        <AppBar 
            position="static" 
            color="default" 
            sx={{ 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
                backgroundColor: darkMode ? '#1e1e1e' : 'white',
                mb: 4
            }}
        >
            <Toolbar>
                <DashboardIcon sx={{ mr: 2, color: '#3a6ea5' }} />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 600, 
                        color: darkMode ? 'white' : '#3a6ea5',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    TaskFlow
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                        <IconButton onClick={toggleDarkMode} sx={{ mr: 2 }}>
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Account settings">
                        <IconButton 
                            onClick={handleOpenMenu}
                            size="small"
                            sx={{ ml: 2 }}
                        >
                            <Avatar 
                                sx={{ 
                                    width: 32, 
                                    height: 32,
                                    backgroundColor: '#3a6ea5' 
                                }}
                            >
                                {username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
                
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem disabled>
                        <Typography variant="body2">
                            Signed in as <strong>{username}</strong>
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;
