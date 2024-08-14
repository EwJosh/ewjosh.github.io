import React, { Component } from 'react';
import Task from './task';
import { Droppable } from '@hello-pangea/dnd';

/**
 * Temporary component used for learning Drag-n-Drop. Will be converted into a to-do list.
 */
class Column extends Component {
    state = {}
    render() {
        return (
            <div id='test-container'>
                <h2 id='test-cont-title'>{this.props.column.title}</h2>
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (

                        <div id='test-task-list'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.tasks.map((task, index) => (
                                <Task key={task.id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    }
}

export default Column;