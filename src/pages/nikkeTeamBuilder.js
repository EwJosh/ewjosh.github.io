import React, { useLayoutEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd'; //'react-beautiful-dnd';
import NikkeData from '../assets/data/NikkeData.json';
import Tags from '../assets/data/NikkeTags.json';

import './nikkeTeamBuilder.css';
import NikkeSquad from '../components/nikke/nikkeSquad.js'
import NikkeList from '../components/nikke/nikkeList.js'
import NikkeFilter from '../components/nikke/nikkeFilter.js';
import NikkeSettings from '../components/nikke/nikkeSettings.js';
import NikkeHelp from '../components/nikke/nikkeHelp.js';

// Import Manufacturer
import ManufacturerElysionIcon from '../assets/images/Nikke/NikkeManufacturerElysion.png'
import ManufacturerMissilisIcon from '../assets/images/Nikke/NikkeManufacturerMissilis.png'
import ManufacturerTetraIcon from '../assets/images/Nikke/NikkeManufacturerTetra.png'
import ManufacturerPilgrimIcon from '../assets/images/Nikke/NikkeManufacturerPilgrim.png'
import ManufacturerAbnormalIcon from '../assets//images/Nikke/NikkeManufacturerAbnormal.png'
// Import Weapon
import WeaponARIcon from '../assets/images/Nikke/NikkeWeaponAR.png'
import WeaponMGIcon from '../assets/images/Nikke/NikkeWeaponMG.png'
import WeaponRLIcon from '../assets/images/Nikke/NikkeWeaponRL.png'
import WeaponSGIcon from '../assets/images/Nikke/NikkeWeaponSG.png'
import WeaponSMGIcon from '../assets/images/Nikke/NikkeWeaponSMG.png'
import WeaponSRIcon from '../assets/images/Nikke/NikkeWeaponSR.png'
// Import Class
import ClassAtkIcon from '../assets/images/Nikke/NikkeClassAttacker.png'
import ClassDefIcon from '../assets/images/Nikke/NikkeClassDefender.png'
import ClassSptIcon from '../assets/images/Nikke/NikkeClassSupporter.png'
// Import (Nikke) Code
import CodeElectricIcon from '../assets/images/Nikke/NikkeCodeElectric.png'
import CodeFireIcon from '../assets/images/Nikke/NikkeCodeFire.png'
import CodeIronIcon from '../assets/images/Nikke/NikkeCodeIron.png'
import CodeWaterIcon from '../assets/images/Nikke/NikkeCodeWater.png'
import CodeWindIcon from '../assets/images/Nikke/NikkeCodeWind.png'
// Import Burst
import Burst1Icon from '../assets/images/Nikke/NikkeBurst1.png'
import Burst1MIcon from '../assets/images/Nikke/NikkeBurst1M.png'
import Burst2Icon from '../assets/images/Nikke/NikkeBurst2.png'
import Burst3Icon from '../assets/images/Nikke/NikkeBurst3.png'
import BurstVIcon from '../assets/images/Nikke/NikkeBurstV.png'
import BlankIcon from '../assets/images/Nikke/NikkeIconBase.png'
import { Button, IconButton, Tooltip } from '@mui/material';
import { Add, Edit, QuestionMark, Settings, DeleteForever } from '@mui/icons-material';
import ContentPaste from '@mui/icons-material/ContentPaste';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

function NikkeTeamBuilder(props) {
    const [debugMode, setDebugMode] = useState(false);
    const [editable, setEditable] = useState(false);
    const [squadCnt, setSquadCnt] = useState(1);
    const [help, setHelp] = useState(false);

    /**
    * Active set of tags to process user filtering and can be modified.
    * [TO IMPLEMENT]
    * Healing, Shields, Piercing, True-Damage-Buff, MagSize-Buff, etc.
    */
    const [filter, setFilter] = useState({
        ...Tags,
        Rarity: ["SSR"],
        Name: ''
    });

    const [settings, setSettings] = useState({
        open: false,
        showRatings: true,
        targetCode: 'None'
    });

    /**
     * Constant collection of icons
     */
    const icons = {
        'Burst': {
            '1': Burst1Icon,
            '2': Burst2Icon,
            '3': Burst3Icon,
            '1M': Burst1MIcon,
            'V': BurstVIcon
        },
        'Class': {
            'Attacker': ClassAtkIcon,
            'Defender': ClassDefIcon,
            'Supporter': ClassSptIcon
        },
        'Code': {
            'Electric': CodeElectricIcon,
            'Fire': CodeFireIcon,
            'Iron': CodeIronIcon,
            'Water': CodeWaterIcon,
            'Wind': CodeWindIcon
        },
        'Manufacturer': {
            'Elysion': ManufacturerElysionIcon,
            'Missilis': ManufacturerMissilisIcon,
            'Tetra': ManufacturerTetraIcon,
            'Abnormal': ManufacturerAbnormalIcon,
            'Pilgrim': ManufacturerPilgrimIcon
        },
        'Weapon': {
            'AR': WeaponARIcon,
            'MG': WeaponMGIcon,
            'RL': WeaponRLIcon,
            'SG': WeaponSGIcon,
            'SMG': WeaponSMGIcon,
            'SR': WeaponSRIcon
        },
        'Blank': BlankIcon
    }

    /**
     * @returns Returns an Array of only Nikke ID/Names
     */
    const getAllNikkeIds = () => {
        // For each object in NikkeData, grab name
        let ids = NikkeData.map(item => item.Name);

        return ids;
    }

    /**
     * Initial JSON Object containing
     * nikkes: all Nikke data
     * sections: each section and their contained Nikkes
     * sectionOrder: an ordered Array of sections
     */
    const initNikkeLists = {
        sections: {
            'squad-1': {
                id: 'squad-1',
                title: 'Squad 1',
                nikkeIds: [],
                minimized: false
            },
            'bench': {
                id: 'bench',
                title: 'Bench',
                nikkeIds: []
            },
            'roster': {
                id: 'roster',
                title: 'Roster',
                nikkeIds: [...getAllNikkeIds()]
            }
        },
        // sectionOrder: ['squad-1', 'squad-2', 'squad-3', 'squad-4', 'squad-5', 'bench', 'roster']
        sectionOrder: ['squad-1', 'bench', 'roster']
    }
    // Collection of Nikkes to be used and altered
    const [nikkeLists, setNikkeLists] = useState(initNikkeLists);

    // Filtered collection of Nikkes visible from the roster section
    // filteredNikkes = {[{nikke1}, {nikke2}, ...]}
    const [filteredNikkes, setFilteredNikkes] = useState([...getAllNikkeIds()]);

    // States for rendering icons
    const [visibility, setVisibility] = useState({
        'categories': ['Burst', 'Class', 'Code', 'Manufacturer', 'Weapon'],
        'filter': true,
        'categoryIcons': true,
        'Burst': true,
        'Class': true,
        'Code': true,
        'Manufacturer': true,
        'Weapon': true
    });

    /**
     * Handles onDragEnd events for Drag-n-Drop components
     * @param {Event} result Object containing event data
     */
    const onDragEnd = (result) => {
        // Dragging will produce a result
        // Grab these variables from the result object
        let { draggableId, source, destination } = result;

        if (!destination)
            return;

        handleMoveNikke(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
    }

    const handleMoveNikke = (nikkeId, srcSectionId, dstSectionId, srcIndex, dstIndex) => {
        // Check if destination exists and that a change has been made, if not then return
        if (dstSectionId === srcSectionId
            && dstIndex === srcIndex)
            return;

        // Get column from data corresponding to the resulting source and destination sections
        let srcSection = nikkeLists.sections[srcSectionId];
        let dstSection = nikkeLists.sections[dstSectionId];

        // Used for refiltering the roster since I can't just use state
        let rosterIdsCopy = [];

        let newNikkeLists = {};

        // If moving within the same section (e.g. drag-n-drop within same squad)
        if (srcSection === dstSection) {
            // Create an array of object IDs
            let srcNikkeIds = Array.from(srcSection.nikkeIds);

            // Remove the dragged object from list
            srcNikkeIds.splice(srcIndex, 1)
            // Insert the dragged object into the destination
            srcNikkeIds.splice(dstIndex, 0, nikkeId);

            // Create new section using old section's data, but replacing new Nikke IDs
            let newSection = {
                ...srcSection,
                nikkeIds: srcNikkeIds
            }

            // Set data to use new information
            newNikkeLists = {
                ...nikkeLists,
                sections: {
                    ...nikkeLists.sections,
                    [newSection.id]: newSection
                }
            }
        }
        // If transferring between different sections
        else {
            // Create an array of object IDs
            let srcNikkeIds = Array.from(srcSection.nikkeIds);
            let dstNikkeIds = Array.from(dstSection.nikkeIds);

            // If the moving Nikke is from roster, it might be filtered and so
            // we'll have to find the proper src index inside of roster, not filtered
            if (srcSectionId === 'roster') {
                srcIndex = srcNikkeIds.indexOf(nikkeId);
            }
            // If the Nikke Unit function OnMoveNikke was used, we'll get a -1 as dstIndex. We want that to be the last index of dstSectionId
            if (dstIndex === -1)
                dstIndex = dstNikkeIds.length;

            // Remove the dragged object from list
            srcNikkeIds.splice(srcIndex, 1)
            // Insert the dragged object into the destination
            dstNikkeIds.splice(dstIndex, 0, nikkeId);

            // Grab a copy of roster to refilter
            if (srcSectionId === 'roster')
                rosterIdsCopy = srcNikkeIds;
            else if (dstSectionId === 'roster')
                rosterIdsCopy = dstNikkeIds;

            // Create new section using old section's data, but replacing new Nikke IDs
            let newSrcSection = {
                ...srcSection,
                nikkeIds: srcNikkeIds
            }

            let newDstSection = {
                ...dstSection,
                nikkeIds: dstNikkeIds
            }

            // Set data to use new information
            newNikkeLists = {
                ...nikkeLists,
                sections: {
                    ...nikkeLists.sections,
                    [newSrcSection.id]: newSrcSection,
                    [newDstSection.id]: newDstSection
                }
            }
        }

        if (srcSectionId === 'roster' || dstSectionId === 'roster')
            handleFilterIds(filter, rosterIdsCopy);
        setNikkeLists(newNikkeLists);
    }

    /**
     * Creates a new Array of objects whose ID values match the given array
     * 
     * @param {Array} nikkeIds Array of strings representing a desired list of Nikkes
     * @returns An array of JSON object representing Nikkes 
     */
    const collectNikkes = (nikkeIds) => {
        let nikkes = [];

        nikkeIds.forEach(nikkeId => {
            NikkeData.forEach(nikke => {
                if (nikke.Name === nikkeId)
                    nikkes.push(nikke);
            })
        });

        return nikkes;
    }

    /**
     * Gets the specified Nikke object
     * @param {string} nikkeId id value of the desired Nikke
     * @returns the specified Nikke if found in the original list, null otherwise.
     */
    const getNikke = (nikkeId) => {
        for (let i = 0; i < NikkeData.length; i++) {
            if (NikkeData[i].Name === nikkeId)
                return NikkeData[i];

        }
        return null;
    }

    const handleFilter = (inputFilter) => {
        handleFilterIds(inputFilter, nikkeLists.sections['roster'].nikkeIds);
    }

    /**
     * Runs the roster of Nikkes through a filter
     * @param {JSON} inputFilter JSON Object of filterable tags
     */
    const handleFilterIds = (inputFilter, inputIds) => {
        setFilter({ ...inputFilter });


        // Run Nikke roster through filter
        // return true if nikke matches filter
        let newFilteredNikkes = inputIds.filter(nikkeId => {
            let nikke = getNikke(nikkeId);

            // If Name is being filtered, check if Nikke's name matches
            if (inputFilter.Name != null && inputFilter.Name.length > 0) {
                // Create RegExp using filter. Using Start of String (^) and forcing filter to lowercase
                let regex = new RegExp('^' + inputFilter.Name.toLowerCase())
                // Check regex to nikkeId, if nothing is returned then reject Nikke
                if (regex.exec(nikkeId.toLowerCase()) == null)
                    return false;
            }

            // For each category, check if the selected tags match the Nikke
            for (let j = 0; j < inputFilter.categories.length; j++) {
                let category = inputFilter.categories[j];

                // If all tags of a given category are selected, skip category
                if (inputFilter[category].length === Tags[category].length) {
                    continue;
                }

                let found = false;

                // For each tag in a category, search for the selected tag
                for (let i = 0; i < inputFilter[category].length; i++) {

                    // If a selected tag matches, set found and then break
                    if (inputFilter[category][i] === nikke[category]) {
                        found = true;
                        break;
                    }
                }

                if (!found)
                    return false;
                // Check each category
            }
            // If good
            return true;
        })

        setFilteredNikkes([
            ...newFilteredNikkes
        ])
    }



    // useLayoutEffect is like useEffect, except it waits for the browser to paint.
    // This allows us to maintain the drag-n-drop feature without seeing it jitter.
    useLayoutEffect(() => {
        handleFilter(filter)
    }, [nikkeLists.sections['roster'].nikkeIds])


    const handleAddSquad = (index) => {
        // Create new section id and a new section object using Squad Count.
        // Need to increment because concurrency still reads Squad Count as pre-increment
        let newSectionId = 'squad-' + (squadCnt + 1);
        let newSectionTitle = 'Squad ' + (squadCnt + 1);
        setSquadCnt(squadCnt + 1);

        // Create new section order array by inserting the new section id before the bench and roster.
        let newSectionOrder = nikkeLists.sectionOrder.slice(0, index + 1);
        newSectionOrder.push(newSectionId);
        newSectionOrder = newSectionOrder.concat(nikkeLists.sectionOrder.slice(index + 1));

        // Update information. Be sure to use brackets around [newSectionId] to ensure it uses variable for name.
        setNikkeLists({
            sections: {
                ...nikkeLists.sections,
                [newSectionId]: {
                    id: newSectionId,
                    title: newSectionTitle,
                    nikkeIds: [],
                    minimized: false
                }
            },
            sectionOrder: newSectionOrder
        });
    }

    const handleRemoveSquad = (sectionId) => {
        // Unload nikkeIds so that we don't lose any units. Place them into bench.
        nikkeLists.sections[sectionId].nikkeIds.forEach(nikkeId =>
            nikkeLists.sections['bench'].nikkeIds.push(nikkeId)
        );

        // Copy the sections object and remove the target section.
        let newSections = nikkeLists.sections;
        delete newSections[sectionId];

        // Create a new section order array.
        // Use single for-loop and check name to reduce time, compared to searching for index and removing element.
        let newSectionOrder = [];
        nikkeLists.sectionOrder.forEach(section => {
            if (section !== sectionId)
                newSectionOrder.push(section)
        })

        // Deny the removal of the last squad. Could be higher, but...
        // Though not necessary, I'm gonna instead reset Squad Counter to 1 and replace last squad with a 'squad-1'.
        if (nikkeLists.sectionOrder.length === 3) {
            setSquadCnt(1);
            // Doesn't work to just use handleAddSquad(0) here. Seems to be a concurrency issue with states.

            // Update information
            setNikkeLists({
                sections: {
                    'squad-1': {
                        id: 'squad-1',
                        title: 'Squad 1',
                        nikkeIds: [],
                        minimized: false
                    },
                    'bench': {
                        ...nikkeLists.sections['bench']
                    },
                    'roster': {
                        ...nikkeLists.sections['roster']
                    }
                },
                sectionOrder: ['squad-1', 'bench', 'roster']
            })
        }
        else {
            // Otherwise, update information
            setNikkeLists({
                sections: {
                    ...newSections
                },
                sectionOrder: newSectionOrder
            })
        }
    }

    const handleMoveSquad = (sectionId, ifMoveUp) => {
        let sectOrder = nikkeLists.sectionOrder;

        // If only squad, return
        if (sectOrder.length === 3)
            return;

        // Grab initial indices
        let srcIndex = sectOrder.indexOf(sectionId);
        let dstIndex = ifMoveUp ? srcIndex - 1 : srcIndex + 1;

        // If attempting to move outside of range, move to opposite end.
        if (dstIndex === -1)
            dstIndex = sectOrder.length - 3;
        else if (dstIndex === sectOrder.length - 2)
            dstIndex = 0;

        // Perform simple array swap
        sectOrder[srcIndex] = sectOrder[dstIndex];
        sectOrder[dstIndex] = sectionId;

        setNikkeLists({
            ...nikkeLists,
            'sectionOrder': sectOrder
        })
    }

    const handleSquadTitleChange = (sectionId, title) => {
        setNikkeLists({
            sections: {
                ...nikkeLists.sections,
                [sectionId]: {
                    ...nikkeLists.sections[sectionId],
                    title: title
                }
            },
            sectionOrder: nikkeLists.sectionOrder
        })
    }

    const handleSetSquadMinimized = (sectionId, bool) => {
        console.log(sectionId, bool);

        setNikkeLists({
            sections: {
                ...nikkeLists.sections,
                [sectionId]: {
                    ...nikkeLists.sections[sectionId],
                    minimized: bool
                }
            },
            sectionOrder: nikkeLists.sectionOrder
        })
    }

    return (
        <div className="page" style={{ fontSize: props.windowSmall ? '0.75rem' : '1rem' }}>
            {/* Page Title */}
            <h1>Nikke Team Builder</h1>
            {/* Page Header */}
            <div id='tb-header' className='grid-row'>
                {/* Debug: Print Button */}
                {
                    debugMode ?
                        <Tooltip
                            title='Print Nikke Lists'
                            placement='top'
                        >
                            <IconButton
                                onClick={() => console.log(nikkeLists, visibility)}
                                sx={{ backgroundColor: '#ed6c02' }}
                            >
                                <ContentPaste />
                            </IconButton>
                        </Tooltip>
                        : null
                }
                {/* Help Button */}
                <Tooltip
                    title='Help'
                    placement='top'
                >
                    <IconButton
                        onClick={() => setHelp(true)}
                        sx={{ backgroundColor: '#1976d2', }}
                    >
                        <QuestionMark />
                    </IconButton>
                </Tooltip>
                <NikkeHelp
                    open={help}
                    onClose={() => setHelp(false)}
                />
                {/* Edit Button */}
                <Tooltip
                    title='Edit Squads'
                    placement='top'
                >
                    <Button
                        onClick={() => setEditable(!editable)}
                        startIcon={<Edit />}
                        color='inherit'
                        sx={{
                            height: '2.5rem',
                            margin: '0 1rem',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 'large',
                            textTransform: 'none',
                            backgroundColor: editable ? 'gray' : '#1976d2',
                            border: editable ? '1px solid  #ffffff77' : '0'
                        }}
                    >
                        Edit
                    </Button>
                </Tooltip>
                {/* Settings Button */}
                <Tooltip
                    title='Settings'
                    placement='top'
                >
                    <IconButton
                        sx={{ backgroundColor: '#1976d2' }}
                        onClick={() => setSettings({
                            ...settings,
                            open: true
                        })}
                    >
                        <Settings />
                    </IconButton>
                </Tooltip>
                {/* Settings Dialog */}
                <NikkeSettings
                    onClose={() => setSettings({
                        ...settings,
                        open: false
                    })}
                    settings={settings}
                    setSettings={setSettings}
                    debugMode={debugMode}
                    setDebugMode={setDebugMode}
                    icons={icons}
                />
            </div>

            {/* Main Content */}
            <DragDropContext
                onDragEnd={onDragEnd}>
                {
                    nikkeLists.sectionOrder.map((sectionId, index) => {
                        let section = nikkeLists.sections[sectionId];

                        if (sectionId === 'roster' || sectionId === 'bench')
                            return null;

                        let nikkes = collectNikkes(section.nikkeIds);

                        return <div
                            className='squad-supercontainer grid-row'
                            key={sectionId}
                        >
                            {
                                // Left edit buttons: Move Squad Up op Down
                                editable ?
                                    <div className='grid-column'>
                                        <IconButton
                                            onClick={() => handleMoveSquad(sectionId, true)}
                                            sx={{
                                                maxWidth: '1.5rem',
                                                maxHeight: '1.5rem',
                                                backgroundColor: 'gray',
                                                border: '1px solid #ffffff77'
                                            }}
                                        ><KeyboardDoubleArrowUpIcon fontSize='small' /></IconButton>
                                        <IconButton
                                            onClick={() => handleMoveSquad(sectionId, false)}
                                            sx={{
                                                maxWidth: '1.5rem',
                                                maxHeight: '1.5rem',
                                                backgroundColor: 'gray',
                                                border: '1px solid #ffffff77'
                                            }}
                                        ><KeyboardDoubleArrowDownIcon fontSize='small' /></IconButton>
                                    </div>
                                    : null
                            }
                            <NikkeSquad
                                section={section}
                                nikkes={nikkes}
                                icons={icons}
                                windowSmall={props.windowSmall}
                                visibility={visibility}
                                onMoveNikke={handleMoveNikke}
                                editable={editable}
                                onSquadTitleChange={handleSquadTitleChange}
                                targetCode={settings.targetCode}
                                showRatings={settings.showRatings}
                                onSetSquadMinimized={handleSetSquadMinimized}
                                theme={props.theme}
                            />
                            {
                                editable ?
                                    <div className='grid-column'>
                                        <IconButton
                                            onClick={() => handleRemoveSquad(sectionId)}
                                            sx={{
                                                maxWidth: '1.5rem',
                                                maxHeight: '1.5rem',
                                                backgroundColor: '#c32020',
                                                border: '1px solid #ffffff77'
                                            }}
                                        ><DeleteForever fontSize='small' /></IconButton>
                                        <IconButton
                                            onClick={() => handleAddSquad(index)}
                                            sx={{
                                                maxWidth: '1.5rem',
                                                maxHeight: '1.5rem',
                                                backgroundColor: '#209320',
                                                border: '1px solid #ffffff77'
                                            }}
                                        ><Add /></IconButton>
                                    </div>
                                    : null
                            }
                        </div>;
                    })
                }
                <NikkeList
                    key={'bench'}
                    section={nikkeLists.sections['bench']}
                    nikkes={collectNikkes(nikkeLists.sections['bench'].nikkeIds)}
                    icons={icons}
                    windowSmall={props.windowSmall}
                    visibility={visibility}
                    onMoveNikke={handleMoveNikke}
                />
                <NikkeFilter
                    filter={filter}
                    onFilter={handleFilter}
                    icons={icons}
                    windowSmall={props.windowSmall}
                    tags={Tags}
                    visibility={visibility}
                    setVisibility={setVisibility}
                    debugMode={debugMode}
                />

                <NikkeList
                    key={'roster'}
                    section={nikkeLists.sections['roster']}
                    nikkes={collectNikkes(filteredNikkes)}
                    icons={icons}
                    windowSmall={props.windowSmall}
                    visibility={visibility}
                    onMoveNikke={handleMoveNikke}
                />

            </DragDropContext >
        </div >
    )
}


export default NikkeTeamBuilder;