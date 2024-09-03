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
        'squads': true,
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
            <hr style={{ width: '100%', margin: 0, boxSizing: 'border-box' }} />

            {/* Body */}
            <DialogContent id='help-dialog-body'>
                {/* Basic Instructions */}
                <h2>How to use Nikke Team Builder:</h2>
                <ul>
                    <li>Press the <Add fontSize='inherit' className='menu-icon-text' /> Add button
                        to move a Nikke from Roster (or Squad) to the Bench.</li>
                    <li>Drag and drop Nikkes into the dark box of a Squad.</li>
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
                </ul>

                {/* More detailed specifications */}
                <hr />
                <h2>Available features</h2>
                <span>Click to expand sections.</span>

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
                                Pressing the <Remove fontSize='inherit' className='menu-icon-text' /> Remove button
                                on a Nikke will move them to the Bench.
                            </li>
                        </ul>
                        <li>
                            Squad names can be edited and Squads can be added or removed by <b>toggling
                                the <Edit fontSize='inherit' className='menu-icon-text' /> Edit button</b> in the top.
                        </li>
                        <li>
                            Toggling the <ArrowDropDownIcon fontSize='inherit' className='menu-icon-text' /> Dropdown button
                            will minimize the Squad.
                        </li>
                        <li>
                            Has a 'rating system'. I don't plan on rating things like damage calcs and breakpoints.
                            They're just mainly to check if you have a stable team. Can be disabled via Settings
                        </li>
                        <li>If you hover over the rating (or hold press on mobile), you'll see a tooltip about the rating.</li>
                        <li>
                            Rating system covers...
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
                                Matches Code Weakness (If set in <Settings fontSize='inherit' className='menu-icon-text' /> Settings,
                                does your squad have at least one matching Nikke?)
                            </li>
                        </ul>
                        <li>
                            WIP Rating features...
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
                            Like a favorites while you organize your squads.
                            This should reduce going back and forth between the Roster and your squads
                        </li>
                        <ul>
                            <li>
                                Nikkes can be dragged and dropped among the Bench and Squads.
                            </li>
                            <li>
                                Nikkes can be returned from the Bench to the Roster
                                via the <Remove fontSize='inherit' className='menu-icon-text' /> Remove button.
                            </li>
                        </ul>
                        <li>The <b>Roster</b> is initialized with all the Nikke units (up until <i>the Eva collab</i> so far).</li>
                        <ul>
                            <li>
                                Nikkes can be moved from the Roster to the Bench
                                via the <Add fontSize='inherit' className='menu-icon-text' /> Add button.
                            </li>
                            <li>
                                They can be returned to the Roster from the Bench
                                via the <Remove fontSize='inherit' className='menu-icon-text' /> Remove button.
                            </li>
                            <li>
                                Roster's ability to drag-and-drop is disabled.
                            </li>
                            <li>Filter is applied only on the Roster.</li>
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
                                <li>Burst&nbsp;&nbsp;&nbsp;&nbsp;(1-Recast and Red Hood's are distinct here)</li>
                                <li>Base Burst Cooldown</li>
                                <li>Rarity&nbsp;&nbsp;&nbsp;&nbsp;(by default, R and SR are deselected)</li>
                                <li>Class</li>
                                <li>Code/Element</li>
                                <li>Manufacturer</li>
                                <li>Weapon</li>
                                <li>Name</li>
                            </ul>
                        </li>
                        <li>
                            <SettingsBackupRestoreIcon fontSize='inherit' className='menu-icon-text' />
                            &nbsp;The filter tags can be reset.
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
                        <li>Ratings can be fully disabled.</li>
                        <li>
                            Duplicate Nikkes can be enabled.&nbsp;&nbsp;&nbsp;&nbsp;(Re-disabling
                            duplicates doesn't delete duplicates in Squads and Bench)
                        </li>
                        <li>The filter section can be hidden&nbsp;&nbsp;&nbsp;&nbsp;(But will still be active, however)</li>
                        <li>
                            Code Weakness can be selected. When selected, Squad Rating will check if your squad has at least one unit with the selected code.
                            Important for getting that 10% bonus damage or when Raid bosses have code immunity.
                        </li>
                    </ul>
                </Collapse>
                <hr />

                {/* Upcoming Features */}
                <h2>Upcoming Features</h2>
                <ul>
                    <li>
                        Miscellaneous Tag System.
                        Used for filtering and rating in regards to Nikke attributes
                        such as healing, shielding, pierce, true damage, cleansing, etc.
                    </li>
                    <li>Add button to move to top.</li>
                    <li>Save and share teams.</li>
                </ul>
                <hr />

                {/* Credits */}
                <h2>Credits</h2>
                <ul>
                    <li>
                        <i>Nikke: Goddess of Victory</i> and their assets are owned by Shift Up, Level Infinite, and Tencent.
                    </li>
                    <li>Collab characters are owned by their respective IP owners.</li>
                    <li>The Nikke Unit Avatars are screenshots edited by me. Nikke's hexagonal icons were recreated by me.</li>
                    <li>Special thanks to my friend for motivating me to make this website more mobile-friendly.</li>
                    <li>And thanks to you for using my team builder</li>
                </ul>
            </DialogContent >
        </Dialog >
    );
}

export default NikkeHelp;