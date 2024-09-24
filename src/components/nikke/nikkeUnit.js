import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

// Import MUI components
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener';

// Import MUI icons
import Add from '@mui/icons-material/AddOutlined';
import Remove from '@mui/icons-material/Remove';
import Info from '@mui/icons-material/InfoTwoTone';

function NikkeUnit(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    /**
         * Returns the className this Unit should have depending on the circumstances.
         * All units have 'nikke-unit'.
         * If windowSmall is active, append ' nikke-unit-small' to enable shrunken styling choices.
         * If bottom tag icons are hidden, append ' nikke-unit-hidden-icons' to skip the icons' div.
         * @returns React prop className that fits the Unit.
         */
    const getUnitClassName = () => {
        // Always have nikke-unit as a base.
        let className = 'nikke-unit';

        // If windowSmall is active, append ' nikke-unit-small' to enable shrunken styling choices.
        if (props.windowSmall)
            className += ' nikke-unit-small';

        // If bottom tag icons are hidden, append ' nikke-unit-hidden-icons' to skip the icons' div.
        if (!props.visibility.categoryIcons)
            className += ' nikke-unit-hidden-icons';

        if (props.hasTargetCode)
            className += ' highlight';

        return className;
    }

    /**
     * Returns the className this Unit's name span should have depending on the amount of characters in their name.
     * (e.g. 'nikke-name-long', 'nikke-name-xlong', 'nikke-name-xxlong')
     * @returns React prop className that fits the name span.
     */
    const getNameClassName = () => {
        let name = props.unit.Title;
        if (name == null)
            name = props.unit.Name;

        if (name.length >= 12)
            return ' nikke-name-xxlong';
        else if (name.length >= 11)
            return ' nikke-name-xlong';
        else if (name.length >= 8)
            return ' nikke-name-long';
        else
            return '';
    }

    /**
     * Creates a React component used for the quick-movment of a Nikke.
     * Comes with a Tooltip (describes action) and a (+) or (-) icon.
     * Results are dependent on the Unit's current section.
     * @returns Returns a React component for quick-moving a Nikke.
     */
    const getAddRemoveButton = () => {
        // If in Roster: Say 'Move to Bench' and use a (+) icon.
        if (props.sectionId === 'roster')
            return <Tooltip title='Move to Bench' placement='top' arrow>
                <Add fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;

        // If in Bench: Say 'Move to Roster' and use a (-) icon.
        else if (props.sectionId === 'bench')
            return <Tooltip title='Move to Roster' placement='top' arrow>
                <Remove fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;

        // If in Squad: Say 'Move to Bench' and use a (-) icon.
        else
            return <Tooltip title='Move to Bench' placement='top' arrow>
                <Remove fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;
    }



    return (
        <Draggable
            className='nikke-unit-container'
            // NOTE: Draggable *has* to use initial unit name as ID, otherwise element gets eaten when dragged
            draggableId={props.unit.Id + '-' + props.sectionId + '-' + props.index}
            key={props.unit.Id}
            index={props.index}
            isDragDisabled={props.sectionId === 'roster'}
        >
            {(provided) => (
                // NOTE: Do NOT add a MUI style prop to a Draggable child. Gets laggy/kinda broken.
                <div
                    className={getUnitClassName()}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {/* Image Container */}
                    <div className='nikke-image-container'>
                        {/* Quick Move Button */}
                        {
                            (props.sectionId === 'bench' || props.sectionId === 'roster' || props.visibility.squadClean) ?
                                <IconButton
                                    onClick={() => props.onMoveNikke(props.unit.Id, props.index)}
                                    variant='outlined'
                                    size='small'
                                    color={props.sectionId !== 'bench' ? 'success' : 'error'}
                                    sx={{
                                        border: 'solid 2px',
                                        width: '1em',
                                        height: '1em',
                                        position: 'absolute',
                                        top: '0.3em',
                                        left: '0rem',
                                        backgroundColor: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#fff',
                                            filter: 'brightness(80%)'
                                        }
                                    }}
                                >
                                    {getAddRemoveButton()}
                                </IconButton>
                                : null
                        }
                        {/* Info Button */}
                        {
                            (props.sectionId === 'bench' || props.sectionId === 'roster' || props.visibility.squadClean) ?
                                <IconButton
                                    onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
                                    size='small'
                                    color='info'
                                    sx={{
                                        width: '1em',
                                        height: '1em',
                                        position: 'absolute',
                                        top: '0.3em',
                                        right: '0rem',
                                        backgroundColor: '#000000a0',
                                        '&:hover': {
                                            backgroundColor: '#000000a0',
                                            filter: 'brightness(120%)'
                                        }
                                    }}
                                >
                                    <Tooltip title='More Details' placement='top' arrow>
                                        <Info fontSize='small' sx={{
                                            width: '1.1em',
                                            height: '1.1em'
                                        }} />
                                    </Tooltip>
                                </IconButton>
                                : null
                        }

                        {/* Avatar Image */}
                        <img
                            className='nikke-image'
                            src={props.avatar}
                            alt={props.unit.Name}
                        />

                        {/* Burst Icon */}
                        {
                            props.visibility['Burst'] ?
                                <div
                                    className='nikke-icon nikke-burst flex-row'
                                >
                                    <img className='nikke-icon-base' src={props.burstIcons[0]} alt={'Burst ' + props.unit.Burst} />
                                    {
                                        props.visibility['Burst Cooldown'] ? <img
                                            className='icon-underlay'
                                            src={props.burstIcons[1]}
                                            alt={'BCD' + props.unit['Burst Cooldown']}
                                        />
                                            : null
                                    }
                                </div>
                                : null
                        }
                    </div>

                    {/* Name Container */}
                    <div className='nikke-name-container'>
                        <span className={'nikke-name' + getNameClassName()}>{props.unit.Title || props.unit.Name}</span>
                    </div>

                    {/* Tag Container */}
                    {
                        props.visibility.categoryIcons ?
                            < div className='nikke-icon-container'>
                                {
                                    props.visibility.categories.map((category, index) => {
                                        if (category === 'Code' && props.visibility['Code'] && props.hasTargetCode)
                                            return <div
                                                key={category}
                                                className='nikke-icon flex-row'
                                            >
                                                <img
                                                    key={category}
                                                    className='icon-overlay'
                                                    src={props.highlightIcon}
                                                    alt={'highlight'}
                                                />
                                                <img
                                                    className='nikke-icon-base'
                                                    src={props.tagIcons[index]}
                                                    alt={category + props.unit[category]}
                                                />
                                            </div>;
                                        else if (category !== 'Burst' && props.visibility[category])
                                            return <img
                                                key={category}
                                                className='nikke-icon'
                                                src={props.tagIcons[index]}
                                                alt={category + props.unit[category]}
                                            />;
                                        else
                                            return null;
                                    })
                                }
                            </div>
                            : null
                    }
                    <Popper
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        placement='right-start'
                        modifiers={[{
                            name: 'flip',
                            options: {
                                fallbackPlacements: ['right-end', 'left-start', 'left-end']
                            },
                        }]}
                        sx={{
                            zIndex: 2
                        }}
                    >
                        <ClickAwayListener
                            onClickAway={() => setAnchorEl(null)}
                        >
                            <div
                                className='nikke-unit-details flex-column'
                                style={{
                                    borderColor: 'black'
                                }}
                            >
                                <h3>{props.unit.Name}</h3>
                                <hr />
                                <span><b>Burst:</b> {props.unit.Burst} ({props.unit['Burst Cooldown']} sec)</span>
                                <span><b>Class:</b> {props.unit.Class}</span>
                                <span><b>Code:</b> {props.unit.Code}</span>
                                <span><b>Company:</b> {props.unit.Company}</span>
                                <span><b>Weapon:</b> {props.unit.Weapon}</span>
                                <span><b>Tags:</b> <i>N/A</i></span>
                            </div>
                        </ClickAwayListener>
                    </Popper>
                </div>
            )
            }
        </Draggable >
    );
}

export default NikkeUnit;