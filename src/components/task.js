import React from 'react';
import styled from '@emotion/styled';
import { Draggable } from '@hello-pangea/dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`;

/**
 * Temporary component used for learning Drag-n-Drop. Will be converted into a to-do list.
 */
export default class Task extends React.Component {
    render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                index={this.props.index}
            >
                {provided => (
                    <Container
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        {this.props.task.content}
                    </Container>
                )}
            </Draggable>
        );
    }
}
