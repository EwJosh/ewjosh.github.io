import React from 'react';
import './footer.css'

import { GitHub, LinkedIn } from '@mui/icons-material';

function Footer() {
    return (
        <div id='footer' className='flex-column'>
            <nav id='footer-links'>
                <a className='footer-link' href='#/about'>About</a>
            </nav>
            <div className='flex-row'>
                <span>Website made by Edward Josh Hermano</span>
                <a className='footer-link' href='https://github.com/EwJosh/ewjosh.github.io'>
                    <GitHub />
                </a>
                <a className='footer-link' href='https://www.linkedin.com/in/edward-josh-hermano/'>
                    <LinkedIn />
                </a>
            </div>
        </div>
    );
}

export default Footer;