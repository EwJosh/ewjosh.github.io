import React, { useState } from 'react';
import './navbar.css';
import ppTitle from '../assets/images/PP_Title_Horizontal.png'
import ppTitleVert from '../assets/images/PP_Title_Vertical.png'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';

import { styled } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

const StyledListItem = styled(ListItem)({
    minWidth: '10rem',
    padding: 0
})

const StyledListSubheader = styled(ListSubheader)({
    width: '100%',
    padding: '0.5rem 1rem',

    fontWeight: 'bold',
    fontSize: '2rem',
    color: 'white',
    backgroundColor: 'rgb(190, 99, 13)'
})

const StyledListItemButton = styled(ListItemButton)({
    padding: '0.5rem 1.5rem',

    fontSize: '1.5rem'
})

function Navbar() {
    // // Boolean for determining whether navbar should be using mobile or desktop versions of components and assets.
    // const [small, setSmall] = useState(window.innerWidth <= 800);

    // /**
    //  * Event fired when window is resized. Updates boolean small.
    //  */
    // const handleResize = () => {
    //     if (window.innerWidth <= 800)
    //         setSmall(true);
    //     else
    //         setSmall(false);
    // }
    // window.onresize = handleResize;


    // Boolean state for whether sidebar is open or not.
    const [open, setOpen] = useState(false);

    const handleCloseMenu = () => {
        setOpen(false);
    }


    return (
        <AppBar
            id='heading'
            elevation={0}
        >
            <Toolbar
                id='navbar'
                variant='dense'
                disableGutters
            >
                {/* Sidebar Button */}
                <IconButton
                    id='sidebar-btn'
                    onClick={() => setOpen(true)}
                    onMouseEnter={() => setOpen(true)}
                    sx={{
                        backgroundColor: 'rgb(190, 99, 13)'
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Home Button w/ Picture */}
                <Button
                    id='navbar-title'
                    href='/'
                >
                    <img
                        src={false ? ppTitleVert : ppTitle}
                        alt='Pumpkin Patchwork'
                    />
                </Button>

                {/* Sidebar Menu */}
                <Drawer
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        sx: {
                            minWidth: '20%'
                        }
                    }}
                >
                    <List>
                        {/* Apps Section */}
                        <StyledListItem disableGutters>
                            <StyledListSubheader>
                                Apps
                            </StyledListSubheader>
                        </StyledListItem>
                        <StyledListItem disableGutters>
                            <StyledListItemButton
                                href='/#/apps/nikkeTeamBuilder'
                                component='a'
                                onClick={handleCloseMenu}
                            >
                                Nikke
                            </StyledListItemButton>
                        </StyledListItem>
                        <StyledListItem>
                            <StyledListItemButton
                                href='/#/apps/todo-list'
                                component='a'
                                onClick={handleCloseMenu}
                            >
                                To-do List
                            </StyledListItemButton>
                        </StyledListItem>
                        <StyledListItem>
                            <StyledListItemButton
                                href='/#/apps/clock'
                                component='a'
                                onClick={handleCloseMenu}
                            >
                                Clock
                            </StyledListItemButton>
                        </StyledListItem>
                        <StyledListItem>
                            <StyledListItemButton
                                href='/#/apps/calculator'
                                component='a'
                                onClick={handleCloseMenu}
                            >
                                Calculator
                            </StyledListItemButton>
                        </StyledListItem>

                        {/* More Section */}
                        <StyledListItem disableGutters>
                            <StyledListSubheader>
                                More
                            </StyledListSubheader>
                        </StyledListItem>
                        <StyledListItem>
                            <StyledListItemButton
                                href='/#/about'
                                component='a'
                                onClick={handleCloseMenu}
                            >
                                About
                            </StyledListItemButton>
                        </StyledListItem>
                        <StyledListItem>
                            <StyledListItemButton
                                onClick={handleCloseMenu}
                                disabled
                            >
                                <span style={{ textDecoration: 'line-through' }}>Settings</span>
                            </StyledListItemButton>
                        </StyledListItem>
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;