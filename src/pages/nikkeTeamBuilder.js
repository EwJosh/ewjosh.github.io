import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd'; //'react-beautiful-dnd';

// Import assets
import NikkeData from '../assets/data/NikkeData.json';
import Tags from '../assets/data/NikkeTags.json';
import { Icons, getNikkeAvatars } from '../components/nikke/nikkeAssets.js'

// Import components
import './nikkeTeamBuilder.css';
import NikkeSquad from '../components/nikke/nikkeSquad.js'
import NikkeList from '../components/nikke/nikkeList.js'
import NikkeFilter from '../components/nikke/nikkeFilter.js';
import NikkeSettings from '../components/nikke/nikkeSettings.js';
import NikkeHelp from '../components/nikke/nikkeHelp.js';

// Import MUI components
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// Import MUI icons
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import QuestionMark from '@mui/icons-material/QuestionMark';
import Settings from '@mui/icons-material/Settings';
import DeleteForever from '@mui/icons-material/DeleteForever';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Drawer } from '@mui/material';

const NikkeAvatars = { ...getNikkeAvatars() };

function NikkeTeamBuilder(props) {
    // let { urlId } = useParams();
    // How many squads have been created? Different than how many squads are there currently.
    const [squadCnt, setSquadCnt] = useState(3);

    /**
    * Active set of tags to process user filtering and can be modified.
    * See Tags to see what's available..
    */
    const [filter, setFilter] = useState({
        ...Tags,
        'Rarity': ['SSR'],  // Initialize Rarity to only have SSR selected.
        'Name': ''          // Add Name to filter (not in Tags) and initialize as blank.
    });

    /**
     * Collection of states/settings.
     * Could be separated into their own variables/states, but this way it's easier to manage them all.
     */
    const [settings, setSettings] = useState({
        editable: false,        // Can edit Squads.
        openSideRoster: false,  // Side menu (Filter+Rostera) is open.
        openHelp: false,        // Help dialog is open.

        openSettings: false,    // Settings dialog is open.
        targetCode: 'None',     // The selected Code weakness (for reviews).
        enableReviews: true,    // Reviews is enabled.
        allowDuplicates: false, // Duplicate Nikkes are allowed.
        squadsPerRow: (window.innerWidth <= 1290) ? // Squads displayed per row. Initialized value depends on window size.
            1 : (window.innerWidth > 1920) ?
                3
                : 2,
        compactMode: false,  // Whether filter and roster are side menus (true) or at the bottom of the page (false).
        debugMode: false        // Debug mode is enabled (for console printing data).
    });
    /**
     * Sets the selected setting to the given value.
     * @param {string} setting Setting option being updated.
     * @param {value} value Value to update the setting option.
     */
    const updateSettings = (setting, value) => {
        setSettings({
            ...settings,
            [setting]: value
        })
    }

    /**
     * Gets ALL Nikke IDs from NikkeData.
     * @returns Returns an Array of only Nikke IDs.
     */
    const getAllNikkeIds = () => {
        // For each object in NikkeData, grab name
        let ids = NikkeData.map(item => item.Id);

        return ids;
    }

    /**
     * Initial JSON Object containing...
     * sections: Each section and their contained Nikkes.
     *  -Squads: Sections for Nikke game-deployment and rating.
     *      title: Name displayed for Squads.
     *      minimized: If true, the Squad's Nikkes and reviews are hidden.
     *  -Bench and Roster: Sections for Nikke management. Bench is for 'favorites' and Roster is for all.
     * sectionOrder: An ordered Array of squads.
     */
    const initNikkeLists = {
        sections: {
            'squad-1': {
                id: 'squad-1',
                title: 'Squad 1',
                nikkeIds: [],
                minimized: false
            },
            'squad-2': {
                id: 'squad-2',
                title: 'Squad 2',
                nikkeIds: [],
                minimized: true
            },
            'squad-3': {
                id: 'squad-3',
                title: 'Squad 3',
                nikkeIds: [],
                minimized: true
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
        sectionOrder: ['squad-1', 'squad-2', 'squad-3']
    }

    // Filtered collection of Nikke objects visible from the roster section.
    // i.e. Which of the Roster will be rendered.
    // filteredNikkes = {[{nikke1}, {nikke2}, ...]}
    const [filteredNikkes, setFilteredNikkes] = useState([...getAllNikkeIds()]);

    // States for rendering icons and other components.
    const [visibility, setVisibility] = useState({
        // Iterable list of visibility keys for NikkeUnit.
        'categories': ['Burst', 'Code', 'Weapon', 'Class', 'Company'],

        'filter': true,         // Whether the filter component is rendered at all.
        'filterMin': false,     // Whether the filter component is minimized.
        'categoryIcons': true,  // If false, shrinks NikkeUnit and skips rendering of the bottom four icons.
        'quickMove': true,      // Whether the quick-move (+/-) buttons are rendered.

        // Icons that can be hidden if false
        'Burst': true,
        'Class': true,
        'Code': true,
        'Company': true,
        'Weapon': true
    });

    /**
     * Handles onDragEnd events for Drag-n-Drop components.
     * Called when a NikkeUnit is dragged and dropped and needs to be moved.
     * @param {Event} result Object containing event data
     */
    const onDragEnd = (result) => {
        // Dragging will produce a result
        // Grab these variables from the result object
        let { draggableId, source, destination } = result;

        if (!destination)
            return;

        // Handle movement
        handleMoveNikke(draggableId.split('-')[0], source.droppableId, destination.droppableId, source.index, destination.index);
    }

    /**
     * Handles the movement of a Nikke. Called for dragging or Add/Remove Units.
     * Removes target Nikke from the source section and inserts into the designated section.
     * If Roster is the destination, checks to see if Nikke is already there. If already there, skips insertion.
     * If Roster is involved, updates filtered Nikkes.
     * @param {string} nikkeId ID of the moving Nikke.
     * @param {string} srcSectionId ID of the Nikke's starting section.
     * @param {string} dstSectionId ID of the Nikke's designated section.
     * @param {number} srcIndex index of the Nikke in the starting section.
     * @param {number} dstIndex index of the Nikke in the designated section. If -1, Nikke will be moved to the end of the list.
     */
    const handleMoveNikke = (nikkeId, srcSectionId, dstSectionId, srcIndex, dstIndex) => {
        // Check if destination exists and that a change has been made, if not then return.
        if (dstSectionId === srcSectionId
            && dstIndex === srcIndex)
            return;

        // Get column from data corresponding to the resulting source and destination sections.
        let srcSection = nikkeLists.sections[srcSectionId];
        let dstSection = nikkeLists.sections[dstSectionId];

        // Used for refiltering the roster since I can't just use state.
        let rosterIdsCopy = [];

        let newNikkeLists = {};

        // If moving within the same section (e.g. drag-n-drop within same squad).
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
        // If the Nikke is being sent to Roster, insert it alphabetically to maintain consistency.
        // If it's already there, don't insert into Roster, just extract from source section.
        else if (dstSectionId === 'roster') {
            // Create an array of object IDs
            let srcNikkeIds = Array.from(srcSection.nikkeIds);
            let dstNikkeIds = Array.from(dstSection.nikkeIds);

            // Find alphabetical index using binary search
            // Left and right are indices for binary search
            // srcNikke is the moving Nikke in object form (used for comparing with Rarity)
            let left = 0;
            let right = dstNikkeIds.length - 1;
            let srcNikke = getNikkeById(nikkeId);

            // Perform binary search
            while (left < right) {
                // Compute middle index
                let mid = Math.floor((right - left + 1) / 2 + left);

                // If middle index is our source Nikke, zero onto mid
                if (nikkeId === dstNikkeIds[mid]) {
                    left = mid;
                    right = mid;
                }
                else {
                    // Get middle Nikke object
                    let midNikke = getNikkeById(dstNikkeIds[mid]);

                    // Binary compare
                    if (lessThan(srcNikke, midNikke))
                        right = mid - 1;
                    else
                        left = mid;
                }
            }

            // Remove the dragged object from list.
            srcNikkeIds.splice(srcIndex, 1)

            // Only insert if Nikke is not already in Roster.
            if (dstNikkeIds[left] !== nikkeId) {
                // Insert the dragged object into the destination.
                dstNikkeIds.splice(left + 1, 0, nikkeId);
            }

            // Grab a copy of roster to refilter.
            if (srcSectionId === 'roster')
                rosterIdsCopy = srcNikkeIds;
            rosterIdsCopy = dstNikkeIds;

            // Create new section using old section's data, but replacing new Nikke IDs.
            let newSrcSection = {
                ...srcSection,
                nikkeIds: srcNikkeIds
            }

            let newDstSection = {
                ...dstSection,
                nikkeIds: dstNikkeIds
            }

            // Set data to use new information.
            newNikkeLists = {
                ...nikkeLists,
                sections: {
                    ...nikkeLists.sections,
                    [newSrcSection.id]: newSrcSection,
                    [newDstSection.id]: newDstSection
                }
            }
        }
        // If transferring between different sections.
        else {
            // Create an array of object IDs
            let srcNikkeIds = Array.from(srcSection.nikkeIds);
            let dstNikkeIds = Array.from(dstSection.nikkeIds);

            // If the moving Nikke is from Roster, it might be filtered and so
            // we'll have to find the proper src index inside of roster, not filtered
            if (srcSectionId === 'roster')
                srcIndex = srcNikkeIds.indexOf(nikkeId);

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

        // Update filter if roster is involved.
        if (srcSectionId === 'roster' || dstSectionId === 'roster')
            handleFilterIds(filter, rosterIdsCopy);
        // Set new lists.
        setNikkeLists(newNikkeLists);
    }

    /**
     * Compares two Nikke objects akin to nikke1 < nikke2 for the sake of Roster order (by Rarity then Alphabetical).
     * If their Rarities differ, return whether nikke1's Rarity is 'smaller' (SSR < SR < R).
     * Otherwise, return whether nikke1's Name is 'smaller' (A < ... < Z).
     * @param {object} nikke1 Left-side Nikke object.
     * @param {object} nikke2 Right-side Nikke object.
     * @returns true if nikke1 should be considered 'less than' nikke2.
     */
    const lessThan = (nikke1, nikke2) => {
        // Compare Rarities such that (SSR < SR < R).
        if (nikke1.Rarity > nikke2.Rarity)
            return true;
        else if (nikke1.Rarity < nikke2.Rarity)
            return false;

        // If Rarities are equivalent, compare Names such that (A < ... < Z).
        if (nikke1.Name.toUpperCase() < nikke2.Name.toUpperCase())
            return true;
        else
            return false;
    }

    /**
     * Creates a new Array of Nikke objects whose ID values match the given array.
     * @param {Array} nikkeIds Array of strings representing a desired list of Nikkes.
     * @returns An array of JSON object representing Nikkes .
     */
    const collectNikkes = (nikkeIds) => {
        let nikkes = [];

        nikkeIds.forEach(nikkeId => {
            NikkeData.forEach(nikke => {
                if (nikke.Id === nikkeId)
                    nikkes.push(nikke);
            })
        });

        return nikkes;
    }

    /**
     * Gets the specified Nikke object via its Name value through the original NikkeData list, if it exists.
     * @param {string} nikkeName Full name value of the desired Nikke.
     * @returns The specified Nikke if found in the original list, null otherwise.
     */
    const getNikkeByName = (nikkeName) => {
        for (let i = 0; i < NikkeData.length; i++) {
            if (NikkeData[i].Name === nikkeName)
                return NikkeData[i];

        }
        return null;
    }

    /**
     * Gets the specified Nikke object via its ID value through the original NikkeData list, if it exists.
     * @param {string} nikkeId ID value of the desired Nikke.
     * @returns The specified Nikke if found in the original list, null otherwise.
     */
    const getNikkeById = (nikkeId) => {
        for (let i = 0; i < NikkeData.length; i++) {
            if (NikkeData[i].Id === nikkeId)
                return NikkeData[i];

        }
        return null;
    }

    /**
     * Neutral call for handleFilterIds. Uses the Roster's IDs from the current state.
     * Called by the Filter component and useLayoutEffect.
     * @param {object} inputFilter JSON Object of filterable tags.
     */
    const handleFilter = (inputFilter) => {
        handleFilterIds(inputFilter, nikkeLists.sections['roster'].nikkeIds);
    }

    /**
     * Runs the given IDs of Nikkes through a filter. 
     * Called by the handleFilter and handleMoveNikke.
     * @param {object} inputFilter JSON Object of filterable tags.
     */
    const handleFilterIds = (inputFilter, inputIds) => {
        // Update filter state.
        setFilter({ ...inputFilter });

        // Some easter eggs / meme filters
        if (inputFilter.Name.toLowerCase() === 'best girl') {
            setFilteredNikkes([
                ...getAllNikkeIds()
            ]);
            return;
        }
        else if (inputFilter.Name.toLowerCase() === 'real best girl') {
            setFilteredNikkes([
                53, 107 //Scarlet and Scarlet: BS
            ]);
            return;
        }

        // Run Nikke roster through filter
        // - return true if nikke matches filter
        let newFilteredNikkes = inputIds.filter(nikkeId => {
            let nikke = getNikkeById(nikkeId);

            // If Name is being filtered, check if Nikke's name matches
            if (inputFilter.Name != null && inputFilter.Name.length > 0) {
                // Create RegExp using filter. Using Start of String (^) and forcing filter to lowercase
                let regex = new RegExp('^' + inputFilter.Name.toLowerCase())
                // Check regex to nikkeId, if nothing is returned then reject Nikke
                if (regex.exec(nikke.Name.toLowerCase()) == null)
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

        // Update FilteredNikkes array
        setFilteredNikkes([
            ...newFilteredNikkes
        ])
    }

    /**
     * Adds a new Squad into sections. The new Squad's placement in sectionOrder is dependent on the given index.
     * ID and Name of the new Squad is dependent on the state squadCnt regardless of its index and the quantity of current Squads.
     * @param {number} index Index for the new Squad.
     */
    const handleAddSquad = (index) => {
        // Create new section id and a new section object using Squad Count.
        // Need to increment because concurrency still reads Squad Count as pre-increment
        let newSectionId = 'squad-' + (squadCnt + 1);
        let newSectionTitle = 'Squad ' + (squadCnt + 1);
        setSquadCnt(squadCnt + 1);

        // Create new section order array by inserting the new section id in the index slot.
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

    /**
     * Deletes a Squad from sections. If the Squad has Nikkes, dump them into Bench.
     * If attempting to remove the last Squad, reset Squad section information including squadCnt.
     * @param {string} sectionId ID value of the Squad to be deleted.
     */
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
        if (nikkeLists.sectionOrder.length === 1) {
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
                sectionOrder: ['squad-1']
            })
        }
        else {
            // Otherwise, update information as normal
            setNikkeLists({
                sections: {
                    ...newSections
                },
                sectionOrder: newSectionOrder
            })
        }
    }

    /**
     * Swaps the position of the given Squad upward (towards index 0) or downward (towards index N).
     * @param {string} sectionId ID value of the section being moved.
     * @param {boolean} ifMoveUp true if moving 'upward' (towards index 0), false otherwise.
     */
    const handleMoveSquad = (sectionId, ifMoveUp) => {
        let sectOrder = nikkeLists.sectionOrder;

        // If only squad, return.
        if (sectOrder.length === 1)
            return;

        // Grab initial indices.
        let srcIndex = sectOrder.indexOf(sectionId);
        let dstIndex = ifMoveUp ? srcIndex - 1 : srcIndex + 1;

        // If attempting to move outside of range, move to opposite end.
        if (dstIndex === -1)
            dstIndex = sectOrder.length - 1;
        else if (dstIndex === sectOrder.length)
            dstIndex = 0;

        // Perform simple array swap.
        sectOrder[srcIndex] = sectOrder[dstIndex];
        sectOrder[dstIndex] = sectionId;

        // Update sectionOrder.
        setNikkeLists({
            ...nikkeLists,
            'sectionOrder': sectOrder
        })
    }

    /**
     * Updates the title to be displayed on a given Squad.
     * @param {string} sectionId ID value of the Squad whose name is being changed. 
     * @param {string} title String value to update the title.
     */
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

    /**
     * Sets the minimization of a given section.
     * Boolean is a parameter for the potential update to have a Collapse All and Minimize All button.
     * @param {string} sectionId ID value of the affected Squad.
     * @param {*} bool true if Squad is to be minimized.
     */
    const handleSetSquadMinimized = (sectionId, bool) => {
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

    /**
     * Converts the dynamic URL into a list information. Called when page is loaded and used when lists are initialized.
     * SquadId format functions as follows
     * - The Nikke numerical IDs are seperated by '-'.
     * - Squads are separated by '&'.
     * - Example: 97-111-20&23-121-114-112-21&27-83
     * - Example: 83-53-98-93-68&38-85-86-97&20-99-100-102&118
     * 
     * Returns null if the dynamic URL is invalid.
     * @returns A new nikkeLists based on the dynamic URL, if possible. If dynamic URL is invalid, returns null.
     */
    const readSquadId = (squadId) => {
        // Try/catch block in case split fails or something unexpected occurs.
        try {
            // Minimum length of a valid Squad ID would be 1 (e.g. 0)
            if (!squadId || squadId.length < 1)
                return null;

            // Separate url id by '&'.
            let squads = squadId.split('&');
            // Squad counter for ids and titles.
            let squadIndex = 1;
            // Force-limit squad parsing at 10 to limit parsing issues. (Arbitrary)
            let squadMax = Math.min(squads.length, 10)

            // Temp information for building the new nikkeLists
            let newSections = {
            };
            let newSectionOrder = [];
            let newBenchIds = initNikkeLists.sections.bench.nikkeIds;
            let newRosterIds = initNikkeLists.sections.roster.nikkeIds;

            // Loop through Squad strings
            for (let i = 0; i < squadMax; i++) {
                // Remove squad indentifier and then split up Nikke IDs.
                let nikkeList = squads[i].split('-');
                // If a nikkeList is empty, skip squad.
                if (nikkeList.length === 0)
                    continue;

                // Initialize nikkeIds array and force-limit squads to 5 to limit parsing issues. (Arbitrary)
                let newNikkeIds = [];
                let maxSquad = Math.min(nikkeList.length, 5);

                // Loop through Nikke Id strings
                for (let j = 0; j < maxSquad; j++) {
                    // Check to see if Nikke ID exists. Throw exception if not found.
                    let nikkeId = getNikkeById(nikkeList[j]).Id;
                    if (nikkeId == null)
                        throw new Error('Nikke not found');

                    // Push Nikke's Name (in order) to array
                    newNikkeIds.push(nikkeId);

                    if (newBenchIds.length > 0) {
                        let nikkeIndex = newBenchIds.indexOf(nikkeId);
                        if (nikkeIndex !== -1)
                            newBenchIds.splice(nikkeIndex, 1);
                    }

                    // Remove from Roster, if it exists
                    let nikkeIndex = newRosterIds.indexOf(nikkeId);
                    if (nikkeIndex !== -1)
                        newRosterIds.splice(nikkeIndex, 1);
                }

                // After looping through Nikkes, Update temp information for the newNikkeLists and increment squadIndex
                newSections = {
                    ...newSections,
                    ['squad-' + squadIndex]: {
                        id: 'squad-' + squadIndex,
                        title: 'Squad ' + squadIndex,
                        nikkeIds: newNikkeIds,
                        minimized: false
                    }
                }
                newSectionOrder.push('squad-' + squadIndex);
                squadIndex += 1;
            }

            // After looping through Squads, update Squad Count and Nikke Lists
            setSquadCnt(newSectionOrder.length)

            setNikkeLists({
                sections: {
                    ...newSections,
                    bench: {
                        ...initNikkeLists.sections.bench,
                        nikkeIds: newBenchIds
                    },
                    roster: {
                        ...initNikkeLists.sections.roster,
                        nikkeIds: newRosterIds
                    }
                },
                sectionOrder: newSectionOrder
            })

            // After looping though Squads, return newNikkeLists
            return {
                sections: {
                    ...newSections,
                    bench: {
                        ...initNikkeLists.sections.bench,
                        nikkeIds: newBenchIds
                    },
                    roster: {
                        ...initNikkeLists.sections.roster,
                        nikkeIds: newRosterIds
                    }
                },
                sectionOrder: newSectionOrder
            };
        }
        // If we ever throw/catch an error, log it and return null.
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Initialize nikkeList through dynamic URL upon page startup.
    let listById = null; //readSquadId(urlId);

    // Collection of Nikkes to be used and altered.
    const [nikkeLists, setNikkeLists] = useState(listById !== null ? listById : initNikkeLists);

    /**
     * Converts current Squad information into a shareable link and copies contents into system clipboard.
     * For details on how Squad Ids are parsed/processed, see readSquadId().
     */
    const getSquadId = () => {
        // Initialize squadId and squadIndex for counting squads.
        let squadId = '';
        let squadIndex = 0;

        // Force-limit squad parsing at 10 to limit parsing issues. (Arbitrary)
        let squadMax = Math.min(nikkeLists.sectionOrder.length, 10)

        // Loop through each Squad.
        for (let i = 0; i < squadMax; i++) {
            // Fetch Squad
            let squad = nikkeLists.sections[nikkeLists.sectionOrder[i]];

            // If Squad is empty, skip.
            if (squad.nikkeIds.length === 0)
                continue;

            // Separate Squads by '&'.
            if (i !== 0)
                squadId += '&';

            // Force-limit squads to 5 to limit parsing issues. (Arbitrary)
            let maxSquad = Math.min(squad.nikkeIds.length, 5)
            for (let j = 0; j < maxSquad; j++) {
                // Fetch Nikke Id
                let nikkeId = getNikkeById(squad.nikkeIds[j]).Id;

                // Append Nikke ID. Seperate Nikkes by '-'.
                if (j !== 0)
                    squadId += '-';
                squadId += nikkeId;
            }
            // After looping through Nikkes, increment squadIndex.
            squadIndex++;
        }

        // After looping through Squads, return SquadId.
        return squadId;
    }

    /**
     * Converts the current Squads into a shareable code and copies the string onto the user's system's clipboard.
     */
    const copySquadIdToClipboard = () => {
        // Add this when dynamic url is fixed: 'https://ewjosh.github.io//#/apps/nikkeTeamBuilder/'
        navigator.clipboard.writeText(getSquadId());
    }

    // useLayoutEffect is like useEffect, except it waits for the browser to paint.
    // This allows us to maintain the drag-n-drop feature without seeing it jitter.
    useLayoutEffect(() => {
        handleFilter(filter)
    }, [nikkeLists.sections['roster'].nikkeIds])

    /**
     * Function to get the NikkeFilter custom React component.
     * Turned into a function to allow access to be built in multiple areas (e.g. main page and sidebar menu)
     * without having to maintain two separate instances.
     * @param {object} additionalProps Props to be added to the component in a JSON format. 
     * @returns An instance of a custom React component NikkeFilter.
     */
    const getFilter = (additionalProps) => {
        if (visibility.filter)
            return <NikkeFilter
                filter={filter}
                onFilter={handleFilter}
                icons={Icons}
                windowSmall={props.windowSmall}
                windowWide={props.windowWide}
                tags={Tags}
                visibility={visibility}
                setVisibility={setVisibility}
                targetCode={settings.targetCode}
                debugMode={settings.debugMode}
                {...additionalProps}
            />;
    }

    /**
     * Function to get the NikkeList (roster version) custom React component.
     * Turned into a function to allow access to be built in multiple areas (e.g. main page and sidebar menu)
     * without having to maintain two separate instances.
     * @returns An instance of a custom React component NikkeList (roster version.)
     */
    const getRoster = () => {
        return <NikkeList
            key={'roster'}
            section={nikkeLists.sections['roster']}
            nikkes={collectNikkes(filteredNikkes)}
            icons={Icons}
            avatars={NikkeAvatars}
            windowSmall={props.windowSmall}
            visibility={visibility}
            onMoveNikke={handleMoveNikke}
            targetCode={settings.targetCode}
            allowDuplicates={settings.allowDuplicates}
            nikkeData={NikkeData}
        />
    }

    return (
        <div className="page" style={{ fontSize: props.windowSmall ? '0.75rem' : '1rem' }}>
            {/* Side Menu Button */}
            {
                settings.compactMode ?
                    <Button
                        id='tb-side-roster-btn'
                        onClick={() => updateSettings('openSideRoster', true)}
                    >
                        <PersonSearchIcon />
                    </Button>
                    : null
            }
            {/* Page Title: prints states if debugMode is enabled */}
            <h1
                onClick={() => settings.debugMode ? console.log(nikkeLists, settings)
                    : null
                }
            >
                Nikke Team Builder
            </h1>

            {/* Page Header */}
            <div id='tb-header' className='flex-row'>
                {/* Help Button */}
                <Tooltip
                    title='Help'
                    placement='top'
                    arrow
                >
                    <IconButton
                        onClick={() => updateSettings('openHelp', true)}
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1976d2',
                                filter: 'saturate(60%)'
                            }
                        }}
                    >
                        <QuestionMark />
                    </IconButton>
                </Tooltip>
                <NikkeHelp
                    open={settings.openHelp}
                    onClose={() => updateSettings('openHelp', false)}
                />
                {/* Code Weakness */}
                <Select
                    id='quick-code-select'
                    value={settings.targetCode}
                    onChange={(event) => updateSettings('targetCode', event.target.value)}
                    // variant='standard'
                    // disableUnderline
                    IconComponent={null}
                    SelectDisplayProps={{
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0.1rem 0.253rem',
                            boxSizing: 'border-box'
                        }
                    }}
                    MenuProps={{
                        id: 'quick-code-menu'
                    }}
                    sx={{
                        ".MuiOutlinedInput-notchedOutline": { border: settings.targetCode === 'None' ? 0 : '1px solid gold' }
                    }}
                >
                    <MenuItem value='None'>
                        <img
                            className='sett-select-icon'
                            src={Icons.Blank}
                            alt='sett-select-None'
                        />
                    </MenuItem>
                    {
                        Tags.Code.map(code => {
                            return <MenuItem key={code} value={code}>
                                <img
                                    className={'sett-select-icon'}
                                    src={Icons.Code[code]}
                                    alt={'sett-select-' + code}
                                />
                            </MenuItem>
                        })
                    }
                </Select>
                {/* Edit Button */}
                <Tooltip
                    title='Edit Squads'
                    placement='top'
                    arrow
                >
                    <Button
                        id='edit-btn'
                        onClick={() => updateSettings('editable', !settings.editable)}
                        startIcon={settings.editable ? <DriveFileRenameOutlineSharpIcon /> : <Edit />}
                        color='inherit'
                        sx={{
                            outline: settings.editable ? '2px solid  #ffffffcc' : 0,
                            backgroundColor: settings.editable ? props.theme.palette.pumpkin.main : '#1976d2',
                            textDecoration: settings.editable ? 'underline 3px' : 'none',
                            '&:hover': {
                                backgroundColor: settings.editable ? props.theme.palette.pumpkin.main : '#1976d2',
                                filter: 'saturate(60%)',
                                textDecoration: settings.editable ? 'none' : 'underline 3px',
                            }
                        }}
                    >
                        Edit
                    </Button>
                </Tooltip>
                {/* Settings Button */}
                <Tooltip
                    title='Settings'
                    placement='top'
                    arrow
                >
                    <IconButton
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1976d2',
                                filter: 'saturate(60%)'
                            }
                        }}
                        onClick={() => updateSettings('openSettings', true)}
                    >
                        <Settings />
                    </IconButton>
                </Tooltip>
                {/* Settings Dialog */}
                <NikkeSettings
                    onClose={() => updateSettings('openSettings', false)}
                    settings={settings}
                    updateSettings={updateSettings}
                    windowSmall={props.windowSmall}
                    visibility={visibility}
                    setVisibility={setVisibility}
                    icons={Icons}
                    getSquadId={getSquadId}
                    copySquadIdToClipboard={copySquadIdToClipboard}
                    readSquadId={readSquadId}
                />
            </div>

            {/* Main Content */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div
                    id='squad-megacontainer'
                    style={{
                        gridTemplateColumns: 'repeat(' + settings.squadsPerRow + ', 1fr)',
                        gridTemplateRows: 'repeat(' + Math.ceil(nikkeLists.sectionOrder.length / settings.squadsPerRow) + ', min-content)',
                    }}
                >
                    {
                        nikkeLists.sectionOrder.map((sectionId, index) => {
                            let section = nikkeLists.sections[sectionId];

                            let nikkes = collectNikkes(section.nikkeIds);

                            return <div
                                className='squad-supercontainer flex-row'
                                key={sectionId}
                            >
                                {
                                    // Left edit buttons: Move Squad Up op Down
                                    settings.editable ?
                                        <div
                                            className='flex-column'
                                        >
                                            <Tooltip title='Move Squad up' placement='right' arrow>
                                                <IconButton
                                                    onClick={() => handleMoveSquad(sectionId, true)}
                                                    sx={{
                                                        maxWidth: '1.5rem',
                                                        maxHeight: '1.5rem',
                                                        backgroundColor: 'gray',
                                                        border: 'solid #ffffff77',
                                                        borderWidth: '1px 0 1px 1px',
                                                        borderRadius: '50% 0 0 50%'
                                                    }}
                                                ><KeyboardDoubleArrowUpIcon fontSize='small' /></IconButton></Tooltip>
                                            <Tooltip title='Move Squad down' placement='right' arrow>
                                                <IconButton
                                                    onClick={() => handleMoveSquad(sectionId, false)}
                                                    sx={{
                                                        maxWidth: '1.5rem',
                                                        maxHeight: '1.5rem',
                                                        backgroundColor: 'gray',
                                                        border: 'solid #ffffff77',
                                                        borderWidth: '1px 0 1px 1px',
                                                        borderRadius: '50% 0 0 50%'
                                                    }}
                                                ><KeyboardDoubleArrowDownIcon fontSize='small' /></IconButton></Tooltip>
                                        </div>
                                        : null
                                }
                                <NikkeSquad
                                    section={section}
                                    nikkes={nikkes}
                                    index={index}
                                    variant={
                                        (index === 0) ?
                                            'top'
                                            : (index === nikkeLists.sectionOrder.length - 1) ?
                                                'bottom'
                                                : 'middle'
                                    }
                                    icons={Icons}
                                    avatars={NikkeAvatars}
                                    windowSmall={props.windowSmall}
                                    visibility={visibility}
                                    onMoveNikke={handleMoveNikke}
                                    editable={settings.editable}
                                    onSquadTitleChange={handleSquadTitleChange}
                                    targetCode={settings.targetCode}
                                    enableReviews={settings.enableReviews}
                                    onSetSquadMinimized={handleSetSquadMinimized}
                                    theme={props.theme}
                                />
                                {
                                    settings.editable ?
                                        <div className='flex-column'
                                        >
                                            <Tooltip title='Delete Squad' placement='left' arrow>
                                                <IconButton
                                                    onClick={() => handleRemoveSquad(sectionId)}
                                                    sx={{
                                                        maxWidth: '1.5rem',
                                                        maxHeight: '1.5rem',
                                                        backgroundColor: '#c32020',
                                                        border: 'solid #ffffff77',
                                                        borderWidth: '1px 1px 1px 0',
                                                        borderRadius: '0 50% 50% 0'
                                                    }}
                                                ><DeleteForever fontSize='small' /></IconButton></Tooltip>
                                            <Tooltip title='Add Squad below' placement='left' arrow>
                                                <IconButton
                                                    onClick={() => handleAddSquad(index)}
                                                    sx={{
                                                        maxWidth: '1.5rem',
                                                        maxHeight: '1.5rem',
                                                        backgroundColor: '#209320',
                                                        border: 'solid #ffffff77',
                                                        borderWidth: '1px 1px 1px 0',
                                                        borderRadius: '0 50% 50% 0'
                                                    }}
                                                ><Add /></IconButton></Tooltip>
                                        </div>
                                        : null
                                }
                            </div>;
                        })
                    }
                </div>

                {/* Bench Section */}
                <NikkeList
                    key={'bench'}
                    section={nikkeLists.sections['bench']}
                    nikkes={collectNikkes(nikkeLists.sections['bench'].nikkeIds)}
                    icons={Icons}
                    avatars={NikkeAvatars}
                    windowSmall={props.windowSmall}
                    visibility={visibility}
                    onMoveNikke={handleMoveNikke}
                    targetCode={settings.targetCode}
                />


                {/* Filter Section, Main */}
                {settings.compactMode ? null : getFilter()}

                {/* Roster Section, Main */}
                {settings.compactMode ? null : getRoster()}

                <Drawer
                    id='tb-side-roster-menu'
                    open={settings.openSideRoster}
                    onClose={() => updateSettings('openSideRoster', false)}
                    PaperProps={{
                        sx: {
                            maxWidth: props.windowSmall ? '90vw' : '50vw'
                        }
                    }}
                >
                    {getFilter({ mainPage: true })}
                    {getRoster()}
                </Drawer>

            </DragDropContext >
        </div >
    )
}


export default NikkeTeamBuilder;