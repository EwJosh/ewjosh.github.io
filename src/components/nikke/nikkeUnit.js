import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { IconButton, Tooltip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

function NikkeUnit(props) {

    /**
     * Abbreviates the instance's name, if necessary
     * 
     * Names without a colon (:) will be return as normal.
     * Otherwise, words post-colon will be converted into initials and returned.
     * (e.g. 'Anis: Sparkling Summer' => 'Anis: SS', 'Snow White' => 'Snow White')
     * @returns an abbreviated version of the name, if necessary
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

    const name = getName();

    const getNameClass = () => {
        if (name === null)
            return '=ERR='
        if (name.length >= 12)
            return ' nikke-name-xlong';
        else if (name.length >= 8)
            return ' nikke-name-long';
        else
            return '';
    }

    const getAddRemoveButton = () => {
        if (props.sectionId === 'roster')
            return <Tooltip title='Add to bench' placement='top'>
                <Add fontSize='small' sx={{
                    width: '1rem',
                    height: '1rem'
                }} />
            </Tooltip>;
        else if (props.sectionId === 'bench')
            return <Tooltip title='Remove from bench' placement='top'>
                <Remove fontSize='small' sx={{
                    width: '1rem',
                    height: '1rem'
                }} />
            </Tooltip>;
        else
            return <Tooltip title='Remove from Squad' placement='top'>
                <Remove fontSize='small' sx={{
                    width: '1rem',
                    height: '1rem'
                }} />
            </Tooltip>;
    }

    return (
        <Draggable
            // Draggable *has* to use initial unit name, otherwise element gets eaten when dragged
            className='nikke-unit-container'
            draggableId={props.unit.Name}
            key={props.unit.Name}
            index={props.index}
            isDragDisabled={props.sectionId === 'roster'}
        >
            {(provided) => (
                <div
                    className='nikke-unit'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className='nikke-image-container'>
                        <IconButton
                            onClick={() => props.onMoveNikke(props.unit.Name, props.index)}
                            variant='outlined'
                            size='small'
                            color={props.sectionId !== 'bench' ? 'success' : 'error'}
                            sx={{
                                border: 'solid 1px',
                                width: '1.2rem',
                                height: '1.2rem',
                                position: 'absolute',
                                top: '0.3rem',
                                left: '0.3rem',
                                backgroundColor: '#fff'
                            }}

                        >
                            {
                                getAddRemoveButton()
                            }
                        </IconButton>
                        <img className='nikke-image' src={props.unit.Image} alt='Nikke' />
                        {
                            props.visible['Burst'] ?

                                <img className='nikke-icon nikke-burst' src={props.icons[0]} alt={'Burst ' + props.unit.Burst} />
                                : null
                        }
                    </div>

                    <div className='nikke-name-container'>
                        <span className={'nikke-name' + getNameClass()}>{getName()}</span>
                    </div>

                    <div className='nikke-icon-container'>
                        {
                            props.visible.categories.map((category, index) => {
                                if (category !== 'Burst' && props.visible[category])
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
                </div>
            )}
        </Draggable>
    );
}

export default NikkeUnit;