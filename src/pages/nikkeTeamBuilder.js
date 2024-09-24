import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import Drawer from '@mui/material/Drawer';
import { Popper, Slide, styled } from '@mui/material';

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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

// Import assets (cont.)
const NikkeAvatars = { ...getNikkeAvatars() };
const WINDOW_WIDTH_2_SQUADS = 1290;
const WINDOW_WIDTH_3_SQUADS = 1920
// Force-limit Squad parsing amount at 10 to limit parsing issues.
// (Arbitrary limit. Could be 5 (in-game max), but I bumped it up in case ppl want to share modifiable teams)
const URI_SQUAD_COUNT_LIMIT = 10;
// Force-limit Squad sizes to 10 to limit url length.
// (Arbitrary limit. Could be 5 (in-game max), but I bumped it up in case ppl want to share modifiable teams)
const URI_SQUAD_SIZE_LIMIT = 10;
// Force-limit Bench size to 50 to limit url length. (Arbitrary limit)
const URI_BENCH_SIZE_LIMIT = 50;

const StyledButton = styled(Button)({
    width: '5rem',
    height: '2.5rem',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'large',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#1976d2',
        filter: 'saturate(60%)'
    }
})

const StyledIconButton = styled(IconButton)({
    backgroundColor: '#1976d2',
    '&:hover': {
        backgroundColor: '#1976d2',
        filter: 'saturate(60%)'
    }
})

export const MinimizeButton = styled(Button)({
    minWidth: 'auto',
    maxWidth: '25%',
    height: '70%',
    position: 'absolute',
    right: 0,
    top: 0
});

function NikkeTeamBuilder(props) {
    let [searchParams, setSearchParams] = useSearchParams();

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
        // Application states
        editable: false,        // Can edit Squads.
        openSideRoster: false,  // Side menu (Filter+Rostera) is open.
        openHelp: false,        // Help dialog is open.
        openSettings: false,    // Settings dialog is open.
        rosterOverflow: false,  // Roster exceeds maxRosterSize.

        // User-configurable
        targetCode: 'None',     // The selected Code weakness (for reviews).
        enableReviews: true,    // Reviews is enabled.
        allowDuplicates: false, // Duplicate Nikkes are allowed.
        maxRosterSize: 32,      // Maximum Nikkes rendered in Roster.
        squadsPerRow: (window.innerWidth <= WINDOW_WIDTH_2_SQUADS) ? // Squads displayed per row. Initialized value depends on window size.
            1 : (window.innerWidth > WINDOW_WIDTH_3_SQUADS) ?
                3
                : 2,
        compactMode: 0,         // Whether filter and roster are at the bottom of the page (==0) or a side menu on the left (<0) or right (>0).
        debugMode: false        // Debug mode is enabled (for console printing data). Leave false unless editing.
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
   * Event fired when window is resized. Updates squadsPerRow in settings.
   */
    const handleResize = () => {
        if (window.innerWidth <= WINDOW_WIDTH_2_SQUADS) {
            updateSettings('squadsPerRow', 1);
        }
        else if (window.innerWidth > WINDOW_WIDTH_3_SQUADS) {
            updateSettings('squadsPerRow', 3);
        }
        else {
            updateSettings('squadsPerRow', 2);
        }
    }
    // window.addEventListener('resize', handleResize);

    /**
     * An array of allL Nikke IDs from NikkeData.
     */
    const allNikkeIds = NikkeData.map(item => item.Id);

    /**
     * Initial JSON Object containing...
     * squads: Each squad and their contained Nikkes.
     *  - title: Name displayed for Squads.
     *  - minimized: If true, the Squad's Nikkes and reviews are hidden.
     * broster: sections for Nikke management.
     *  - bench: A 'Favorites' for Nikke management. Easier to access for Squads, and (generally/initially) less crowded than Roster.
     *  - roster: Pool of all Nikkes. If they're not in a Squad or the Bench, they're in here whether rendered or not.
     *  - filtered roster (froster): Which of the Nikkes in the Roster will be rendered.
     * squadsOrder: An ordered Array of squads.
     */
    const initNikkeList = {
        squads: {
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
                minimized: false
            },
            'squad-3': {
                id: 'squad-3',
                title: 'Squad 3',
                nikkeIds: [],
                minimized: false
            }
        },
        broster: {
            'bench': {
                id: 'bench',
                title: 'Bench',
                nikkeIds: []
            },
            'roster': {
                id: 'roster',
                title: 'Roster',
                nikkeIds: [...allNikkeIds]
            },
            'froster': {
                id: 'froster',
                nikkeIds: [...allNikkeIds]
            }
        },
        squadOrder: ['squad-1', 'squad-2', 'squad-3']
    }

    // States for rendering icons and other components.
    // Visible components are rendered if true, and not rendered if false.
    // Visible components are minimized if -Min is true.
    const [visibility, setVisibility] = useState({
        // Iterable list of visibility keys for NikkeUnit.
        'categories': ['Code', 'Weapon', 'Class', 'Company'],

        'avatars': true,        // Whether Nikke Avatars are rendered or not.
        'allSquadsMin': false,  // Whether ALL the squad components are minimized.
        'filter': true,         // Whether the filter component is rendered at all.
        'filterMin': false,     // Whether the filter component is minimized.
        'benchMin': false,      // Whether the Bench and Roster components are minimized, respectively.
        'rosterMin': false,
        'categoryIcons': true,  // If false, shrinks NikkeUnit and skips rendering of the bottom four icons.
        'squadClean': true,      // Whether the quick-move (+/-) and info (i) buttons are rendered in Squads.
        'unitDetails': false,    // Whether the popper for a NikkeUnit is visible or not.

        // Icons that can be hidden if false
        'Burst': true,
        'Burst Cooldown': true,
        'Class': true,
        'Code': true,
        'Company': true,
        'Weapon': true,
        'Rarity': true
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
        if (dstSectionId === srcSectionId && dstIndex === srcIndex)
            return;

        // Initialize booleans to determine which lists should be updated.
        let srcIsBroster = (srcSectionId === 'bench' || srcSectionId === 'roster')
        let dstIsBroster = (dstSectionId === 'bench' || dstSectionId === 'roster')

        // Get the object data corresponding to the resulting source and destination sections.
        let srcSection = nikkeList.broster[srcSectionId];
        let dstSection = nikkeList.broster[dstSectionId];

        // If either are null, then the section is a squad that needs to be fetched and we should update squads.
        if (srcSection == null || dstSection == null) {
            if (srcSection == null)
                srcSection = nikkeList.squads[srcSectionId];
            if (dstSection == null)
                dstSection = nikkeList.squads[dstSectionId];
        }

        // Used for refiltering the roster since I can't just use state.
        let rosterIdsCopy = [];
        let newNikkeList = { ...nikkeList }

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
            if (srcIsBroster)
                newNikkeList.broster[srcSectionId] = newSection;
            else
                newNikkeList.squads[srcSectionId] = newSection;
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
                    if (compareNikkeObjects(srcNikke, midNikke))
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
            rosterIdsCopy = dstNikkeIds;

            // Create new section using old section's data, but replacing new Nikke IDs.
            let newSrcSection = {
                ...srcSection,
                nikkeIds: srcNikkeIds
            };

            let newDstSection = {
                ...dstSection,
                nikkeIds: dstNikkeIds
            };

            // Set data to use new information. (Destination is roster)
            if (srcIsBroster) {
                newNikkeList.broster[srcSectionId] = newSrcSection;
                newNikkeList.broster.roster = newDstSection;
            }
            else {
                newNikkeList.squads[srcSectionId] = newSrcSection;
                newNikkeList.broster.roster = newDstSection;
            }
        }
        // If transferring between different sections.
        else {
            // Create an array of object IDs
            let srcNikkeIds = Array.from(srcSection.nikkeIds);
            let dstNikkeIds = Array.from(dstSection.nikkeIds);

            // If the moving Nikke is from Roster, it might be filtered and so
            // we'll have to find the proper src index inside of roster, not the filtered roster
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
            };

            let newDstSection = {
                ...dstSection,
                nikkeIds: dstNikkeIds
            };

            // Set data to use new information
            // If src Section is broster, update Broster. Otherwise, update Squad.
            // Likewise with dst Section.
            if (srcIsBroster) {
                newNikkeList.broster[srcSectionId] = newSrcSection;
            } else {
                newNikkeList.squads[srcSectionId] = newSrcSection;
            }

            if (dstIsBroster) {
                newNikkeList.broster[dstSectionId] = newDstSection;
            } else {
                newNikkeList.squads[dstSectionId] = newDstSection;
            }

        }


        // Update filter if roster is involved.
        if (srcSectionId === 'roster' || dstSectionId === 'roster')
            handleFilter(filter, rosterIdsCopy);
        // Set new lists.
        setNikkeList(newNikkeList);
        // If Squads were updated, update squad dependents.
        if (!(srcIsBroster && dstIsBroster))
            updateSquadDependents();
    }

    /**
     * Compares two Nikke objects akin to nikke1 < nikke2 for the sake of Roster order (by Rarity then Alphabetical).
     * If their Rarities differ, return whether nikke1's Rarity is 'smaller' (SSR < SR < R).
     * Otherwise, return whether nikke1's Name is 'smaller' (A < ... < Z).
     * @param {object} nikke1 Left-side Nikke object.
     * @param {object} nikke2 Right-side Nikke object.
     * @returns true if nikke1 should be considered 'less than' nikke2.
     */
    const compareNikkeObjects = (nikke1, nikke2) => {
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
     * Filters an array of Nikke IDs to overwrite froster for rendering the Roster.
     * 
     * @param {object} inputFilter JSON Object of filterable tags. Defaults to state filter.
     * @param {Array<string>} inputIds String Array of Nikke IDs. Defaults to state roster IDs.
     * @param {boolean} overrideMaxRoster true if filter should ignore maxRosterSize. Defaults to false.
     * @param {object} inputSettings JSON Object of settings to be read and updated. Defaults to state settings.
     */
    const handleFilter = (inputFilter = filter, inputIds = nikkeList.broster.roster.nikkeIds, overrideMaxRoster = false, inputSettings = { allowDuplicates: settings.allowDuplicates, maxRosterSize: settings.maxRosterSize }) => {
        // Update filter state.
        setFilter({ ...inputFilter });
        // Initialize new filtered Nikke list and setting options.
        let newFilteredNikkes = [];
        let allowDuplicates = inputSettings.allowDuplicates == null ? settings.allowDuplicates : inputSettings.allowDuplicates;
        let maxRosterSize = inputSettings.maxRosterSize == null ? settings.maxRosterSize : inputSettings.maxRosterSize;

        // If allowDuplicates is active, use entire Nikke ID list as the input.
        if (allowDuplicates)
            inputIds = allNikkeIds;

        // Some easter eggs / meme filters. See else for normal filtering.
        if (inputFilter.Name.toLowerCase() === 'best girl') {
            newFilteredNikkes = [...allNikkeIds];
        }
        else if (inputFilter.Name.toLowerCase() === 'real best girl') {
            newFilteredNikkes = [53, 107];   // Scarlet and Scarlet: BS
        }
        // Otherwise, filter as normal.
        else {
            // Run Nikke roster through filter.
            // - Return true if nikke matches filter.
            newFilteredNikkes = inputIds.filter(nikkeId => {
                let nikke = getNikkeById(nikkeId);

                // If Name is being filtered, check if Nikke's name or title matches.
                if (inputFilter.Name != null && inputFilter.Name.length > 0) {
                    // Create RegExp using filter. Using Start of String (^) and forcing filter to lowercase.
                    let regex = new RegExp('^' + inputFilter.Name.toLowerCase())
                    // Check regex to nikke Name, if nothing is returned then reject Nikke.
                    // If Nikke has a Title, check if at least one of title or name matches.
                    if (
                        (
                            nikke.Title == null
                            && regex.exec(nikke.Name.toLowerCase()) == null
                        )
                        || (
                            nikke.Title != null
                            && regex.exec(nikke.Title.toLowerCase()) == null
                            && regex.exec(nikke.Name.toLowerCase()) == null
                        )
                    )
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
            });
        }

        // Initialize newSettings to overwrite rosterOverflow and maxRosterSize.
        let newSettings = {
            ...settings,
            allowDuplicates: allowDuplicates,
            maxRosterSize: maxRosterSize,
            rosterOverflow: false
        };
        // Limit filtered list to maxRosterSize and update rosterOverflow accordingly.
        if (!overrideMaxRoster && newFilteredNikkes.length > maxRosterSize) {
            newFilteredNikkes = newFilteredNikkes.slice(0, maxRosterSize - 1);
            newSettings = {
                ...newSettings,
                rosterOverflow: true
            };
        }

        // Update FilteredNikkes array and Settings.
        nikkeList.broster.froster.nikkeIds = newFilteredNikkes;
        setSettings(newSettings);
    }

    /**
     * Filters the current roster with the current filter state, but calls to override the maxRosterSize limit.
     */
    const overrideMaxRoster = () => {
        handleFilter(filter, nikkeList.broster.roster.nikkeIds, true);
    }

    /**
     * Adds a new Squad into sections. The new Squad's placement in sectionOrder is dependent on the given index.
     * ID and Name of the new Squad is dependent on the state squadCt regardless of its index and the quantity of current Squads.
     * @param {number} index Index for the new Squad.
     */
    const handleAddSquad = (index) => {
        // Create new section id and a new section object using Squad Count.
        // Need to increment because concurrency still reads Squad Count as pre-increment
        let newSquadId = 'squad-' + (squadCt + 1);
        let newSquadTitle = 'Squad ' + (squadCt + 1);
        setsquadCt(squadCt + 1);

        // Create new section order array by inserting the new section id in the index slot.
        let newSquadOrder = nikkeList.squadOrder;
        newSquadOrder.splice(index, 0, newSquadId);

        // Update information. Be sure to use brackets around [newSectionId] to ensure it uses variable for name.
        setNikkeList({
            squads: {
                ...nikkeList.squads,
                [newSquadId]: {
                    id: newSquadId,
                    title: newSquadTitle,
                    nikkeIds: [],
                    minimized: false
                }
            },
            broster: { ...nikkeList.broster },
            squadOrder: newSquadOrder
        });
    }

    /**
     * Deletes a Squad from sections. If the Squad has Nikkes, dump them into Bench.
     * If attempting to remove the last Squad, reset Squad section information including squadCt.
     * @param {string} squadId ID value of the Squad to be deleted.
     */
    const handleRemoveSquad = (squadId) => {
        // Copy NikkeList's sections.
        let newNikkeList = { ...nikkeList };

        let squadEmpty = nikkeList.squads[squadId].nikkeIds.length === 0;

        // Unload the Squad's nikkeIds so that we don't lose any units. Place them into bench.
        nikkeList.squads[squadId].nikkeIds.forEach(nikkeId =>
            newNikkeList.broster.bench.nikkeIds.push(nikkeId)
        );

        // Deny removal if there is only one squad left.
        // Though not necessary, I'm gonna instead reset Squad Counter to 1 and replace last squad with a 'squad-1'.
        if (nikkeList.squadOrder.length === 1) {
            setsquadCt(1);
            // Doesn't work to just use handleAddSquad(0) here. Seems to be a concurrency issue with states.

            // Update information
            setNikkeList({
                squads: {
                    'squad-1': {
                        id: 'squad-1',
                        title: 'Squad 1',
                        nikkeIds: [],
                        minimized: false
                    },
                },
                broster: { ...nikkeList.broster },
                squadOrder: ['squad-1']
            });
            return;
        }

        // Remove/Delete the target section data.
        delete newNikkeList.squads[squadId];

        // Create a new section order array.
        // Use single for-loop and check name to reduce time, compared to searching for index and removing element.
        newNikkeList.squadOrder = [];
        nikkeList.squadOrder.forEach(squId => {
            if (squId !== squadId)
                newNikkeList.squadOrder.push(squId);
        })

        // Update information and squad dependents.
        setNikkeList(newNikkeList);
        if (!squadEmpty)
            updateSquadDependents();
    }

    /**
    * Empties all Squads of Nikkes. Any Nikkes removed from a Squad will be dumped into Bench.
    * Does not directly affect other Squad states such as Squad titles and minimization.
    */
    const handleResetAllSquads = () => {
        // Copy NikkeList's squads and bench.
        let newSquads = nikkeList.squads;
        let newBenchIds = nikkeList.broster.bench.nikkeIds;

        // Loop through each Squad
        nikkeList.squadOrder.forEach(sectionId => {
            // Unload a Squad's nikkeIds into Bench so that we don't lose any units. 
            newSquads[sectionId].nikkeIds.forEach(nikkeId =>
                newBenchIds.push(nikkeId)
            );

            // Set Squad's nikkeIds to be empty.
            newSquads[sectionId].nikkeIds = [];
        })

        // Update nikkeList and squad dependents.
        let newNikkeList = {
            squads: newSquads,
            broster: {
                ...nikkeList.broster,
                bench: {
                    ...nikkeList.broster.bench,
                    nikkeIds: newBenchIds
                }
            },
            squadOrder: nikkeList.squadOrder
        };

        setNikkeList(newNikkeList);
        updateSquadDependents();
    }

    /**
     * Swaps the position of the given Squad upward (towards index 0) or downward (towards index N).
     * @param {string} squadId ID value of the section being moved.
     * @param {boolean} ifMoveUp true if moving 'upward' (towards index 0), false otherwise.
     */
    const handleMoveSquad = (squadId, ifMoveUp = false) => {
        // If only squad, return.
        if (nikkeList.squadOrder.length === 1)
            return;

        let newSquadOrder = nikkeList.squadOrder;

        // Grab initial indices.
        let srcIndex = newSquadOrder.indexOf(squadId);
        let dstIndex = ifMoveUp ? (srcIndex - 1) : (srcIndex + 1);

        // If attempting to move outside of range, move to opposite end.
        if (dstIndex === -1)
            dstIndex = newSquadOrder.length - 1;
        else if (dstIndex === newSquadOrder.length)
            dstIndex = 0;

        // Perform simple array swap.
        newSquadOrder[srcIndex] = newSquadOrder[dstIndex];
        newSquadOrder[dstIndex] = squadId;

        // Update sectionOrder and squad dependents.
        setNikkeList({
            ...nikkeList,
            squadOrder: newSquadOrder
        })
        updateSquadDependents();
    }

    /**
     * Updates the title to be displayed on a given Squad.
     * @param {string} squadId ID value of the Squad whose name is being changed. 
     * @param {string} title String value to update the title.
     */
    const handleSquadTitleChange = (squadId, title) => {
        setNikkeList({
            ...nikkeList,
            squads: {
                ...nikkeList.squads,
                [squadId]: {
                    ...nikkeList.squads[squadId],
                    title: title
                }
            }
        });
    }

    /**
     * Sets the minimization of a given section.
     * 
     * @param {string} squadId ID value of the affected Squad.
     * @param {boolean} bool true if Squad is to be minimized.
     */
    const handleSetSquadMinimized = (squadId, bool) => {
        // Use allMin to check if all the squads are minimized.
        let allMin = bool;

        // If we're setting minimized to true, check if all other squads are minimized.
        if (allMin) {
            for (let i = 0; i < nikkeList.squadOrder.length; i++) {
                let squadId = nikkeList.squadOrder[i];
                if (squadId !== squadId && !nikkeList.squads[squadId].minimized) {
                    allMin = false;
                    break;
                }
            }
        }

        // Update visibility
        setVisibility({
            ...visibility,
            allSquadsMin: allMin
        });

        // Update the given Squad's minimized to bool.
        setNikkeList({
            ...nikkeList,
            squads: {
                ...nikkeList.squads,
                [squadId]: {
                    ...nikkeList.squads[squadId],
                    minimized: bool
                }
            }
        });
    }

    /**
     * Sets the minimization of all Squads. Updates allSquadsMin in visibility.
     * 
     * @param {boolean} bool true if all Squads are to be minimized.
     */
    const handleSetAllSquadsMinimized = (bool) => {
        let newSquads = { ...nikkeList.squads };

        // Loop through all squads and set their minimized status to bool.
        for (let i = 0; i < nikkeList.squadOrder.length; i++) {
            newSquads[nikkeList.squadOrder[i]].minimized = bool;
        }

        // Update nikkeList and visibility.
        setNikkeList({
            ...nikkeList,
            squads: newSquads,
        })

        setVisibility({
            ...visibility,
            allSquadsMin: bool
        })
    }

    /**
         * Converts the query in the URI into a list information. Called and used when page is loaded and lists are initialized.
         * Query format functions as follows:
         * - Keys available: 'squads' and 'bench'.
         * - Squads are valued as a set of sets of IDs.
         * - Bench is valued as a set of IDs.
         * - (Squads) Sets of IDs or distinct Squads are separated by '_'.
         * - (Squads and Bench) IDs or distinct Nikkes are separated by '-'.
         * 
         * Examples:
         * - squads=31-53-93-26-63_38-85-86-68-131_100-99-74-104-102_83-118-107-20-50_97-116-114-46-89
         * - squads=31-53-93-26-63_38-85-86-68-131_100-99-74-104-102_83-118-107-20-50_97-116-114-46-89&bench=130-125-119-113-110-98-91-84-59-55-49-48-45-34-23
         * - bench=130-125-119-113-110-98-91-84-59-55-49-48-45-34-23
         * 
         * Returns null if the dynamic URL is invalid.
         * @returns A new nikkeList based on the dynamic URL, if possible. If dynamic URL is invalid, returns null.
         */
    const readUriQuery = (squadQuery, benchQuery) => {
        // Try/catch block in case split fails or something unexpected occurs.
        // Simplest catch-all in case of invalid URI query.
        try {
            // If both squadQuery and benchQuery are empty, return null.
            if ((squadQuery == null || squadQuery.length === 0)
                && (benchQuery == null || benchQuery.length === 0))
                return null;

            // Initialize temp information for building the new nikkeList.
            let newSquads = {};
            let newSquadOrder = [];
            let newBenchIds = initNikkeList.broster.bench.nikkeIds;
            let newRosterIds = initNikkeList.broster.roster.nikkeIds;

            // If squadQuery isn't empty, parse through it.
            if (squadQuery != null && squadQuery.length !== 0) {
                // Separate squads by '_'.
                let squads = squadQuery.split('_');
                // Squad counter for ids and titles.
                let squadIndex = 1;
                // Force-limit squad count to [10](URI_SQUAD_COUNT_LIMIT). (See constant for more details.)
                let squadCtLimit = Math.min(squads.length, URI_SQUAD_COUNT_LIMIT)

                // Loop through Squad strings.
                for (let i = 0; i < squadCtLimit; i++) {
                    // Force-limit squad sizes to [10](URI_SQUAD_SIZE_LIMIT). (See constant for more details.)
                    let newNikkeIds = nikkeIdsStringToArray(squads[i], URI_SQUAD_SIZE_LIMIT, newRosterIds);
                    if (newNikkeIds == null)
                        continue;

                    // After looping through Nikkes, update temp information for newNikkeList and increment squadIndex.
                    newSquads = {
                        ...newSquads,
                        ['squad-' + squadIndex]: {
                            id: 'squad-' + squadIndex,
                            title: 'Squad ' + squadIndex,
                            nikkeIds: newNikkeIds,
                            minimized: false
                        }
                    };
                    newSquadOrder.push('squad-' + squadIndex);
                    squadIndex += 1;
                }
            }
            // If squadQuery is empty, use initNikkeList information
            else {
                newSquads = initNikkeList.squads;
                newSquadOrder = initNikkeList.squadOrder;
            }

            // If benchQuery isn't empty, parse through it.
            if (benchQuery != null && benchQuery.length !== 0) {
                // Force-limit bench sizes to [50](URI_BENCH_SIZE_LIMIT). (See constant for more details.)
                let newNikkeIds = nikkeIdsStringToArray(benchQuery, URI_BENCH_SIZE_LIMIT, newRosterIds);

                // After looping through Nikkes, update temp information for newNikkeList
                if (newNikkeIds != null) {
                    newBenchIds = newNikkeIds;
                }
            }

            // After looping though Squads and Bench, build and return the new initial nikkeList
            return {
                squads: newSquads,
                broster: {
                    ...initNikkeList.broster,
                    bench: {
                        ...initNikkeList.broster.bench,
                        nikkeIds: newBenchIds
                    },
                    roster: {
                        ...initNikkeList.broster.roster,
                        nikkeIds: newRosterIds
                    }
                },
                squadOrder: newSquadOrder
            };
        }
        // If we ever throw/catch an error, log it and return null.
        catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Converts a string of nikkeIds separated by '-' into an array of nikkeIds.
     * @param {string} inputString String of a series of NikkeIds, separated by '-', to be converted.
     * @param {number} maxLength Maximum amount of Nikkes to be returned. If negative, there is no limit.
     * @param {Array} rosterIds Array of Nikkes in the Roster. Nikkes found in inputString are removed from here.
     * @returns A corresponding array of nikkeIds.
     */
    const nikkeIdsStringToArray = (inputString, maxLength, rosterIds = []) => {
        // If the input is empty, return null.
        if (inputString == null || inputString.length === 0)
            return null;

        // Split up Nikke IDs.
        let stringIds = inputString.split('-');

        // Initialize nikkeIds array.
        let nikkeIds = [];
        // Limit parsing to maxLength. (Arbitrary decision, but I want to limit URL sizes).
        // If maxLength is negative, set limit stringIds.length.
        let sizeLimit = Math.min(stringIds.length, maxLength);
        if (sizeLimit < 0)
            sizeLimit = stringIds.length;

        // Loop through Nikke Id strings.
        for (let i = 0; i < sizeLimit; i++) {
            // Check to see if Nikke ID exists. Throw exception if not found.
            // let nikke = getNikkeById(stringIds[j]);
            // if (nikke == null)
            //     throw new Error('Squad Code Importer: Nikke ID ', stringIds[j], ' not found');
            // let nikkeId = nikke.Id;
            let nikkeId = stringIds[i];

            // Push Nikke's Id to array
            nikkeIds.push(nikkeId);

            // Remove from Roster, if it exists
            let nikkeIndex = rosterIds.indexOf(nikkeId);
            if (nikkeIndex !== -1)
                rosterIds.splice(nikkeIndex, 1);
        }

        // After looping through Nikkes, return array.
        return nikkeIds;

    }

    /**
     * Converts an array of nikkeIds into a string of nikkeIds separated by '-'.
     * @param {string} inputArray Array of NikkeIds to be converted.
     * @param {number} maxLength Maximum amount of Nikkes to be returned. If negative, there is no limit.
     * @returns A corresponding string of nikkeIds.
     */
    const nikkeIdsArrayToString = (inputArray, maxLength) => {
        // Initialize nikkeIds string
        let nikkeIds = '';

        // [ADDD COMMENT]
        let sizeLimit = Math.min(inputArray.length, maxLength)
        // Loop through each Nikke in a Squad.
        for (let i = 0; i < sizeLimit; i++) {
            // Fetch Nikke Id
            let nikkeId = inputArray[i];

            // Append Nikke ID. Seperate Nikkes by '-'.
            if (i !== 0)
                nikkeIds += '-';
            nikkeIds += nikkeId;
        }

        // After looping, return string value of nikkeIds
        return nikkeIds;
    }

    // Collection of Nikkes to be used and altered, managing where a given Nikke is located.
    const [nikkeList, setNikkeList] = useState(initNikkeList);

    // How many squads have been created? Different than how many squads are there currently.
    // Important for making sure squad-ids don't overlap.
    const [squadCt, setsquadCt] = useState(initNikkeList.squadOrder.length);

    /**
     * Converts current Squad and Bench information into a shareable link and copies contents into system clipboard.
     * For details on how queries are formatted/parsed/processed, see readUriQuery().
     * 
     * @param {boolean} benchWanted if true, includes the bench in the returned query
     * @returns a query depending on the Squads and Bench.
     */
    const getUriQuery = (benchWanted = false, inputList = {}) => {
        // Initialize squadQuery and benchQuery.
        let squadQuery = '';
        let benchQuery = '';

        // Fetch List objects. Convert to inputList, if necessary.
        let squads = nikkeList.squads;
        let bench = nikkeList.broster.bench;
        let squOrder = nikkeList.squadOrder;
        if (Object.keys(inputList).length !== 0) {
            squads = inputList.squads;
            bench = inputList.broster.bench;
            squOrder = inputList.squadOrder;
        }

        // Force-limit squad sizes to [10](URI_SQUAD_COUNT_LIMIT). (See constant for more details.)
        let squadCtLimit = Math.min(squOrder.length, URI_SQUAD_COUNT_LIMIT)

        // Loop through each Squad.
        for (let i = 0; i < squadCtLimit; i++) {
            // Fetch Squad
            let squad = squads[squOrder[i]];

            // If Squad doesn't exist or is empty, boost limit (if possible) and skip.
            if (squad == null || squad.nikkeIds.length === 0) {
                squadCtLimit = Math.min(squOrder.length, squadCtLimit + 1)
                continue;
            }

            // Separate Squads by '_'.
            if (squadQuery.length !== 0)
                squadQuery += '_';

            // Force-limit squad sizes to [10](URI_SQUAD_SIZE_LIMIT). (See constant for more details.)
            // Convert array of Nikkes into a string and append.
            let nikkeIds = nikkeIdsArrayToString(squad.nikkeIds, URI_SQUAD_SIZE_LIMIT);
            squadQuery += nikkeIds;
        }

        // After looping through Squads, get Bench if wanted
        if (benchWanted && bench.nikkeIds.length > 0) {
            // Copy nikkeIDs in Bench. Truncate if too large. (See below for more details.)
            let benchArr = [...bench.nikkeIds];
            if (benchArr.length > URI_BENCH_SIZE_LIMIT)
                benchArr = benchArr.slice(0, URI_BENCH_SIZE_LIMIT)

            // Sort bench for consistency.
            benchArr.sort((a, b) => (compareNikkeObjects(getNikkeById(a), getNikkeById(b)) ? -1 : 1));

            // Force-limit bench sizes to [10](URI_BENCH_SIZE_LIMIT). (See constant for more details.)
            // Convert array of Nikkes into a string and append.
            let nikkeIds = nikkeIdsArrayToString(benchArr, URI_BENCH_SIZE_LIMIT);
            benchQuery += nikkeIds;
        }

        // Prepend query keys (squads and bench)
        if (squadQuery.length > 0)
            squadQuery = 'squads=' + squadQuery;
        if (benchQuery.length > 0)
            benchQuery = 'bench=' + benchQuery;

        // Build complete query depending on individual query lengths and return query
        // (Note: Could be made to use like a queue of some sort, but I'm only using two keys for now, so this is enough.)
        let query = '';
        if (squadQuery.length > 0 && benchQuery.length > 0)
            query = squadQuery + '&' + benchQuery;
        else if (squadQuery.length > 0 && benchQuery.length === 0)
            query = squadQuery;
        else if (squadQuery.length === 0 && benchQuery.length > 0)
            query = benchQuery;

        return query;
    }

    /**
     * Updates browser URL to match the current query, built from Squads and no Bench.
     * @param {object} inputList input nikkeList to use instead of the existing one. May be used to avoid concurrency issues.
     */
    const updateUriQuery = (inputList = {}) => {
        let query = getUriQuery(false, inputList);

        // Update current url to match SquadId
        if (query.length === 0)
            window.history.pushState(null, '', ('#/apps/nikke-team-builder'));
        else
            window.history.pushState(null, '', ('#/apps/nikke-team-builder?' + query));
    }

    /**
     * Converts the current Squads into a shareable code and copies the string onto the user's system's clipboard.
     */
    const copyUriQueryToClipboard = (benchWanted = false) => {
        // Add this when dynamic url is fixed: ''
        let query = getUriQuery(benchWanted);

        if (query.length === 0)
            navigator.clipboard.writeText('ewjosh.github.io/#/apps/nikke-team-builder');
        else
            navigator.clipboard.writeText('ewjosh.github.io/#/apps/nikke-team-builder?' + query);
    }

    /**
     * Function to get the NikkeFilter custom React component.
     * Turned into a function to allow access to be built in multiple areas (e.g. main page and sidebar menu)
     * without having to maintain two separate instances.
     * 
     * @param {object} additionalProps Props to be added to the component in a JSON format. 
     * @returns An instance of a custom React component NikkeFilter.
     */
    const getFilter = (additionalProps) => {
        if (visibility.filter)
            return <NikkeFilter
                filter={filter}
                onFilter={(inputFilter) => handleFilter(inputFilter)}
                icons={Icons}
                windowSmall={props.windowSmall}
                windowLarge={props.windowLarge}
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
     * 
     * @param {object} additionalProps Props to be added to the component in a JSON format. 
     * @returns An instance of a custom React component NikkeList (roster version.)
     */
    const getRoster = (additionalProps) => {
        return <NikkeList
            key={'roster'}
            section={nikkeList.broster.roster}
            nikkes={collectNikkes(nikkeList.broster.froster.nikkeIds)}
            icons={Icons}
            avatars={NikkeAvatars}
            windowSmall={props.windowSmall}
            visibility={visibility}
            toggleListMin={() => setVisibility({
                ...visibility,
                rosterMin: !visibility.rosterMin
            })}
            compactMode={settings.compactMode}
            openSideMenu={() => updateSettings('openSideRoster', true)}
            onMoveNikke={handleMoveNikke}
            targetCode={settings.targetCode}
            allowDuplicates={settings.allowDuplicates}
            rosterOverflow={settings.rosterOverflow}
            overrideMaxRoster={overrideMaxRoster}
            nikkeData={NikkeData}
            {...additionalProps}
        />
    }

    /**
     * Called on component mount/load (empty dependency).
     * - Initializes Squad and Bench according to URI's Query.
     * - Enforces new URL over old URL.
     * - Adds the resize listener (once) without overwriting the one in the parent App.js.
     * - Calls to update Roster using Filter.
     */
    useEffect(() => {
        // Initialize nikkeList through dynamic URL upon page startup.
        // Also enforce the new URL (nikke-team-builder) over the old URL (nikkeTeamBuilder).
        let listById = readUriQuery(searchParams.get('squads'), searchParams.get('bench'));

        if (listById != null) {
            setNikkeList(listById);
            setsquadCt(listById.squadOrder.length);
            window.history.replaceState(null, '', '#/apps/nikke-team-builder?' + searchParams.toString());
        }
        else
            window.history.replaceState(null, '', '#/apps/nikke-team-builder');

        // Add additional eventListener for window resizing.
        window.addEventListener('resize', handleResize);

        // Call RosterDependents to Filter.
        updateRosterDependents();
    }, [])

    /**
     * Called (explicitly) whenever Squads or squadOrder are updated.
     * Updates browser's URL (queries) to match current Squad status.
     * @param {object} inputList JSON Object of the nikkeList to be used for concurrency.
     */
    const updateSquadDependents = (inputList = {}) => {
        updateUriQuery(inputList);
    }

    /**
     * Called (explicitly) whenever Roster is updated.
     * Updates Roster according to Filter.
     * @param {object} inputSettings JSON Object of the settings to be used for concurrency and updating.
     */
    const updateRosterDependents = (inputSettings = { allowDuplicates: settings.allowDuplicates, maxRosterSize: settings.maxRosterSize }) => {
        handleFilter(filter, nikkeList.broster.roster.nikkeIds, false, inputSettings);
    }

    return (
        <div className="page" style={{ fontSize: props.windowSmall ? '0.75rem' : '1rem' }}>
            {/* Side Menu Button */}
            {
                settings.compactMode !== 0 && !settings.openSideRoster ?
                    <Button
                        id='tb-side-roster-btn'
                        className={settings.compactMode < 0 ? 'position-left' : 'position-right'}
                        onClick={() => updateSettings('openSideRoster', true)}
                        sx={{
                            borderWidth: settings.compactMode < 0 ?
                                '2px 2px 2px 0' : '2px 0 2px 2px',
                            borderRadius: settings.compactMode < 0 ?
                                '0 0.25rem 0.25rem 0' : '0.25rem 0 0 0.25rem'
                        }}
                    >
                        <PersonSearchIcon />
                    </Button>
                    : null
            }
            {/* Page Title: prints states if debugMode is enabled */}
            <h1
                onClick={() => settings.debugMode ? console.log(nikkeList, nikkeList.broster, settings, visibility)
                    : null
                }
            >
                Nikke Team Builder
            </h1>

            {/* Page Header */}
            <div id='tb-header' className='flex-column'>
                <div className='flex-row'>
                    {/* Help Button */}
                    <Tooltip
                        title='Help'
                        placement='top'
                        arrow
                    >
                        <StyledIconButton
                            onClick={() => updateSettings('openHelp', true)}
                        >
                            <QuestionMark />
                        </StyledIconButton>
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
                    {/* Settings Button */}
                    <Tooltip
                        title='Settings'
                        placement='top'
                        arrow
                    >
                        <StyledIconButton
                            onClick={() => updateSettings('openSettings', true)}
                        >
                            <Settings />
                        </StyledIconButton>
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
                        getSquadId={getUriQuery}
                        copyUriQueryToClipboard={copyUriQueryToClipboard}
                        readSquadId={readUriQuery}
                        updateRosterDependents={updateRosterDependents}
                    />
                </div>
                <div id='squad-control-panel' className='flex-row'>
                    {/* Append Squad Button */}
                    {
                        settings.editable ? <Tooltip title='Append Squad' placement='top' arrow>
                            <StyledIconButton
                                onClick={() => handleAddSquad(nikkeList.squadOrder.length)}
                                sx={{
                                    backgroundColor: '#209320',
                                    '&:hover': {
                                        backgroundColor: '#209320'
                                    }
                                }}
                            ><Add />
                            </StyledIconButton>
                        </Tooltip>
                            : null
                    }
                    {/* Edit Button */}
                    <Tooltip
                        title='Edit Squads'
                        placement='top'
                        arrow
                    >
                        <StyledButton
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
                        </StyledButton>
                    </Tooltip>
                    {/* Squads Minimize Button */}
                    <Tooltip
                        title={visibility.allSquadsMin ? 'Expand All Squads' : 'Collapse All Squads'}
                        placement='top'
                        arrow
                    >
                        <StyledButton
                            onClick={() => handleSetAllSquadsMinimized(!visibility.allSquadsMin)}
                            color='inherit'
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    filter: 'saturate(60%)',
                                }
                            }}
                        >
                            <RecentActorsIcon />
                            {
                                visibility.allSquadsMin ?
                                    <ArrowDropUpIcon />
                                    : <ArrowDropDownIcon />
                            }
                        </StyledButton>
                    </Tooltip>
                    {/* Empty Squads Button */}
                    {
                        settings.editable ? <Tooltip title='Empty Squads' placement='top' arrow>
                            <StyledIconButton
                                onClick={handleResetAllSquads}
                                sx={{
                                    backgroundColor: '#c32020',
                                    '&:hover': {
                                        backgroundColor: '#c32020'
                                    }
                                }}
                            ><SettingsBackupRestoreIcon />
                            </StyledIconButton>
                        </Tooltip>
                            : null
                    }
                </div>
            </div>

            {/* Main Content */}
            <DragDropContext onDragEnd={onDragEnd}>
                {/* Squad Section */}
                <div
                    id='squad-megacontainer'
                    style={{
                        gridTemplateColumns: 'repeat(' + settings.squadsPerRow + ', 1fr)',
                        gridTemplateRows: 'repeat(' + Math.ceil(nikkeList.squadOrder.length / settings.squadsPerRow) + ', min-content)',
                    }}
                >
                    {
                        nikkeList.squadOrder.map((squadId, index) => {
                            let squad = nikkeList.squads[squadId];
                            let nikkes = collectNikkes(squad.nikkeIds);

                            return <div
                                className='squad-supercontainer flex-row'
                                key={squadId}
                            >
                                {
                                    // Left edit buttons: Move Squad Up op Down
                                    settings.editable ?
                                        <div
                                            className='flex-column'
                                        >
                                            <Tooltip title='Move Squad up' placement='right' arrow>
                                                <IconButton
                                                    onClick={() => handleMoveSquad(squadId, true)}
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
                                                    onClick={() => handleMoveSquad(squadId, false)}
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
                                    section={squad}
                                    nikkes={nikkes}
                                    index={index}
                                    variant={
                                        (index === 0) ?
                                            'top'
                                            : (index === nikkeList.squadOrder.length - 1) ?
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
                                                    onClick={() => handleRemoveSquad(squadId)}
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
                                                    onClick={() => handleAddSquad(index + 1)}
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
                    section={nikkeList.broster.bench}
                    nikkes={collectNikkes(nikkeList.broster.bench.nikkeIds)}
                    icons={Icons}
                    avatars={NikkeAvatars}
                    windowSmall={props.windowSmall}
                    visibility={visibility}
                    toggleListMin={() => setVisibility({
                        ...visibility,
                        benchMin: !visibility.benchMin
                    })}
                    compactMode={settings.compactMode}
                    onMoveNikke={handleMoveNikke}
                    targetCode={settings.targetCode}
                />


                {/* Filter Section, Main */}
                {settings.compactMode !== 0 ? null : getFilter({ mainPage: true })}

                {/* Roster Section, Main */}
                {
                    settings.compactMode !== 0 ?
                        <Button
                            id='tb-side-roster-btn'
                            className='nikke-list-container'
                            onClick={() => updateSettings('openSideRoster', true)}
                            disableRipple
                            sx={{
                                textTransform: 'none',
                                font: 'inherit'
                            }}
                        >
                            <h2>Roster</h2>
                            < PersonSearchIcon />
                        </Button>
                        : getRoster({ mainPage: true })
                }

                {/* Side Menu for Compact Mode */}
                <Drawer
                    id='tb-side-roster-menu'
                    open={settings.openSideRoster}
                    onClose={() => updateSettings('openSideRoster', false)}
                    anchor={settings.compactMode < 0 ? 'left' : 'right'}
                    elevation={0}
                    PaperProps={{
                        sx: {
                            width: props.windowSmall ? '90vw' : '50vw',
                            overflow: 'visible'
                        }
                    }}
                >
                    {getFilter({ mainPage: false })}
                    {getRoster({ mainPage: false })}
                    <Button
                        id='tb-side-roster-btn'
                        className={settings.compactMode < 0 ? 'position-left' : 'position-right'}
                        onClick={() => updateSettings('openSideRoster', false)}
                        sx={{
                            borderWidth: settings.compactMode < 0 ?
                                '2px 2px 2px 0' : '2px 0 2px 2px',
                            borderRadius: settings.compactMode < 0 ?
                                '0 0.25rem 0.25rem 0' : '0.25rem 0 0 0.25rem',
                            right: settings.compactMode < 0 ? 'auto' : props.windowSmall ? '-90vw' : '-42.5vw',
                            left: settings.compactMode > 0 ? 'auto' : props.windowSmall ? '-90vw' : '-42.5vw'
                        }}
                    >
                        <div>
                            <PersonSearchIcon />
                        </div>
                    </Button>
                </Drawer>

            </DragDropContext >
        </div >
    )
}


export default NikkeTeamBuilder;