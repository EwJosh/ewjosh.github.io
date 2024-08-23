import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

function NikkeHelp(props) {
    return (
        <Dialog
            id='help-dialog'
            open={props.open}
            onClose={props.onClose}
            PaperProps={{
                style: {
                    minWidth: '50vw'
                }
            }}
        >
            <DialogTitle>
                Help
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <h2>How to use Nikke Team Builder:</h2>
                    <ul>
                        <li>Press the (+) Button to move a Nikke from Roster (or Squad) to the Bench.</li>
                        <li>Drag and drop Nikkes into the dark box of a Squad.</li>
                    </ul>

                    <hr />
                    <h2>Available features</h2>

                    <h3>= Squads =</h3>
                    <ul>
                        <li>Names can be edited and Squads can be added or removed by toggling the &lt;Edit&gt; button in the top-right.</li>
                        <li>Pressing the (-) Button on a Nikke will move them to the Bench.</li>
                        <li>
                            Has a 'rating system' that's WIP. I don't plan on rating things like damage calcs and breakpoints.
                            They're just mainly to check if you have a stable team.
                        </li>
                        <li>
                            <h4>
                                Rating system covers...
                            </h4>
                        </li>
                        <ul>
                            <li>
                                Squad size (Simply whether your squad is at a full legal size, 5 Nikkes)
                            </li>
                            <li>
                                Full Burst potential (Can your squad reach Full Burst, and preferrably do so every 20 seconds?)
                            </li>
                            <ul>
                                <li>
                                    Covers edge cases for B1-Recast, Red Hood's BV, and Blanc's special burst cooldown.
                                </li>
                            </ul>
                            <li>
                                Matches Code Weakness (If set in 'Settings,' does your squad have at least one matching Nikke?)
                            </li>
                        </ul>
                        <li>
                            <h4>
                                WIP Rating features...
                            </h4>
                        </li>
                        <ul>
                            <li>
                                Has or lacks Sustain (Healer/Shielder)
                            </li>
                            <li>
                                Has [other kinds of such tags]
                            </li>
                        </ul>
                    </ul>

                    <h3>= Bench and Roster =</h3>
                    <ul>
                        <li>Roster is initialized with all the Nikke units (up until Zwei so far).</li>
                        <li>
                            Bench is meant to be a quick placeholder for your use.
                            Like a favorites while you organize your squads.
                            This should reduce going back and forth between the Roster and your squads
                        </li>
                        <li>
                            I made this primarily for Solo Raids, thus there are no repeat Nikkes (i.e. once a Nikke is deployed, it cannot be deployed again).
                            I will eventually make this a toggleable feature, in case you're looking to build squads for other reasons.
                        </li>
                        <li>
                            <i><b>Bug:</b> Can't Drop Nikkes into a line beyond the first line if the droppable area has multiple lines.</i>
                        </li>
                    </ul>

                    <h3>= Filter =</h3>
                    <ul>
                        <li>
                            Filter can be used to filter through the Nikke Roster by their tag.
                            Nikkes with unselected tags (grey and smaller) will be removed from view in the Roster section.
                        </li>
                        <li>
                            If all tags of a category are selected, clicking on a tag will focus on that tag.
                            (i.e. That tag will remain selected and all others will be deselected.)
                            This is intended to echo Nikke's own filtering behavior.
                        </li>
                        <li>
                            <h4>The categories available for filtering are</h4>
                            <ul>
                                <li>Burst (1-Recast and Red Hood's are distinct here)</li>
                                <li>Base Burst Cooldown</li>
                                <li>Rarity (by default, R and SR are deselected)</li>
                                <li>Class</li>
                                <li>Code/Element</li>
                                <li>Manufacturer</li>
                                <li>Weapon</li>

                                <li> Full Central Government  Name (abbreviations are not used
                                    (<i>e.g. searching 'Anis: SS' won't show Anis: SS, but 'Anis: Sparkling Summer' would</i>).
                                    I could implement this, but you don't really need to specify beyond the first name
                                    and doing so would mean the page has to do even more checks).
                                </li>
                            </ul>
                        </li>
                        <li>The filter section can be hidden. The filter tags can also be reset with one button.</li>
                        <li>Toggling the &lt;Eye&gt; buttons next to certain categories will toggle the visibility of their respective icons.</li>
                    </ul>

                    <h3>= Settings =</h3>
                    <ul>
                        <li>
                            Code Weakness can be selected. When selected, Squad Rating will check if your squad has at least one unit with the selected code.
                            Important for getting that 10% bonus damage or when Raid bosses have code immunity.
                        </li>
                    </ul>

                    <hr />
                    <h2>Upcoming Features</h2>
                    <ul>
                        <li>
                            Miscellaneous Tag System.
                            Used for filtering and rating in regards to Nikke attributes
                            such as healing, shielding, pierce, true damage, cleansing, etc.
                        </li>
                        <li>Move &lt;Hide Filter&gt; to Settings Menu.</li>
                        <li>Add &lt;Hide Bench&gt; and &lt;Hide Roster&gt; to Settings Menu.</li>
                        <li>Add &lt;Allow Duplicate Nikkes&gt; to Settings Menu.</li>
                        <li>Save and share teams.</li>
                    </ul>

                    <hr />
                    <h2>Credits</h2>
                    <ul>
                        <li>
                            <i>Nikke: Goddess of Victory</i> and their assets are owned by Shift Up, Level Infinite, and Tencent.
                        </li>
                        <li>The Nikke Unit Avatars are borrowed from the Nikke DB Team.</li>
                        <li>Nikke's hexagonal icons were recreated by me.</li>
                    </ul>
                </DialogContentText>
            </DialogContent >
        </Dialog >
    );
}

export default NikkeHelp;