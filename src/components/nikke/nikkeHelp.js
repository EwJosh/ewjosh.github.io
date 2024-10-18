import React, { useState } from 'react';

// Import MUI components
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material';

// Import MUI icons
import Edit from '@mui/icons-material/Edit';
import Settings from '@mui/icons-material/Settings';
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Close from '@mui/icons-material/Close';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import Visibility from '@mui/icons-material/Visibility';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Info from '@mui/icons-material/InfoOutlined';
import Link from '@mui/icons-material/Link';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

/**
 * Restyled <h3> for being used as a dropdown/accordion button
 */
const DropdownButton = styled('h3')({
    minHeight: '2rem',
    borderWidth: '5px',
    borderColor: 'white',
    margin: '1rem 0 0',
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center',
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#ffffff20'
    }
})


function NikkeHelp(props) {
    // State used for the opening of certain sections.
    const [open, setOpen] = useState({
        'nikkes': false,
        'squads': true,
        'reviews': false,
        'broster': true,
        'filter': true,
        'settings': true
    })

    /**
     * Toggles the open state for a given section.
     * @param {string} section Value for the section to be toggled.
     */
    const handleClick = (section) => {
        setOpen({
            ...open,
            [section]: !open[section]
        })
    }

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
            {/* Header */}
            <DialogTitle className='dialog-header' style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                Help
                <IconButton onClick={props.onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <hr />

            {/* Body */}
            <DialogContent id='help-dialog-body'>
                {/* Basic Instructions */}
                <h2>How to use the Nikke Team Builder:</h2>
                <ul>
                    <li>
                        Select the <Add fontSize='inherit' className='menu-icon-text' /> Move button
                        to transfer a Nikke from the Roster to the Bench.
                    </li>
                    <li>
                        Drag and drop Nikkes from the <ChairAltIcon fontSize='inherit' className='menu-icon-text' /> Bench
                        into the dark box of a <RecentActorsIcon fontSize='inherit' className='menu-icon-text' /> Squad.
                    </li>
                    <li>
                        More squads can be added after toggling
                        the <Edit fontSize='inherit' className='menu-icon-text' /> Edit
                        button.
                    </li>
                    <li>
                        Check
                        the <Settings fontSize='inherit' className='menu-icon-text' /> Settings
                        button for more settings.
                    </li>
                    <li>
                        Squads can be imported/exported by the updated URL in your browser.
                        You can include the Bench using the button in <Settings fontSize='inherit' className='menu-icon-text' /> Settings.
                    </li>
                </ul>

                {/* More detailed specifications */}
                <hr />
                <h2>Available features</h2>
                <span>Click to collapse sections.</span>

                {/* Nikke Details */}
                <DropdownButton
                    className={open.nikkes ?
                        'dropdown-btn dropdown-btn-open'
                        : 'dropdown-btn dropdown-btn-closed'
                    }
                    onClick={() => handleClick('nikkes')}
                >
                    {open.nikkes ? <ArrowDropDownIcon fontSize='large' /> : <ArrowDropUpIcon fontSize='large' />}
                    <AccountBoxIcon fontSize='inherit' className='menu-icon-text' />
                    <span> Nikkes</span>
                </DropdownButton>
                <Collapse in={open.nikkes}>
                    <ul className='dropdown-body'>
                        <li>
                            <b>Nikkes</b> are rendered in this application as cards and contain information reflecting their in-game stats.
                        </li>
                        <li>
                            Selecting the <Add
                                fontSize='inherit'
                                className='menu-icon-text'
                            /> / <Remove
                                fontSize='inherit'
                                className='menu-icon-text'
                            /> Quick Move buttons will move the Nikke to either the Bench or Roster, depending on its current location.
                        </li>
                        <li>
                            If the Nikke is located in the Bench or a Squad, you can drag and drop their card to assign them.
                        </li>
                        <li>
                            Selecting the <Info fontSize='inherit' className='menu-icon-text' /> Info button
                            will show a pop-up containing more detailed information regarding the Nikke.
                        </li>
                        <li>
                            <b>Nikkes contain the following information:</b>
                        </li>
                        <ul>
                            <li>Portrait Image</li>
                            <li>Name</li>
                            <ul><li>May be shortened or altered in the card</li></ul>
                            <li>Rarity</li>
                            <ul><li>In the cards, it's displayed as a background highlight behind the basic tag icons.</li></ul>
                            <li>Burst Stage</li>
                            <ul>
                                <li>Re-enter Bursts (1R/2R) are regarded as separate from their base Burst values (1/2)</li>
                                <li>Red Hood's Burst Lambda is typed out as 'V' in the pop-up</li>
                            </ul>
                            <li>Base Burst Cooldown</li>
                            <ul>
                                <li>In the card, it's indicated by the amount of banners underneath the Burst Stage.</li>
                                <li className='list-style-none'>1 banner for 20 sec, 2 banners for 40 sec, 3 banners for 60 sec. </li>
                            </ul>
                            <li>Code/Element</li>
                            <li>Weapon</li>
                            <li>Class</li>
                            <li>Company/Manufacturer</li>
                            <li>Character Color</li>
                            <ul>
                                <li>tl;dr Characters in Nikke (Playable and certain NPCs) have colors, most notably used in their dialog.</li>
                                <li>In the cards, it's shown as the border underneath their portrait.</li>
                                <li> In the pop-up, it's shown along the left border of the pop-up.</li>
                            </ul>
                            <li>Skill Triggers</li>
                            <ul>
                                <li>e.g. 'Last Bullet,' 'Below HP Threshold,' etc.</li>
                                <li>For simplicity, not all Triggers have been recorded. Only the more simple or important Triggers are listed.</li>
                            </ul>
                            <li>Scaling Stats and Scaling Effects</li>
                            <ul>
                                <li>Related Scaling Stats and Effects are linked by a <b className='menu-icon-text'>:</b>.</li>
                                <li>
                                    Scaling Stats are stats that are explicitly used in calculations for determining skill numbers.
                                    Useful in determining whether a team synergizes well.
                                    (e.g. 2B's damage output scales in proportion to her Final Max HP.)
                                </li>
                                <li>For simplicity, Scaling Effects is a generalization of the scaling stat's direct effect.</li>
                                <li>If effect directly increases DPS, such as by 'ATK ▲' or 'Charge Spd ▲', it will be labeled as 'Buff Dmg.'</li>
                                <li>If effect directly increases Sustainability, such as by 'Recovering HP' or 'Applying Shield', it will be labeled as 'Sustain.'</li>
                                <li>If effect directly deal damage it will be labeled as 'Deal Dmg.'</li>
                            </ul>
                            <li>Skill Effects and Skill Targets</li>
                            <ul>
                                <li>Related Skill Effects and Targets are linked by a <b className='menu-icon-text'>:</b>.</li>
                                <li>For simplicity, Skill Targets have been watered down here. However, Skill Effects should be entirely comprehensive.</li>
                                <li>'Partial Allies'/'Partial Enemies' is anything outside 'Self'/'Single Enemy' and 'All Allies'/'All Enemies.'</li>
                                <li>If there is a special Target such as 'Weapon' or 'Class,'' displaying that takes priority over 'Self/Single/Partial/All.'</li>
                            </ul>
                        </ul>
                        <li>
                            For the full view of the database used in this app, you can check out this Google Sheets link.
                            (If you see this, I have not uploaded the link yet.)
                        </li>
                    </ul>
                </Collapse>

                {/* Squads Details */}
                <DropdownButton
                    className={open.squads ?
                        'dropdown-btn dropdown-btn-open'
                        : 'dropdown-btn dropdown-btn-closed'
                    }
                    onClick={() => handleClick('squads')}
                >
                    {open.squads ? <ArrowDropDownIcon fontSize='large' /> : <ArrowDropUpIcon fontSize='large' />}
                    <RecentActorsIcon fontSize='inherit' className='menu-icon-text' />
                    <span> Squads</span>
                </DropdownButton>
                <Collapse in={open.squads}>
                    <ul className='dropdown-body'>
                        <li>
                            Nikkes can be <b>dragged and dropped</b> among the Bench and Squads.
                        </li>
                        <ul>
                            <li>
                                Pressing the <Remove fontSize='inherit' className='menu-icon-text' /> Quick Move button
                                on a Nikke will move them to the Bench.
                            </li>
                        </ul>
                        <li>
                            <b>Toggling the <Edit fontSize='inherit' className='menu-icon-text' /> Edit button</b> at the top
                            will enable "Edit Mode." When "Edit Mode" is active...
                            <ul>
                                <li>
                                    Squads can be <Add fontSize='inherit' className='menu-icon-text' /> added
                                    or <Remove fontSize='inherit' className='menu-icon-text' /> removed.
                                </li>
                                <li> Squad names can be changed. </li>
                                <li>
                                    Squads can be <SettingsBackupRestoreIcon fontSize='inherit' className='menu-icon-text' /> emptied
                                    all at once.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Toggling the <ArrowDropDownIcon fontSize='inherit' className='menu-icon-text' /> Dropdown button
                            will minimize the Squad.
                            Similarly, the <ArrowDropDownIcon fontSize='inherit' className='menu-icon-text' /> Dropdown button
                            at the top of the page will minimize all Squads.
                        </li>
                        <li>
                            The layout of Squads can be configured in the <Settings fontSize='inherit' className='menu-icon-text' /> Settings.
                            The amount of Squads displayed per row can be selected between 1-3.
                            For mobile, it's recommended to stay at 1 Squad per row.
                        </li>
                        <li>
                            Has a 'review system'. I don't plan on reviewing things like damage calcs and breakpoints.
                            They're just mainly to check if you have a stable team. Can be disabled via Settings
                        </li>
                        <li>If you hover over the review note (or hold press on mobile), you'll see a tooltip about the review.</li>
                        {/* Review sub-section */}
                        <DropdownButton
                            className={open.reviews ?
                                'dropdown-btn dropdown-btn-nested dropdown-btn-open'
                                : 'dropdown-btn dropdown-btn-nested dropdown-btn-closed'
                            }
                            onClick={() => handleClick('reviews')}
                            sx={{ borderWidth: '2px', marginRight: '1rem' }}
                        >
                            {open.reviews ? <ArrowDropDownIcon fontSize='large' /> : <ArrowDropUpIcon fontSize='large' />}
                            <span> Review</span>
                        </DropdownButton>
                        <Collapse in={open.reviews} className={open.reviews ? 'dropdown-body dropdown-body-nested' : ''}>
                            <li>
                                Review system covers...
                            </li>
                            <ul >
                                <li>
                                    Squad size (Simply whether your squad is at a full legal size, 5 Nikkes)
                                </li>
                                <li>
                                    Full Burst potential (Can your squad reach Full Burst, and preferrably do so every ~20 seconds?)
                                </li>
                                <li>
                                    Covers edge cases for
                                    B1 Re-enter,
                                    Red Hood's Burst Lambda <i>but NOT duplicate Red Hoods</i>,
                                    and Blanc's special burst cooldown with Squad 777.
                                </li>
                                <li>
                                    Matches Code Weakness (If set in <Settings fontSize='inherit' className='menu-icon-text' /> Settings
                                    or the top of the page,
                                    does your squad have at least one matching Nikke?)
                                </li>
                            </ul>
                            <li>
                                WIP Review features...
                            </li>
                            <ul>
                                <li>
                                    Has or lacks Sustain (Healer/Shielder)
                                </li>
                                <li>
                                    Has [other kinds of such tags]
                                </li>
                            </ul>
                        </Collapse>
                    </ul>
                </Collapse>

                {/* Bench and Roster Details */}
                <DropdownButton
                    className={open.broster ?
                        'dropdown-btn dropdown-btn-open'
                        : 'dropdown-btn dropdown-btn-closed'
                    }
                    onClick={() => handleClick('broster')}
                >
                    {open.broster ? <ArrowDropDownIcon fontSize='large' /> : <ArrowDropUpIcon fontSize='large' />}
                    <ChairAltIcon fontSize='inherit' className='menu-icon-text' />
                    <span> Bench &</span>
                    <PersonSearchIcon fontSize='inherit' className='menu-icon-text' sx={{ paddingLeft: '6px' }} />
                    <span> Roster </span>
                </DropdownButton>
                <Collapse in={open.broster}>
                    <ul className='dropdown-body'>
                        <li>
                            The <b>Bench</b> is meant to be a quick placeholder for your use.
                            Like a 'Favorites' while you organize your squads.
                            This should reduce going back and forth between the Roster and your squads
                        </li>
                        <ul>
                            <li>
                                Nikkes can be dragged and dropped among the Bench and Squads.
                            </li>
                            <li>
                                Nikkes can be returned from the Bench to the Roster
                                via the <Remove fontSize='inherit' className='menu-icon-text' /> Quick Move button.
                            </li>
                        </ul>
                        <li>
                            The <b>Roster</b> is initialized with all the Nikke units
                            (up until <i>Rouge</i> so far).
                        </li>
                        <ul>
                            <li>
                                Nikkes can be moved from the Roster to the Bench
                                via the <Add fontSize='inherit' className='menu-icon-text' /> Quick Move button.
                            </li>
                            <li>
                                Roster's ability to drag-and-drop is disabled.
                            </li>
                            <li>The Roster is filtered.</li>
                            <li>
                                The amount of Nikkes rendered in the Roster is limited to reduce lag.
                                If the roster exceeds the max (configurable in <Settings fontSize='inherit' className='menu-icon-text' /> Settings),
                                there will be a <MoreHorizIcon fontSize='inherit' className='menu-icon-text'>...</MoreHorizIcon> button
                                that temporarily overrides the limiter.
                            </li>
                            <li>
                                The Roster can also be moved to a side menu in
                                the <Settings fontSize='inherit' className='menu-icon-text' /> Settings to reduce lag and scrolling.
                            </li>
                        </ul>
                        <li>
                            Duplicate Nikkes are not initially allowed in this Team Builder for the sake of Solo Raids.
                            Can be enabled in this Team Builder in the <Settings fontSize='inherit' className='menu-icon-text' /> Settings.
                        </li>
                        <li>
                            <i><b>Bug:</b> Can't Drop Nikkes into a line beyond the first line if the droppable area has multiple lines.</i>
                        </li>
                    </ul>
                </Collapse>
                <DropdownButton
                    className={open.filter ?
                        'dropdown-btn dropdown-btn-open'
                        : 'dropdown-btn dropdown-btn-closed'
                    }
                    onClick={() => handleClick('filter')}
                >
                    {open.filter ? <ArrowDropDownIcon fontSize='large' /> : <ArrowDropUpIcon fontSize='large' />}
                    <FilterAltIcon fontSize='inherit' className='menu-icon-text' />
                    <span> Filter </span>
                </DropdownButton>
                <Collapse in={open.filter}>
                    <ul className='dropdown-body'>
                        <li>
                            The <b>Filter</b> can be used to filter through the Nikke Roster by their tag.
                            Nikkes with unselected tags (grey and smaller) will be removed from view in the Roster section.
                        </li>
                        <li>
                            Note: If all tags of a category are selected, clicking on a tag will focus on that tag.
                            (i.e. That tag will remain selected and all others will be deselected.)
                            This is intended to echo Nikke's own filtering behavior.
                        </li>
                        <li>
                            <h4>The categories available for filtering are</h4>
                            <ul>
                                <li>Name</li>
                                <li>Rarity&nbsp;&nbsp;&nbsp;&nbsp;(by default, R and SR are deselected)</li>
                                <li>Burst&nbsp;&nbsp;&nbsp;&nbsp;(Re-enter and Red Hood's are distinct here)</li>
                                <li>Burst Cooldown</li>
                                <li>Class</li>
                                <li>Code/Element</li>
                                <li>Company/Manufacturer</li>
                                <li>Weapon</li>
                                <li>
                                    Favorite Item state&nbsp;&nbsp;&nbsp;&nbsp;(Whether to
                                    show only the base Nikke, apply their Favorite Items, or show both versions.)
                                </li>
                                <li>Skill Triggers</li>
                                <li>Scaling Stats and Scaling Effects</li>
                                <li>Skill Effects and Skill Targets</li>
                                <li className='tertiary-li'>Note: For more information, see the Nikke section above.</li>
                            </ul>
                        </li>
                        <li>Selecting a Preset will update the 'Triggers', 'Skill Effects', and/or 'Skill Targets'.</li>
                        <ul><li>This should help find units for specific purposes like healing or code-support.</li></ul>
                        <li>
                            <SettingsBackupRestoreIcon fontSize='inherit' className='menu-icon-text' />
                            &nbsp;The filter tags can be reset.
                        </li>
                        <li>
                            Toggling the <ArrowDropDownIcon fontSize='inherit' className='menu-icon-text' /> Dropdown button
                            will minimize the Filter.
                        </li>
                        <li>
                            Toggling the <Visibility fontSize='inherit' className='menu-icon-text' /> Visibility buttons
                            next to certain categories will toggle the visibility of their respective icons.
                        </li>
                    </ul>
                </Collapse>
                <DropdownButton
                    className={open.settings ?
                        'dropdown-btn dropdown-btn-open'
                        : 'dropdown-btn dropdown-btn-closed'
                    }
                    onClick={() => handleClick('settings')}
                >
                    {open.settings ? <ArrowDropDownIcon fontSize='large' /> : <ArrowDropUpIcon fontSize='large' />}
                    <Settings fontSize='inherit' className='menu-icon-text' />
                    <span> Settings </span>
                </DropdownButton>
                <Collapse in={open.settings}>
                    <ul className='dropdown-body'>
                        <li>
                            <b>Code Weakness</b> can be selected.
                            <ul>
                                <li>Code-effective Nikkes will be highlighted.</li>
                                <li>When selected, Squad Review will check if your squad has at least one unit with the selected code.</li>
                                <li>Important for getting that 10% bonus damage or when Raid bosses have code immunity.</li>
                                <li>Also configurable in the main page, below the page title.</li>
                            </ul>
                        </li>
                        <li><b>Reviews</b> can be fully disabled.</li>
                        <li>
                            <b>Duplicate Nikkes</b> can be enabled.&nbsp;&nbsp;&nbsp;&nbsp;(Note: Re-disabling
                            duplicates doesn't delete existing duplicates in Squads and Bench.)
                        </li>
                        <li>If the app gets too laggy, you can limit the <b>Max Nikkes rendered in the Roster</b> (Default is 'ALL').</li>
                        <ul>
                            <li>If set, Nikkes beyond the cap (and including) will be hidden.</li>
                            <li>
                                You can temporarily bypass the limit by selecting <b className='menu-icon-text'>peek</b>.
                                Updating the filter will enforce the limit again.
                            </li>
                            <li>
                                Selecting <b className='menu-icon-text'>unlock</b> will reset this setting to 'ALL'.
                            </li>
                        </ul>
                        <li>
                            The width of the Squad grid can be configured by updating <b>Squads per Row</b>.
                            This is automatically set and updated according to window size.
                        </li>
                        <li>
                            Enabling <b>'Compact Mode'</b> moves the Filter and Roster into a menu that can be opened via a side button.
                            This reduces scrolling between the Squads, Bench, and the Roster.
                            The menu's position can be selected between the left and right.
                        </li>
                        <li>
                            By default this is hidden for website clarity, but you can show a <b>background for Nikke portraits</b>
                            to display a background gradient depending on the character's color.
                        </li>
                        <li>The Filter section can be hidden&nbsp;&nbsp;&nbsp;&nbsp;(But will still be active, however)</li>
                        <li>
                            For a nice screenshot or to reduce noise, you can also hide
                            the <Remove fontSize='inherit' className='menu-icon-text' /> Quick Move
                            and <Info fontSize='inherit' className='menu-icon-text' /> Info buttons from Nikkes inside Squads.
                        </li>
                        <li>
                            Your Squad can be converted into a <b>saveable/shareable URL</b> <Link fontSize='inherit' className='menu-icon-text' />.
                            <ul>
                                <li>
                                    This URL is a way to <b>save your teams</b> or <b>share them</b> with others
                                    without us having to store cookies on your device or upload your data online.
                                </li>
                                <li>
                                    The <ContentPaste fontSize='inherit' className='menu-icon-text' /> Copy buttons will copy the saveable/shareable URL to your system's clipboard.

                                </li>
                                <li>
                                    If you want to include the Bench, use the 'Squads + Bench' button.
                                    Otherwise, you can use the link in your browser or the 'Squads Only' button.
                                </li>

                                <li>
                                    If a dynamic URL is used to launch the page, your Squads (and Bench) will be pre-built with the corresponding Nikkes.
                                </li>
                                <li>Up to 10 Squads are supported, anything beyond or empty will be truncated.</li>
                                <li>Squad sizes up to 10 Nikkes are supported, anything beyond will be truncated.</li>
                                <li>Bench sizes up to 50 are are supported, anything beyond will be truncated.</li>
                            </ul>
                        </li>
                    </ul>
                </Collapse>
                <hr />

                {/* Upcoming Features */}
                <h2>Upcoming Features</h2>
                <ul>
                    <li>
                        Add hightlight system. An alternate filter that highlights tagged Nikkes like similar to Code Weakness.
                    </li>
                    <li>
                        Extend filter/highlight system to Bench and Squads.
                    </li>
                </ul>
                <hr />

                {/* Credits */}
                <h2>Credits</h2>
                <ul>
                    <li>
                        <i>Nikke: Goddess of Victory</i> and their assets are owned by Shift Up, Level Infinite, and Tencent.
                    </li>
                    <li>
                        Collab characters are owned the respective IP owners of&nbsp;
                        <i>Chainsaw Man</i>,&nbsp;
                        <i>NieR: Automata</i>,&nbsp;
                        <i>Re: Zero − Starting Life in Another World</i>, and&nbsp;
                        <i>Neon Genesis Evangelion</i>.
                    </li>
                    <li>The Nikke Unit Avatars are screenshots edited by me. Nikke's hexagonal icons were recreated by me.</li>
                    <li>Special thanks to my friend for bug testing and motivating me to make this website more mobile-friendly.</li>
                    <li>And thanks to you for using my team builder!</li>
                </ul>
            </DialogContent >
        </Dialog >
    );
}

export default NikkeHelp;