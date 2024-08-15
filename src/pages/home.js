import React from 'react';
import './home.css'

function Home() {
    return (
        <div className="page">
            <div className="grid-row">
                <div className="half-box large-text-box">
                    <p>
                        Welcome, weary traveler, to the <i>Pumpkin Patchwork</i>!
                        A website housing a variety of applications and whatnot.
                    </p>
                    <p >
                        Enjoy your stay, crafted by Edward Josh Hermano!
                    </p></div>
                <div className="half-box center-items">
                    <img
                        id="cool-guy-img"
                        src="https://images.pexels.com/photos/3951638/pexels-photo-3951638.jpeg"
                        //?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
                        alt="coolGuyPicture.png"
                    />
                    <span>
                        A (not) real visitor of this website. They gave it two thumbs up!
                    </span>
                </div>
            </div>
            <div className="grid-row paper-back">
                <div className="half-box center-items">
                    <img
                        id="cool-guy-img"
                        src="https://images.pexels.com/photos/3036363/pexels-photo-3036363.jpeg"
                        alt="coolGuyPicture.png"
                    />
                </div>
                <div className="half-box large-text-box">
                    <p>
                        Take a pumpkin and walk around.
                    </p>
                </div>
            </div>
        </div>);
}

export default Home;