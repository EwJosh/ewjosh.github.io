import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

// Import MUI components
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Import MUI icons
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

function NikkeUnit(props) {
    /**
     * Abbreviates the instance's name, if necessary.
     * 
     * Names without a colon (:) will be return as normal.
     * Otherwise, words post-colon will be converted into initials and returned.
     * (e.g. 'Anis: Sparkling Summer' => 'Anis: SS', 'Snow White' => 'Snow White')
     * @returns an abbreviated version of the name, or the original Name if not necessary.
     */
    const getName = () => {
        let check = props.unit.Name.split(':');

        if (check.length === 1)
            return props.unit.Name;

        else if (check.length === 2) {
            var altName = check[1].substring(1).split(' ');
            let temp = ': ';
            altName.forEach(element => {
                temp += element.substring(0, 1)
            });
            return check[0] + temp;
        }
    }
    // Sets name so that we don't have to call getName a bunch.
    const name = getName();

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

        return className;
    }

    /**
     * Returns the className this Unit's name span should have depending on the circumstances.
     * Depending on the amount of characters in their name, they may additionally get ' nikke-name-long' or ' 'nikke-name-xlong'.
     * @returns React prop className that fits the name span.
     */
    const getNameClassName = () => {
        if (name === null)
            return '=ERR='
        if (name.length >= 12)
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
            return <Tooltip title='Move to Bench' placement='top'>
                <Add fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;

        // If in Bench: Say 'Move to Roster' and use a (-) icon.
        else if (props.sectionId === 'bench')
            return <Tooltip title='Move to Roster' placement='top'>
                <Remove fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;

        // If in Squad: Say 'Move to Bench' and use a (-) icon.
        else
            return <Tooltip title='Move to Bench' placement='top'>
                <Remove fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;
    }

    return (
        <Draggable
            className='nikke-unit-container'
            // Draggable *has* to use initial unit name as ID, otherwise element gets eaten when dragged
            draggableId={props.unit.Name}
            key={props.unit.Name}
            index={props.index}
            isDragDisabled={props.sectionId === 'roster'}
        >
            {(provided) => (
                <div
                    className={getUnitClassName()}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {/* Image Container */}
                    <div className='nikke-image-container'>
                        {
                            (props.sectionId === 'bench' || props.sectionId === 'roster' || props.visibility.quickMove) ?
                                <IconButton
                                    onClick={() => props.onMoveNikke(props.unit.Name, props.index)}
                                    variant='outlined'
                                    size='small'
                                    color={props.sectionId !== 'bench' ? 'success' : 'error'}
                                    sx={{
                                        border: 'solid 1px',
                                        width: '1.2em',
                                        height: '1.2em',
                                        position: 'absolute',
                                        top: '0.3em',
                                        left: '0.rem',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    {getAddRemoveButton()}
                                </IconButton>
                                : null
                        }

                        <img className='nikke-image' src={props.avatar} alt='Nikke' />

                        {
                            props.visibility['Burst'] ?

                                <img className='nikke-icon nikke-burst' src={props.icons[0]} alt={'Burst ' + props.unit.Burst} />
                                : null
                        }
                    </div>

                    {/* Name Container */}
                    <div className='nikke-name-container'>
                        <span className={'nikke-name' + getNameClassName()}>{getName()}</span>
                    </div>

                    {/* Tag Container */}
                    {
                        props.visibility.categoryIcons ?
                            < div className='nikke-icon-container'>
                                {
                                    props.visibility.categories.map((category, index) => {
                                        if (category !== 'Burst' && props.visibility[category])
                                            return <img
                                                key={category}
                                                className={'nikke-icon nikke-' + category.toLowerCase()}
                                                src={props.icons[index]}
                                                alt={category + props.unit[category]}
                                            />;
                                        else
                                            return null;
                                    })
                                }
                            </div>
                            : null
                    }
                </div>
            )
            }
        </Draggable >
    );
}

export default NikkeUnit;