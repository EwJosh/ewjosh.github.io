import React from 'react';
import "./footer.css"

function Footer() {
    return (
        <div id="footer">
            <nav id="footer-links">
                <a className="footer-link" href="/apps">Apps</a>
                <a className="footer-link" href="/games">Games</a>
                <a className="footer-link" href="/about">About</a>
            </nav>
        </div>
    );
}

export default Footer;