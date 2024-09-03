import React from 'react';
import { Droppable } from '@hello-pangea/dnd';

// Import MUI components
import NikkeUnit from './nikkeUnit.js'

// Import MUI icons
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

function NikkeList(props) {
    /**
     * Maps through an array of Nikke objects and converts them into an array of React components for rendering into Nikke cards.
     * props.nikkes is used by default. If allowDuplicates is active, Roster will map through the initial NikkeData.
     * @param {object} provided Prop object used by Droppable and Draggable components (@hello-pangea/dnd).
     * @returns An array of NikkeUnit React components.
     */
    const renderDroppable = (provided) => {
        // By default (for both Bench and Roster, we'll map through their Nikkes).
        let list = props.nikkes;

        // If allowDuplicates is active, Roster will map through the initial NikkeData.
        if (props.section.id === 'roster' && props.allowDuplicates)
            list = props.nikkeData

        return list.map((item, index) => {
            return (
                <NikkeUnit
                    key={'unit-' + item.Name}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    unit={item}
                    sectionId={props.section.id}
                    index={index}
                    windowSmall={props.windowSmall}
                    icons={[
                        props.icons.Burst[item.Burst],
                        props.icons.Class[item.Class],
                        props.icons.Code[item.Code],
                        props.icons.Manufacturer[item.Manufacturer],
                        props.icons.Weapon[item.Weapon]
                    ]}
                    avatar={props.avatars[item.Name]}
                    visibility={props.visibility}
                    onMoveNikke={onMoveNikke}
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

    return (
        <div id={props.section.id} className='nikke-list-container'>
            {/* Header */}
            <div className='nikke-list-header'>
                {
                    props.section.id === 'roster' ?
                        <PersonSearchIcon className='section-badge' />
                        : <ChairAltIcon className='section-badge' />
                }
                <h1>{props.section.title}</h1>
            </div>
            {/* Body */}
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
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default NikkeList;