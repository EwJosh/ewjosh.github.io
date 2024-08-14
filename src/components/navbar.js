import React from 'react';
import "./navbar.css";
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
            id="heading"
            elevation={0}
        >
            <Button
                id="navbar-title"
                href="/"
                color="inherit"
            >
                <img
                    src={ppTitle}
                    alt="Pumpkin Patchwork"
                />
            </Button>
            <Toolbar
                id="navbar"
                variant="dense"
                disableGutters
            >
                <Button
                    id="navbar-apps-btn"
                    aria-controls={open ? "navbar-apps-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : "false"}
                    onClick={(e) => handleClick(0, e)}
                    onMouseOver={(e) => handleClick(0, e)}
                    color="inherit"
                >
                    Apps
                </Button>
                <Menu
                    id="navbar-apps-menu"
                    aria-labelledby="navbar-apps-btn"
                    anchorEl={anchorEl && anchorEl[0]}
                    open={anchorEl && anchorEl[0]}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    MenuListProps={{ onMouseLeave: handleClose }}
                >
                    <MenuItem
                        href="/apps/clock"
                        component="a"
                        onClick={handleClose}
                    >
                        Clock
                    </MenuItem>
                    <MenuItem
                        href="/apps/calculator"
                        component="a"
                        onClick={handleClose}
                    >
                        Calculator
                    </MenuItem>
                    <MenuItem
                        href="/apps/nikkeTeamBuilder"
                        component="a"
                        onClick={handleClose}
                    >
                        Nikke
                    </MenuItem>
                </Menu>

                <Button
                    id="navbar-games-btn"
                    aria-controls={open ? "navbar-games-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : "false"}
                    onClick={(e) => handleClick(1, e)}
                    onMouseOver={(e) => handleClick(1, e)}
                    color="inherit"
                >
                    Games
                </Button>
                <Menu
                    id="navbar-games-menu"
                    aria-labelledby="navbar-games-btn"
                    anchorEl={anchorEl && anchorEl[1]}
                    open={anchorEl && anchorEl[1]}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    MenuListProps={{ onMouseLeave: handleClose }}
                >
                    <MenuItem onClick={handleClose}>Tic Tac Toe</MenuItem>
                    <MenuItem onClick={handleClose}>Piranha Frenzy</MenuItem>
                </Menu>

                <Button
                    id="navbar-about-btn"
                    aria-controls={open ? "navbar-about-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : "false"}
                    onClick={(e) => handleClick(2, e)}
                    onMouseOver={(e) => handleClick(2, e)}

                    color="inherit"
                >
                    About
                </Button>
                <Menu
                    id="navbar-about-menu"
                    aria-labelledby="navbar-about-btn"
                    anchorEl={anchorEl && anchorEl[2]}
                    open={anchorEl && anchorEl[2]}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    MenuListProps={{ onMouseLeave: handleClose }}
                >
                    <MenuItem onClick={handleClose}>About</MenuItem>
                    <MenuItem onClick={handleClose}>About</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;