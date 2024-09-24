import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MinimizeButton } from '../../pages/nikkeTeamBuilder.js';

// Import MUI components
import NikkeUnit from './nikkeUnit.js'

// Import MUI icons
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function NikkeList(props) {
    /**
     * Maps through an array of Nikke objects and converts them into an array of React components for rendering into Nikke cards.
     * @param {object} provided Prop object used by Droppable and Draggable components (@hello-pangea/dnd).
     * @returns An array of NikkeUnit React components.
     */
    const renderDroppable = (provided) => {
        return props.nikkes.map((item, index) => {
            return (
                <NikkeUnit
                    key={'unit-' + item.id + '-' + index}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    unit={item}
                    sectionId={props.section.id}
                    index={index}
                    windowSmall={props.windowSmall}
                    burstIcons={[
                        props.icons.Burst[item.Burst],
                        props.icons['Burst Cooldown'][item['Burst Cooldown']]
                    ]}
                    tagIcons={[
                        props.icons.Code[item.Code],
                        props.icons.Weapon[item.Weapon],
                        props.icons.Class[item.Class],
                        props.icons.Company[item.Company]
                    ]}
                    highlightIcon={props.icons.Highlight}
                    avatar={props.avatars[item.Name]}
                    visibility={props.visibility}
                    onMoveNikke={onMoveNikke}
                    hasTargetCode={item.Code === props.targetCode}
                />
            )
        });
    }


    /**
     * When a Nikke Unit calls for a move, the list needs to input its own information before sending it up to the Team Builder.
     * @param {string} nikkeId ID of the moving Nikke.
     * @param {number} srcIndex Index of the Nikke's ID in the list.
     */
    const onMoveNikke = (nikkeId, srcIndex) => {
        // If we're in the bench, send to roster. Otherwise, send to bench.
        let dstSectionId = (
            props.section.id === 'bench' ?
                'roster'
                : 'bench'
        );
        // Send info up to Team Builder.
        props.onMoveNikke(nikkeId, props.section.id, dstSectionId, srcIndex, -1);
    }

    /**
     * Gets the component's minimized status in the visibility object depending on the  Section's ID.
     * @returns true if the component is minimized.
     */
    const isMin = () => {
        if (props.section.id === 'bench')
            return props.visibility.benchMin;
        else if (props.section.id === 'roster')
            return props.visibility.rosterMin;
        else
            return false;
    }

    return (
        <div
            id={props.section.id}
            className='nikke-list-container'
        >
            {/* Header */}
            <div className='nikke-list-header'>
                {
                    props.section.id === 'roster' ?
                        <PersonSearchIcon className='section-badge' />
                        : <ChairAltIcon className='section-badge' />
                }
                <h2> {props.section.title}</h2>
                {
                    (props.section.id === 'roster' && props.compactMode !== 0) ?
                        null :
                        <MinimizeButton
                            onClick={props.toggleListMin}
                            variant='contained'
                            disableTouchRipple
                            disableElevation
                            color={
                                isMin() ?
                                    'success' : 'pumpkin'
                            }
                            sx={{
                                height: props.windowSmall ? '1.5rem' : '100%',
                                borderRadius: isMin() ? '0 0.25rem 0.25rem 0' : '0 0.25rem 0 0',
                            }}
                        >
                            {
                                props.visibility.filterMin ?
                                    <ArrowDropUpIcon />
                                    : <ArrowDropDownIcon />
                            }
                        </MinimizeButton>
                }
            </div >
            {/* Body */}
            {
                isMin() ?
                    null :
                    <Droppable
                        droppableId={props.section.id}
                        key={props.section.id}
                        direction='horizontal'
                    >
                        {(provided, snapshot) => (
                            <div
                                className='nikke-list'
                                key={props.section.id}
                                ref={provided.innerRef}
                                style={{
                                    backgroundColor: snapshot.isDraggingOver ? '#1976d280' : '#b59872'
                                }}
                                {...provided.droppableProps}
                            >
                                {renderDroppable(provided)}
                                {
                                    props.section.id === 'roster' && props.rosterOverflow ?
                                        <div
                                            id='roster-overflow-card'
                                            className='nikke-unit'
                                            onClick={props.overrideMaxRoster}
                                        >
                                            <span className='nikke-name'>...</span>
                                        </div>
                                        : null
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
            }
        </div >
    );
}

export default NikkeList;