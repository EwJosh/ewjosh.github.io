import React, { useLayoutEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import NikkeUnit from './nikkeUnit.js';
import Reviews from '../../assets/data/NikkeSquadReviews.json';
import { Button, InputBase, Tooltip } from '@mui/material';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { Error, ReportProblemOutlined } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function NikkeSquad(props) {
    const [rating, setRating] = useState({});

    useLayoutEffect(() => {
        if (props.nikkes.length === 0) {
            setRating({})
            return;
        }

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
     * #### Code(Element)
     * If a code is selected, check if squad has at least one unit with the corresponding code.
     * ### [NOT IMPLEMENTED]
     * #### Missing healer/shielder
     * #### Missing BCD reduction
     */
    const rateSquad = () => {
        let newRating = { ...rating };

        // Pull a return from each check instead of rewriting rating inside each check.
        // Doing the latter results in concurrency errors.
        newRating = checkSize(newRating);
        newRating = checkBurst(newRating);
        newRating = checkCode(newRating);
        setRating({ ...newRating });
    }

    const checkSize = (newRating) => {
        if (props.nikkes.length < 5) {
            return {
                ...newRating,
                'Size': 'error'
            };
        }
        else if (props.nikkes.length > 5)
            return {
                ...newRating,
                'Size': 'warning'
            };
        else
            return {
                ...newRating,
                'Size': null
            };
    }

    /**
     * Rates the Burst potential of the squad. Checks whether the squad can full burst (error, if not) and can do so every 20 seconds (warning, if not.)
     * Covers the simple cases of Bursts 1, 2, and 3 and cooldowns of 20sec, 40sec, 60sec.
     * Covers the edge cases of Burst 1 Recast (e.g. Rupee: Winter and Tia) and Red Hood's Burst V.
     * Soon to cover the edge case of Noir and Blanc. 
     * @param {Dictionary} newRating Dictionary containing rating tags for the judged categories.
     * @returns the updated newRating to be reused or set.
     */
    const checkBurst = (newRating) => {
        // Stages that are covered by the squad
        let burstStages = [];
        // Burst Stage Interval: The interval (in seconds) between burst activations per stage.
        // Ideally, the minimum is 20. Default to 60 since it doesn't matter if it's infinite or 60 seconds for this check.
        let minBSI = { '1': 60, '2': 60, '3': 60 };

        // For the edge case of Noir and Blanc: If they're both in the same squad, Blanc's 60sec B2 becomes a 20sec B2.
        let squad777 = false;

        // Loop through each Nikke
        for (let i = 0; i < props.nikkes.length; i++) {
            let burst = props.nikkes[i].Burst;
            let bcd = parseInt(props.nikkes[i]['Burst Cooldown']);

            // Search for Noir and Blanc
            if (props.nikkes[i].Name === 'Noir' || props.nikkes[i].Name === 'Blanc') {
                if (squad777)
                    bcd = 20;
                squad777 = true;
            }

            // Burst 1M affects neither reaching full burst nor BSI, so can skip
            if (burst === '1M') {
                continue;
            }
            // Burst V is technically always possible (only applicable to Red Hood so far)
            else if (burst === 'V') {
                burstStages = ['1,', '2', '3']

                // Individually update BSI per stage
                burstStages.forEach(stage => {
                    computeBSI(minBSI, stage, bcd)
                })
            }
            // Standard Burst Skills
            else {
                // Add stage to array, if not already there.
                let index = burstStages.indexOf(burst);
                if (index === -1)
                    burstStages.push(burst);

                // Update BSI
                computeBSI(minBSI, burst, bcd)
            }
        }

        // If Full Burst is impossible, error
        if (burstStages.length !== 3) {
            return {
                ...newRating,
                'Burst': 'error'
            };
        }
        // If Full Burst rotation is possible but poor, warn
        else if (minBSI['1'] !== 20 || minBSI['2'] !== 20 || minBSI['3'] !== 20) {
            return {
                ...newRating,
                'Burst': 'warning'
            };
        }
        // Otherwise if Full Burst rotation is possible and stable, pass
        else {
            return {
                ...newRating,
                'Burst': null
            };
        }
    }

    /**
     * Used to determine the minimum interval between how often a given burst stage can be activated.
     * Compares a dictionary of minimum values to new values to determine the true minimum.
     * (Doesn't have the edge case where you have A(20), B(20), C(60), C(60), C(60) but that's not currently possible in-game
     * until we either get a 20sec B3 or three 60sec B3.)
     * @param {Dictionary} minBSI A Dictionary of each burst stage (1, 2, 3). Key is stage number and value is minimum burst interval
     * @param {number} burst Burst stage number (1, 2, 3) 
     * @param {*} bcd Base burst cooldown duration in seconds (20, 40, 60)
     */
    const computeBSI = (minBSI, burst, bcd) => {
        // If min BSI for the stage is already 20 (aka the lowest base bsi), skip
        if (minBSI[burst] === 20)
            return;
        // If we already have a 40sec, and see an incoming  40sec, the new min BSI is 20 sec since they can cover each other's cooldowns
        else if (minBSI[burst] === 40 && bcd === 40)
            minBSI[burst] = 20;
        // If the incoming bcd is lower than the current minBSI, set to that
        else if (bcd < minBSI[burst])
            minBSI[burst] = bcd;
    }


    const checkCode = (newRating) => {
        // If no code is set, set Code to null and skip this check
        if (props.targetCode === 'None')
            return {
                ...newRating,
                Code: null
            };

        // Loop through each Nikke
        for (let i = 0; i < props.nikkes.length; i++) {
            // Compare Nikke code to target code
            if (props.nikkes[i].Code === props.targetCode)
                // If found, nullify rating for Code
                return {
                    ...newRating,
                    Code: null
                }

        }

        // If never found, rate Code as error
        return {
            ...newRating,
            Code: 'error'
        };
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
                        style={{ fontSize: props.windowSmall ? 'medium' : 'x-large' }}
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

    const onSquadTitleChange = (event) => {
        props.onSquadTitleChange(props.section.id, event.target.value)
    }

    return (
        <div className='nikke-squad-container'>
            <div className='squad-header grid-row'
                style={{ minWidth: props.windowSmall ? '20.25em' : '35.25rem', }}
            >
                <RecentActorsIcon sx={{ color: '#fff' }} />
                <InputBase
                    defaultValue={props.section.title}
                    onChange={onSquadTitleChange}
                    variant='standard'
                    disabled={!props.editable}
                    size={props.windowSmall ? 'small' : 'medium'}
                    sx={{
                        margin: '0.25rem 0',
                        paddingLeft: '0.25rem',
                        fontSize: props.windowSmall ? '1rem' : '1.5rem',
                        fontWeight: props.editable ? 'unset' : 'bold',
                        backgroundColor: props.editable ? '#00000040' : 'transparent',
                        '.Mui-disabled, .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#fff',
                            color: '#fff'
                        }
                    }}
                    inputProps={{
                        style: {
                            padding: 0
                        }
                    }}
                />
                <Button
                    onClick={() => props.onSetSquadMinimized(props.section.id, !props.section.minimized)}
                    variant='contained'
                    color={props.section.minimized ? 'info' : 'pumpkin'}
                    style={{
                        height: '70%',
                        borderTopRightRadius: '1rem',
                        position: 'absolute',
                        right: 0,
                        top: props.windowSmall ? '0.25rem' : '0.5rem'
                    }}
                >
                    {
                        props.section.minimized ?
                            <ArrowDropUpIcon />
                            : <ArrowDropDownIcon />
                    }
                </Button>
            </div>
            {
                props.section.minimized ?
                    null :
                    <div>
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
                                    style={{
                                        minWidth: props.windowSmall ? '20.25em' : '35.25rem',
                                        minHeight:
                                            props.nikkes.length === 0 ? '2.5rem'
                                                : (props.windowSmall ?
                                                    '5.75rem' : '10rem'
                                                ),
                                        backgroundColor: snapshot.isDraggingOver ? '#1976d280' : '#b59872',
                                    }}
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
                                                />)
                                        }
                                        )

                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className='nikke-squad-info grid-row'>
                            {props.enableRatings ? buildRatingNotes() : null}
                        </div>
                    </div>
            }
        </div >
    );
}

export default NikkeSquad;