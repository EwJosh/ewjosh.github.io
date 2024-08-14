import React, { useLayoutEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import NikkeUnit from './nikkeUnit.js';
import Reviews from '../assets/data/NikkeSquadReviews.json';
import { IconButton, Tooltip } from '@mui/material';
import { Add, Edit, Error, Remove, ReportProblemOutlined } from '@mui/icons-material';

function NikkeSquad(props) {
    const [rating, setRating] = useState({});

    useLayoutEffect(() => {
        if (props.nikkes.length === 0)
            return;

        rateSquad();
    }, [props.nikkes])

    /**
     * Examines the squad and checks for validity and recommendations
     * Things to check for...
     * ### [IMPLEMENTED]
     * #### Size
     * Squad should contain 5 units, but no more than 5.
     * #### Burst
     * Ensure squad can full burst (1->2->3). Preferrably possible every 20 seconds.
     * ### [NOT IMPLEMENTED]
     * #### Code(Element)
     * If a code is selected, check if squad has at least one unit with the corresponding code.
     * #### Missing healer/shielder
     * #### Missing BCD reduction
     */
    const rateSquad = () => {
        let newRating = { ...rating };

        newRating = checkSize(newRating);
        newRating = checkBurst(newRating);
        setRating({ ...newRating });
    }

    const checkSize = (newRating) => {
        if (props.nikkes.length < 5) {
            return {
                ...newRating,
                "Size": "error"
            };
        }
        else if (props.nikkes.length > 5)
            return {
                ...newRating,
                "Size": "warning"
            };
        else
            return {
                ...newRating,
                "Size": null
            };
    }

    // Doesn't have the edge case where you have 1(20), 2(20), 3(60), 3(60), 3(60) but that's not currently possible in-game
    const checkBurst = (newRating) => {
        // Stages that are covered by the squad
        let burstStages = [];
        // Burst Stage Interval: The interval (in seconds) between burst activations per stage.
        let maxBSI = { '1': 60, '2': 60, '3': 60 };

        for (let i = 0; i < props.nikkes.length; i++) {
            let burst = props.nikkes[i].Burst;
            let bcd = parseInt(props.nikkes[i]['Burst Cooldown']);

            if (burst === '1M') {
                // Burst 1M affects neither reaching full burst nor BSI
                continue;
            }
            else if (burst === 'V') {
                burstStages = ['1,', '2', '3']
                burstStages.forEach(stage => {
                    computeBSI(maxBSI, stage, bcd)
                })
            }
            else {
                let index = burstStages.indexOf(burst);
                if (index === -1)
                    burstStages.push(burst);

                computeBSI(maxBSI, burst, bcd)
            }
        }

        if (burstStages.length !== 3) {
            return {
                ...newRating,
                "Burst": "error"
            };
        }
        else if (maxBSI['1'] !== 20 || maxBSI['2'] !== 20 || maxBSI['3'] !== 20) {
            return {
                ...newRating,
                "Burst": "warning"
            };
        }
        else {
            return {
                ...newRating,
                "Burst": null
            };
        }
    }

    const computeBSI = (maxBSI, burst, bcd) => {
        if (maxBSI[burst] === 20)
            return;
        else if (maxBSI[burst] === 40
            && (bcd === 20 || bcd === 40))
            maxBSI[burst] = 20;
        else if (bcd < maxBSI[burst])
            maxBSI[burst] = bcd;
    }

    const buildRatingNotes = () => {
        return Reviews.categories.map(category => {
            let ratingCase = rating[category];
            if (ratingCase == null) {
                return null;
            }

            return <Tooltip
                title={Reviews[category][ratingCase]}
                key={category}
            >
                {
                    <div
                        className={'squad-rating-tip rating-' + ratingCase}
                    >
                        {(ratingCase === 'error') ? <Error /> : null}
                        {(ratingCase === 'warning') ? <ReportProblemOutlined /> : null}
                        <span>{category}</span>
                    </div>
                }
            </Tooltip>
        });
    }

    const onMoveNikke = (nikkeId, srcIndex) => {
        let dstSectionId = (
            props.section.id === 'bench' ?
                'roster'
                : 'bench'
        );
        props.onMoveNikke(nikkeId, props.section.id, dstSectionId, srcIndex, -1);
    }

    return (
        <div className='nikke-squad'>
            <div className='nikke-squad-info'>
                <div className='grid-row'>
                    <h1>{props.section.title}</h1>
                    {/* <IconButton
                        size='small'
                        sx={{ backgroundColor: '#1976d2' }}
                    >
                        <Edit fontSize='small' sx={{ width: '1.25rem', height: '1.25rem' }} />
                    </IconButton> */}
                </div>
                {/* <div className='grid-row'>
                    <IconButton
                        size='small'
                        sx={{ backgroundColor: '#2e7d32' }}
                    >
                        <Add fontSize='small' sx={{ width: '1rem', height: '1rem' }} />
                    </IconButton>
                    <IconButton
                        size='small'
                        sx={{ backgroundColor: '#d32f2f' }}
                    >
                        <Remove fontSize='small' sx={{ width: '1rem', height: '1rem' }} />
                    </IconButton>
                </div> */}
                {buildRatingNotes()}
            </div>
            <Droppable
                droppableId={props.section.id}
                key={props.section.id}
                direction='horizontal'
            >
                {(provided, snapshot) => (
                    <div
                        className='nikke-squad-list'
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

export default NikkeSquad;