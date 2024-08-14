import React, { useEffect, useLayoutEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd'; //'react-beautiful-dnd';
import NikkeData from '../assets/data/NikkeData.json';
import Tags from '../assets/data/NikkeTags.json';

import './nikkeTeamBuilder.css';
import NikkeSquad from '../components/nikkeSquad.js'
import NikkeList from '../components/nikkeList.js'
import NikkeFilter from '../components/nikkeFilter.js';

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

function NikkeTeamBuilder() {

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
        }
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
            },
            'squad-2': {
                id: 'squad-2',
                title: 'Squad 2',
                nikkeIds: [],
            },
            'squad-3': {
                id: 'squad-3',
                title: 'Squad 3',
                nikkeIds: [],
            },
            'squad-4': {
                id: 'squad-4',
                title: 'Squad 4',
                nikkeIds: [],
            },
            'squad-5': {
                id: 'squad-5',
                title: 'Squad 5',
                nikkeIds: [],
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
        sectionOrder: ['squad-1', 'squad-2', 'squad-3', 'squad-4', 'squad-5', 'bench', 'roster']
        // sectionOrder: ['squad-1', 'bench', 'roster']
    }
    // Collection of Nikkes to be used and altered
    const [nikkeLists, setNikkeLists] = useState(initNikkeLists);

    // Filtered collection of Nikkes visible from the roster section
    // filteredNikkes = {[{nikke1}, {nikke2}, ...]}
    const [filteredNikkes, setFilteredNikkes] = useState([...getAllNikkeIds()]);

    // States for rendering 
    const [visible, setVisible] = useState({
        'categories': ['Burst', 'Class', 'Code', 'Manufacturer', 'Weapon'],
        'filter': true,
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

        let newNikkeLists = {};

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
        else {
            // Create an array of object IDs
            let srcNikkeIds = Array.from(srcSection.nikkeIds);
            let dstNikkeIds = Array.from(dstSection.nikkeIds);


            // Remove the dragged object from list
            srcNikkeIds.splice(srcIndex, 1)
            // Insert the dragged object into the destination
            dstNikkeIds.splice(dstIndex, 0, nikkeId);

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

    /**
     * Runs the roster of Nikkes through a filter
     * @param {JSON} filter JSON Object of filterable tags
     */
    const handleFilter = (filter) => {
        // Run Nikke roster through filter
        // return true if nikke matches filter
        let newFilteredNikkes = nikkeLists.sections['roster'].nikkeIds.filter(nikkeId => {
            let nikke = getNikke(nikkeId);

            // For each category, check if the selected tags match the Nikke
            for (let j = 0; j < filter.categories.length; j++) {
                let category = filter.categories[j];

                // If all tags of a given category are selected, skip category
                if (filter[category].length === Tags[category].length) {
                    continue;
                }

                let found = false;

                // For each tag in a category, search for the selected tag
                for (let i = 0; i < filter[category].length; i++) {

                    // If a selected tag matches, set found and then break
                    if (filter[category][i] === nikke[category]) {
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
        handleFilter(Tags)
    }, [nikkeLists.sections['roster'].nikkeIds])

    return (
        <div className="page">
            <DragDropContext
                onDragEnd={onDragEnd}>
                {
                    nikkeLists.sectionOrder.map(sectionId => {
                        let section = nikkeLists.sections[sectionId];
                        if (sectionId === 'roster' || sectionId === 'bench')
                            return null;

                        let nikkes = collectNikkes(section.nikkeIds);

                        return <NikkeSquad
                            key={sectionId}
                            section={section}
                            nikkes={nikkes}
                            icons={icons}
                            visible={visible}
                            onMoveNikke={handleMoveNikke}
                        />;
                    })
                }
                <NikkeList
                    key={'bench'}
                    section={nikkeLists.sections['bench']}
                    nikkes={collectNikkes(nikkeLists.sections['bench'].nikkeIds)}
                    icons={icons}
                    visible={visible}
                    onMoveNikke={handleMoveNikke}
                />
                <NikkeFilter
                    onFilter={handleFilter}
                    icons={icons}
                    tags={Tags}
                    visible={visible}
                    setVisible={setVisible}
                />

                <NikkeList
                    key={'roster'}
                    section={nikkeLists.sections['roster']}
                    nikkes={collectNikkes(filteredNikkes)}
                    icons={icons}
                    visible={visible}
                    onMoveNikke={handleMoveNikke}
                />

            </DragDropContext >
        </div >
    )
}


export default NikkeTeamBuilder;