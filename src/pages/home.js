import React, { useState } from 'react';
import './home.css'

function Home() {
    const [pumpkin, setPumpkin] = useState(0);

    const takePumpkin = () => {
        setPumpkin(pumpkin + 1);
    }

    return (
        <div className="page">
            <div className="grid-row spacing-1">
                <div className="half-box paper-back">
                    <p>
                        Welcome, weary traveler, to the <i>Pumpkin Patchwork</i>!
                        A website housing a variety of applications and whatnot.
                    </p>
                    <p >
                        Enjoy your stay, crafted by Edward Josh Hermano!
                    </p></div>
                <div className="half-box center-items spacing-1">
                    <img
                        id="cool-guy-img"
                        src="https://images.pexels.com/photos/3951638/pexels-photo-3951638.jpeg"
                        alt="coolGuyPicture.png"
                    />
                    <span>
                        A (not) real visitor of this website. They gave it two thumbs up!
                    </span>
                </div>
            </div>
            <div className="grid-row bgc-1 spacing-1 full-width">
                <div className="half-box center-items">
                    <img
                        id="cool-guy-img"
                        src="https://images.pexels.com/photos/3036363/pexels-photo-3036363.jpeg"
                        alt="coolGuyPicture.png"
                        onClick={takePumpkin}
                    />
                </div>
                <div className="half-box">
                    {
                        pumpkin === 0 ?
                            <p>
                                Take a pumpkin and walk around.
                            </p>
                            : null
                    }
                    {
                        pumpkin === 1 ?
                            <p>
                                Oh. You actually took one...
                            </p>
                            : null
                    }
                    {
                        pumpkin > 1 ?
                            <p>
                                No, you can only have one and we can't take it back.
                            </p>
                            : null
                    }
                </div>
            </div>
        </div>);
}

export default Home;