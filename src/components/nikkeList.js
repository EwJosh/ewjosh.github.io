import React, { useLayoutEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import NikkeUnit from '../components/nikkeUnit.js'

function NikkeList(props) {
    // useLayoutEffect(() => {
    //     props.visible.categories.forEach(category => {
    //         if (!props.visible[category])
    //             props.nikkes.forEach(nikke => nikke[category] = null)
    //     })
    // }, [props.visible])

    const onMoveNikke = (nikkeId, srcIndex) => {
        let dstSectionId = (
            props.section.id === 'bench' ?
                'roster'
                : 'bench'
        );
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