import React from 'react';
import './navbar.css';
import ppTitle from '../assets/images/Pumpkin_Patchwork_Title.png'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (index, event) => {
        setAnchorEl({ [index]: event.currentTarget });
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                <Button
                    id='navbar-title'
                    href='/'
                >
                    <img
                        src={ppTitle}
                        alt='Pumpkin Patchwork'
                    />
                </Button>

                <Button
                    id='navbar-apps-btn'
                    className='navbar-btn'
                    aria-controls='navbar-apps-menu'
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : 'false'}
                    onClick={(e) => handleClick(0, e)}
                    onMouseOver={(e) => handleClick(0, e)}
                    // onMouseLeave={handleClose}
                    color='inherit'
                    sx={{
                        minWidth: '5vw',
                        backgroundColor: 'rgb(190, 99, 13)'
                    }}
                >
                    Apps
                </Button>
                <Menu
                    id='navbar-apps-menu'
                    aria-labelledby='navbar-apps-btn'
                    anchorEl={anchorEl && anchorEl[0]}
                    open={anchorEl && anchorEl[0]}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    MenuListProps={{ onMouseLeave: handleClose }}
                >
                    <MenuItem
                        href='/#/apps/clock'
                        component='a'
                        onClick={handleClose}
                    >
                        Clock
                    </MenuItem>
                    <MenuItem
                        href='/#/apps/calculator'
                        component='a'
                        onClick={handleClose}
                    >
                        Calculator
                    </MenuItem>
                    <MenuItem
                        href='/#/apps/nikkeTeamBuilder'
                        component='a'
                        onClick={handleClose}
                    >
                        Nikke
                    </MenuItem>
                </Menu>

                <Button
                    id='navbar-games-btn'
                    className='navbar-btn'
                    aria-controls='navbar-games-menu'
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : 'false'}
                    onClick={(e) => handleClick(1, e)}
                    onMouseOver={(e) => handleClick(1, e)}
                    color='inherit'
                    sx={{
                        minWidth: '5vw',
                        backgroundColor: 'rgb(190, 99, 13)'
                    }}
                >
                    Games
                </Button>
                <Menu
                    id='navbar-games-menu'
                    className='navbar-btn'
                    aria-labelledby='navbar-games-btn'
                    anchorEl={anchorEl && anchorEl[1]}
                    open={anchorEl && anchorEl[1]}
                    onClose={handleClose}

                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    MenuListProps={{ onMouseLeave: handleClose }}
                >
                    <MenuItem disabled>You got games on your phone?</MenuItem>
                    {/* <MenuItem onClick={handleClose}>Tic Tac Toe</MenuItem>
                    <MenuItem onClick={handleClose}>Piranha Frenzy</MenuItem> */}
                </Menu>

                <Button
                    id='navbar-about-btn'
                    className='navbar-btn'
                    // aria-controls={open ? 'navbar-about-menu' : undefined}
                    // aria-haspopup='true'
                    // aria-expanded={open ? 'true' : 'false'}
                    // onClick={(e) => handleClick(2, e)}
                    // onMouseOver={(e) => handleClick(2, e)}
                    href='/#/about'
                    color='inherit'
                    sx={{
                        minWidth: '5vw',
                        backgroundColor: 'rgb(190, 99, 13)'
                    }}
                >
                    About
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;