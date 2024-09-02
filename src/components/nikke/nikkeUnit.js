import React, { Suspense } from 'react';
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

    const getUnitClassName = () => {
        let className = 'nikke-unit';

        if (props.windowSmall)
            className += ' nikke-unit-small';

        if (!props.visibility.categoryIcons)
            className += ' nikke-unit-hidden-icons';

        return className;
    }

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

    const getImageSrc = () => {
        let check = props.unit.Name.split(':');
        // console.log('../../assets/images/Nikke/avatars/' + props.unit.Name + '.png');


        if (check.length === 1)
            return '../../assets/images/Nikke/avatars/' + props.unit.Name + '.png';

        else if (check.length === 2) {
            return '../../assets/images/Nikke/avatars/' + check[0] + check[1] + '.png';
        }
    }

    const getAddRemoveButton = () => {
        if (props.sectionId === 'roster')
            return <Tooltip title='Add to bench' placement='top'>
                <Add fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;
        else if (props.sectionId === 'bench')
            return <Tooltip title='Remove from bench' placement='top'>
                <Remove fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
                }} />
            </Tooltip>;
        else
            return <Tooltip title='Remove from Squad' placement='top'>
                <Remove fontSize='small' sx={{
                    width: '1em',
                    height: '1em'
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
                    className={getUnitClassName()}
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
                                width: '1.2em',
                                height: '1.2em',
                                position: 'absolute',
                                top: '0.3em',
                                left: '0.rem',
                                backgroundColor: '#fff'
                            }}

                        >
                            {
                                getAddRemoveButton()
                            }
                        </IconButton>
                        {/* <Suspense fallback={<div />}> */}
                        <img className='nikke-image' src={props.avatar} alt='Nikke' />
                        {/* </Suspense> */}
                        {
                            props.visibility['Burst'] ?

                                <img className='nikke-icon nikke-burst' src={props.icons[0]} alt={'Burst ' + props.unit.Burst} />
                                : null
                        }
                    </div>

                    <div className='nikke-name-container'>
                        <span className={'nikke-name' + getNameClassName()}>{getName()}</span>
                    </div>

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