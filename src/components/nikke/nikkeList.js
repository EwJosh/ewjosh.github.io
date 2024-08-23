import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import NikkeUnit from './nikkeUnit.js'

function NikkeList(props) {

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
        <div className='nikke-list-container'>
            <h1>{props.section.title}</h1>
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
                        // style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                        {...provided.droppableProps}
                    >
                        {
                            props.nikkes &&
                            props.nikkes.map((item, index) => {
                                return (
                                    <NikkeUnit
                                        key={'unit-' + item.Name}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        unit={item}
                                        sectionId={props.section.id}
                                        index={index}
                                        icons={[
                                            props.icons.Burst[item.Burst],
                                            props.icons.Class[item.Class],
                                            props.icons.Code[item.Code],
                                            props.icons.Manufacturer[item.Manufacturer],
                                            props.icons.Weapon[item.Weapon]
                                        ]}
                                        visible={props.visible}
                                        onMoveNikke={onMoveNikke}
                                    />)
                            }
                            )

                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default NikkeList;