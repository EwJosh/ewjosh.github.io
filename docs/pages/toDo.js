import React, { useEffect, useState } from 'react';
import Column from '../components/column.js';
import { DragDropContext } from '@hello-pangea/dnd';

/**
 * Temporary component used for learning Drag-n-Drop. Will be converted into a to-do list.
 */
function ToDo() {
    const initData = {
        tasks: {
            'task-1': { id: 'task-1', content: 'Take out the garbage' },
            'task-2': { id: 'task-2', content: 'Watch my favorite show' },
            'task-3': { id: 'task-3', content: 'Charge my phone' },
            'task-4': { id: 'task-4', content: 'Cook dinner' },
        },
        columns: {
            'column-1': {
                id: 'column-1',
                title: 'To do',
                taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
            },
        },
        // Facilitate reordering of the columns
        columnOrder: ['column-1'],
    };

    const [data, setData] = useState(initData);

    const onDragEnd = (result) => {
        // Dragging will produce a result
        // Grab these variables from the result object
        let { source, destination, draggableId } = result;

        // Check if destination exists and that a change has been made, if not then return
        if (!destination)
            return;
        else if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        )
            return;

        // Get column from data corresponding to the resulting source column
        let column = data.columns[source.droppableId];
        // Create an array of object IDs
        let newTaskIds = Array.from(column.taskIds);

        // Remove the dragged object from list
        newTaskIds.splice(source.index, 1);
        // Insert the dragged object into the destination
        newTaskIds.splice(destination.index, 0, draggableId);

        // Create new column using old column's data, but replacing new task IDs
        let newColumn = {
            ...column,
            taskIds: newTaskIds
        }

        // Set data to use new information
        let newData = {
            ...data,
            columns: {
                ...data.columns,
                [newColumn.id]: newColumn
            }
        }

        setData(newData);
    }
    console.log(data.tasks)

    /**
     * DragDropContext is the container for the Droppable container and Draggable objects
     * Requires onDragEnd function
    */
    return (
        <div className='page'>
            <DragDropContext
                onDragEnd={onDragEnd}
            >
                <h1>Test</h1>
                {
                    data.columnOrder.map(columnId => {
                        const column = data.columns[columnId];
                        console.log(data.tasks)
                        const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

                        return <Column key={column.id} column={column} tasks={tasks} />;
                    })
                }
            </DragDropContext>
        </div>
    );
}

export default ToDo;