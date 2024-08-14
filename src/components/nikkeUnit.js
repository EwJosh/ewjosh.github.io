import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button, IconButton } from '@mui/material';
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

    const onMoveNikke = () => {
        props.onMoveNikke(props.unit.Name, props.index)
    }

    return (
        <div className='nikke-unit-container'>

            <Draggable
                // Draggable *has* to use initial name, otherwise element gets eaten when dragged
                draggableId={props.unit.Name}
                key={props.unit.Name}
                index={props.index}
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
                                onClick={onMoveNikke}
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
                                    props.sectionId !== 'bench' ?
                                        <Add fontSize='small' sx={{
                                            // padding: '0 0 0.25px 0.5px',
                                            width: '1rem',
                                            height: '1rem'
                                        }} />
                                        : <Remove fontSize='small' sx={{
                                            // padding: '0 0 0.25px 0.5px',
                                            width: '1rem',
                                            height: '1rem'
                                        }} />
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
                            {/* <img className='nikke-icon nikke-class' src={props.icons[1]} alt={'Class ' + props.unit.Class} />
                        <img className='nikke-icon nikke-code' src={props.icons[2]} alt={'Code ' + props.unit.Code} />
                        <img className='nikke-icon nikke-manf' src={props.icons[3]} alt={'Manufacturer ' + props.unit.Manufacturer} />
                        <img className='nikke-icon nikke-wep' src={props.icons[4]} alt={'Weapon ' + props.unit.Weapon} /> */}
                        </div>
                    </div>
                )}
            </Draggable>
        </div>
    );
}

export default NikkeUnit;