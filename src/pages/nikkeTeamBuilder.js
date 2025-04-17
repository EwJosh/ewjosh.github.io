import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Drag 'n Drop library.
import { DragDropContext } from '@hello-pangea/dnd'; //'react-beautiful-dnd';
// HTTP Client. For fetching the csv data.
import axios from 'axios';

// Import assets
import Tags from '../assets/nikke/data/NikkeTags.json';
import { Icons, getNikkePortraits, getDefaultNikkePortrait } from '../components/nikke/nikkeAssets.js'

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
import { styled } from '@mui/material';

// Import MUI icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import CloseIcon from '@mui/icons-material/Close';

// Thresholds for auto-setting the number of squads shown per row.
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

// Restyled MUI Button and IconButton. Used for the buttons in the TB's header.
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
const CodeDropDownIcon = styled(ArrowDropDownIcon)({
    fill: '#ffffff00'
})

// Restyled MUI Button for toggling minimizing of components (Squads, Bench, Filter, Roster). Can be imported to other components.
export const MinimizeButton = styled(Button)({
    minWidth: 'auto',
    maxWidth: '25%',
    height: '70%',
    position: 'absolute',
    right: 0,
    top: 0
});

function NikkeTeamBuilder(props) {
    // Loading state variable.
    const [isLoading, setIsLoading] = useState(true);

    // Search Parameters read by the URI query.
    const [searchParams] = useSearchParams();

    // Dictionary of Nikkes and their respective portrait asset.
    const [nikkePortraits, setNikkePortraits] = useState({});
    // Default portrait if one can't be found.
    const [defaultNikkePortrait, setDefaultNikkePortrait] = useState(null);

    /**
    * Active set of tags to process user filtering and can be modified.
    * See Tags to see what's available..
    */
    const [filter, setFilter] = useState({
        // Initialize Basic Tags to have all selected.
        'Burst': Tags.Burst,
        'Burst Cooldown': Tags['Burst Cooldown'],
        'Class': Tags.Class,
        'Code': Tags.Code,
        'Company': Tags.Company,
        'Weapon': Tags.Weapon,

        'Rarity': ['SSR'],  // Initialize Rarity to only have SSR selected.
        'FavItem': 'all',   // Initialize FavItem to show both favAble and favBoosted.
        'Name': '',         // Add Name to filter (not in Tags) and initialize as blank.
        'Triggers': [],     // Initialize TSS to be empty.
        'Scaling Stats': [],
        'Scaling Effects': [],
        'Skill Effects': [],
        'Skill Targets': []
    });

    /**
     * Collection of states/settings.
     * Could be separated into their own variables/states, but this way it's easier to manage them all.
     */
    const [settings, setSettings] = useState({
        // Application states
        'editable': false,        // Can edit Squads.
        'openSideRoster': false,  // Side menu (Filter+Rostera) is open.
        'openHelp': false,        // Help dialog is open.
        'openSettings': false,    // Settings dialog is open.
        'rosterOverflow': false,  // Roster exceeds maxRosterSize.
        // Filter categories displayed per row. Initialized value depends on window size.
        'filterCtgrPerRow': (window.innerWidth <= WINDOW_WIDTH_2_SQUADS) ?
            2 : 4,
        // User-configurable
        'targetCode': 'None',     // The selected Code weakness (for reviews).
        'enableReviews': true,    // Reviews is enabled.
        'allowDuplicates': false, // Duplicate Nikkes are allowed.
        'maxRosterSize': 256,      // Maximum Nikkes rendered in Roster.
        'squadsPerRow': (window.innerWidth <= WINDOW_WIDTH_2_SQUADS) ? // Squads displayed per row. Initialized value depends on window size.
            1 : (window.innerWidth > WINDOW_WIDTH_3_SQUADS) ?
                3
                : 2,
        'compactMode': 0,         // Whether filter and roster are at the bottom of the page (==0) or a side menu on the left (<0) or right (>0).
        'debugMode': true        // Debug mode is enabled (for console printing data). Leave false unless editing.
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
     * Event fired when window is resized.
     * Updates squadsPerRow and filterCtgrPerRow in settings.
     */
    const handleResize = () => {
        // Small
        if (window.innerWidth <= WINDOW_WIDTH_2_SQUADS) {
            setSettings({
                ...settings,
                squadsPerRow: 1,
                filterCtgrPerRow: 2
            });
        }
        // Large
        else if (window.innerWidth > WINDOW_WIDTH_3_SQUADS) {
            setSettings({
                ...settings,
                squadsPerRow: 3,
                filterCtgrPerRow: 4
            });
        }
        // Medium
        else {
            setSettings({
                ...settings,
                squadsPerRow: 2,
                filterCtgrPerRow: 4
            });
        }
    }

    /**
     * Information of all Nikkes. Nikke Data includes...
     * primitive attributes: Id, Title, Rarity, Burst, Burst Cooldown, Code, Weapon, Class, Company, Color, favAble, favBoosted
     * array attributes: Triggers, Scaling Stats, Scaling Effects, Skill Effects, Skill Targets
     */
    const [nikkeData, setNikkeData] = useState([]);

    /**
     * Converts Comma-separated-value-formatted (CSV-formatted) text into an array of Nikke objects.
     * 
     * @param {string} csvText Comma-separated-value-formatted string containing Nikke Data.
     * @returns an array of objects with Nikke data.
     */
    const parseCsv = (csvText) => {
        // Split CSV text into rows.
        let rows = csvText.split(/\r?\n/);
        // Extract header in the first row.
        let header = rows[0].split(',');
        // Initialize an array to store parsed data.
        let data = [];

        // Loop through each row (except header/row 0).
        for (let j = 1; j < rows.length; j++) {
            // Split the row by commas (,).
            let row = rows[j].split(',');
            // Create an object (nikke) using the data in a given row and add it to the data array.
            let nikke = {};

            // Parse through each row.
            for (let i = 0; i < header.length; i++) {
                // If there is no value, skip.
                if (row[i] === '' || row[i] === '---')
                    continue;

                // Fetch attribute from header.
                let attribute = header[i];

                // If attribute/category is known to be primitive, set attribute to be the found value.
                if (Tags.primitiveCategories.includes(attribute))
                    nikke[attribute] = row[i];
                // If attribute/category is known to be an array, initialize array or appendfound value appropriately.
                else if (Tags.arrayCategories.includes(attribute)) {
                    if (nikke[attribute] == null)
                        nikke[attribute] = [row[i]];
                    else
                        nikke[attribute].push(row[i]);
                }
                // If neither are true, throw warning.
                else
                    console.log('Warning: category not found in tag list:', attribute);
            }

            data.push(nikke);
        }
        return data;
    }

    /**
     * Gets an array of all Nikke IDs.
     * @returns an array of all Nikke IDs found in NikkeData.
     */
    const getAllNikkeIds = (inputData = nikkeData) => {
        if (inputData.length > 0) return inputData.map(item => item.Id);
        else return [];
    };


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
                nikkeIds: getAllNikkeIds()
            },
            'froster': {
                id: 'froster',
                nikkeIds: getAllNikkeIds()
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

        'tutorial': true,       // Whether the page shows use-case hints.
        'portrait': true,        // Whether Nikke Portraits are rendered or not.
        'portraitGradient': false, // Whether Nikke portraits have a gradient background.
        'allSquadsMin': false,  // Whether ALL the squad components are minimized.
        'filter': true,         // Whether the filter component is rendered at all.
        'filterMin': false,     // Whether the filter component is minimized.
        'filterAdvanced': false,    // Whether the advanced filtering options are visible.
        'benchMin': false,      // Whether the Bench and Roster components are minimized, respectively.
        'rosterMin': false,
        'categoryIcons': true,  // If false, shrinks NikkeUnit and skips rendering of the bottom four icons.
        'squadClean': true,     // Whether the quick-move (+/-) and info (i) buttons are rendered in Squads.
        'unitDetails': false,   // Whether the popper for a NikkeUnit is visible or not.

        // Icons that can be hidden if false
        'Burst': true,
        'Burst Cooldown': true,
        'Class': true,
        'Code': true,
        'Company': true,
        'Weapon': true,
        'Rarity': true,
        'FavItem': true
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

        // Update froster if roster is involved by running filter and getting the IDs.
        if (srcSectionId === 'roster' || dstSectionId === 'roster')
            newNikkeList = {
                ...nikkeList,
                broster: {
                    ...nikkeList.broster,
                    froster: {
                        ...nikkeList.broster.froster,
                        nikkeIds: handleFilter(filter, rosterIdsCopy, settings.overrideMaxRoster)
                    }
                }
            };
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
            nikkeData.forEach(nikke => {
                if (nikke.Id === nikkeId)
                    nikkes.push(nikke);
            })
        });

        return nikkes;
    }

    /**
     * Gets the specified Nikke object via its ID value through the original nikkeData list, if it exists.
     * @param {string} nikkeId ID value of the desired Nikke.
     * @returns The specified Nikke if found in the original list, null otherwise.
     */
    const getNikkeById = (nikkeId) => {
        for (let i = 0; i < nikkeData.length; i++) {
            if (nikkeData[i].Id === nikkeId)
                return nikkeData[i];

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
     * @returns an integer array of Nikke ID values of filtered Nikkes.
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
            inputIds = getAllNikkeIds();

        // Escape special characters in the input Name and force lower case.
        let inputName = inputFilter.Name.toLowerCase();
        inputName = inputName.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');

        // Some easter eggs / meme / test filters. See else for normal filtering.
        if (inputName.toLowerCase() === 'best girl') {
            newFilteredNikkes = [...getAllNikkeIds()];   // All girls are best girl.
        }
        else if (inputName.toLowerCase() === 'real best girl') {
            newFilteredNikkes = [53, 107];   // Scarlet and Scarlet: BS
        }
        else if (inputName.toLowerCase() === 'test 32') {
            // Gives exactly 32 Nikkes. Used to test the overflow functionality.
            let tempIds = ['96', '97', '111', '19', '20', '121', '93', '66', '21', '129', '117', '79', '85', '22', '23', '123',
                '74', '24', '118', '82', '113', '25', '25f', '26', '83', '27', '126', '112', '114', '28', '29', '30'];
            tempIds.forEach(nikkeId => {
                if (!nikkeList.broster.bench.nikkeIds.includes(nikkeId)) {
                    newFilteredNikkes.push(nikkeId);
                }
            })
        }
        // Otherwise, filter as normal.
        else {
            // Run Nikke roster through filter.
            // - Return false if Nikke doesn't match filter; return true if nikke matches filter.
            newFilteredNikkes = inputIds.filter(nikkeId => {
                let nikke = getNikkeById(nikkeId);

                // If Name is being filtered, check if Nikke's name or title matches.
                if (inputName != null && inputName.length > 0) {
                    // Create regex to check for start+inputName OR whitespace+inputName.
                    // Using Start of String (^), OR (|), and Whitespace (\s).
                    // (e.g. 'ma' won't proc 'friMA', but will proc 'MAst' and 'privaty: unkind MAid')
                    let regex = new RegExp(
                        '^' + inputName
                        + '|\\s' + inputName
                    );
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

                // Check for FavItem (one is selected from 'favAble', 'favBoosted', and 'all'):
                // - If the tag is favAble, omit Nikke if favBoosted is true.
                // - If the tag is favBoosted, omit Nikke if favAble is true.
                // - Otherwise, don't influence.
                if (inputFilter.FavItem === 'favAble' && nikke.favBoosted)
                    return false;
                else if (inputFilter.FavItem === 'favBoosted' && nikke.favAble)
                    return false;

                // For each filterable categories, check if any the selected tags match the Nikke.
                for (let j = 0; j < Tags.filterList.length; j++) {
                    // Fetch category ID (or array of IDs).
                    let category = Tags.filterList[j];

                    // If any category cannot find a Nikke, filter out.
                    let found = false;

                    // If the filterList entry is an array of IDs, they can be linked.
                    if (Array.isArray(category)) {
                        // Search the array of IDs.
                        // If any are skippable (empty or full), perform standard filter search.
                        let useLinked = true;
                        category.forEach(ctgrId => {
                            if (inputFilter[ctgrId].length === 0
                                || inputFilter[ctgrId].length === Tags[ctgrId].length
                            )
                                useLinked = false;
                        });

                        // If none of the linked categories are skippable, use linked filter search.
                        if (useLinked)
                            found = searchLinkedFilterCategory(nikke, category, inputFilter);
                        // Otherwise perform standard filter search for each category in the array.
                        else {
                            for (let c = 0; c < category.length; c++) {
                                found = searchFilterCategory(nikke, category[c], inputFilter);

                                // If any lack the matching tag(s), omit Nikke.
                                if (!found)
                                    return false;
                            }
                        }
                    }
                    // Otherwise, use the standard filter search.
                    else
                        found = searchFilterCategory(nikke, category, inputFilter);

                    // If filtered category does not contain a matching tag, omit Nikke.
                    if (!found)
                        return false;
                }

                // If there are no problems, keep Nikke.
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

        // Update froster IDs and Settings.
        let newNikkeList = {
            ...nikkeList,
            broster: {
                ...nikkeList.broster,
                froster: {
                    ...nikkeList.broster.froster,
                    nikkeIds: newFilteredNikkes
                }
            }
        };
        setNikkeList(newNikkeList);
        setSettings(newSettings);
        return newFilteredNikkes;
    }

    /**
     * Parses through the tag(s) in the provided filtered category and checks if a match exists for the provided Nikke. 
     * 
     * @param {object} nikke Object containing Nikke data.
     * @param {string} categoryId String identifier for the category to be searched through. 
     * @param {object} inputFilter Object containing the inputted filter.
     * @returns false if the Nikke's data does not match the filter's data, in respect to the provided category. Otherwise true.
     */
    const searchFilterCategory = (nikke, categoryId, inputFilter) => {
        // Fetch the respective values to compare the Nikke and Filter.
        let nikkeValue = nikke[categoryId];
        let filterList = inputFilter[categoryId];

        // If the filtered category does not exist, skip category.
        // If all tags of a given category are selected or unselected, skip category.
        if (filterList == null
            || filterList.length === Tags[categoryId].length
            || filterList.length === 0
        )
            return true;
        // If Nikke does not have the category and the category isn't being skipped, omit Nikke.
        else if (nikkeValue == null)
            return false;

        // Check if nikkeValue is an array or a single primitive .
        let isArray = Array.isArray(nikkeValue);

        // For each selected tag within a category, search for a match with the Nikke.
        for (let i = 0; i < filterList.length; i++) {
            // Fetch selected tag.
            let tag = filterList[i];

            // If the Nikke's entry is an array, parse through the array.
            if (isArray) {
                for (let k = 0; k < nikkeValue.length; k++) {
                    // If any elements of the array match the selected tag, return true.
                    if (tag === nikkeValue[k])
                        return true;
                }
            }
            // If the Nikke's entry is a single value, compare with the selected tag.
            else {
                // If they match, return true
                if (tag === nikkeValue)
                    return true;
                // Special Case: If the category is 'Burst' and the tag is 'R', check if the Burst is '1R' or '2R'.
                else if ((categoryId === 'Burst' && tag === 'R')
                    && (nikkeValue === '1R' || nikkeValue === '2R'))
                    return true;
            }
        }

        // If no match is found after parsing, omit Nikke.
        return false;
    }

    /**
     * Parses through the tag(s) in the provided filtered linked-categories and check if a match exists for the provided Nikke. 
     * Compares using multiple equal-length arrays from the Nikke to the arrays from the inputted filter.
     * Category values from the Nikke are linked together by index.
     * Uses recursion to allow X arrays to be linked together.
     * 
     * Example:
     * nikke={A: [a0, a1, a2, a2], B:[b0, b0, b0, b1]}, categoryIds=[A, B], inputFilter={A: [a0, a2, a5], B: [b0, b2]}
     * This function will link nikke.A and nikke.B by indices to check
     * if any permutation from the Nikke ([a0, b0], [a1, b0], [a2, b0], [a2, b1]) will match with
     * any possible permutation from the filter ([a0, b0], [a0, b2], [a2, b0], [a2, b2], [a5, b0], [a5, b2]).
     * Since [a0, b0] is found in this example Nikke, the function would return true with these arguments.
     *  
     * @param {object} nikke Object containing Nikke data.
     * @param {Array} categoryIds Array of string identifiers for the categories to be searched through.
     * @param {object} inputFilter Object containing the inputted filter.
     * @returns false if the Nikke's data does not match the filter's data, in respect to the provided category. Otherwise true.
     */
    const searchLinkedFilterCategory = (nikke, categoryIds, inputFilter) => {
        // If the input category(s) is invalid, skip category.
        if (categoryIds == null || categoryIds.length === 0)
            return true;

        // If either Nikke or Filter are missing any of the given categoryIds,
        // then omit (if does not exit in Nikke) or skip (if does not exist or empty in Filter).
        for (let c = 0; c < categoryIds.length; c++) {
            if (nikke[categoryIds[c]] == null)
                return false;
            else if (inputFilter[categoryIds[c]].length === 0)
                return true;
        }

        // Loop through the possible permutations of Nikke array elements.
        for (let i = 0; i < nikke[categoryIds[0]].length; i++) {
            // Link Nikke array elements by index.
            let nikkeValue = [];
            for (let c = 0; c < categoryIds.length; c++) {
                nikkeValue.push(nikke[categoryIds[c]][i]);
            }

            // If we reach an index that doesn't have enough elements in all arrays,
            // there would be no match, so omit Nikke.
            if (nikkeValue.length !== categoryIds.length)
                return false;

            // Initiate recursion for checking the linked arrays.
            let found = searchLinkedFilterCategoryRecurse(nikkeValue, categoryIds, inputFilter, 0);

            // If a full linked match was found, keep Nikke.
            if (found)
                return true;
        }

        // If a match is never found, omit Nikke.
        return false;
    }

    /**
     * Recursively checks if the elements of a given Nikke array
     * are found in the respective arrays of the Filter object, as designated by the array of category IDs.
     * Each layer of recursion will compare the depth-indexed element of the Nikke array
     * with all the filter options from the depth-indexed category.
     * 
     * @param {Array} nikkeValues Array of values from the Nikke to be compared.
     * @param {Array} categoryIds Array of string identifiers for the categories to be searched through.
     * @param {object} inputFilter Object containing the inputted filter.
     * @param {number} depth Index of the categoryIds being searched.
     * @returns true if the each element in nikkeValue can be found in the respective categories of the filter.
     */
    const searchLinkedFilterCategoryRecurse = (nikkeValues, categoryIds, inputFilter, depth) => {
        // If depth is invalid, omit Nikke.
        if (depth < 0 || depth >= categoryIds.length)
            return false;

        // Fetch the Nikke tag and Category ID for comparing by depth.
        let nikkeTag = nikkeValues[depth];
        let categoryId = categoryIds[depth];

        // Loop through the filtered option in the category.
        for (let f = 0; f < inputFilter[categoryId].length; f++) {
            let found = false;
            // Fetch the filtered option to directly compare with the Nikke tag.
            let filterOption = inputFilter[categoryId][f];

            // If they do match AND there is still more categories to search,
            // recurse search with incremented depth.
            if (nikkeTag === filterOption && depth < categoryIds.length - 1)
                found = searchLinkedFilterCategoryRecurse(nikkeValues, categoryIds, inputFilter, depth + 1);
            // If they do match AND we've parsed through all categories (i.e. max depth),
            // then keep Nikke.
            else if (nikkeTag === filterOption)
                return true;

            if (found)
                return true;
            // If no immediate match is found, continue checking all filtered options
        }

        // If no match is ever found in the filter, omit Nikke.
        return false;
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
                let squId = nikkeList.squadOrder[i];
                if (squadId !== squId && !nikkeList.squads[squId].minimized) {
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
            let newBenchIds = [];
            let newRosterIds = getAllNikkeIds();

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

        // Initialize nikkeIDs array.
        let nikkeIds = [];
        // Limit parsing to maxLength. (Arbitrary decision, but I want to limit URL sizes).
        // If maxLength is negative, set limit stringIds.length.
        let sizeLimit = Math.min(stringIds.length, maxLength);
        if (sizeLimit < 0)
            sizeLimit = stringIds.length;

        // Loop through Nikke ID strings.
        for (let i = 0; i < sizeLimit; i++) {
            // Grab Nikke ID
            let nikkeId = stringIds[i];

            // Push Nikke's ID to array
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
                gridWidth={settings.filterCtgrPerRow}
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
            portraits={nikkePortraits}
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
            rosterOverflow={
                (nikkeList.broster.froster.nikkeIds.length === (settings.maxRosterSize - 1) && !settings.overrideMaxRoster)
                || settings.overrideMaxRoster
            }
            overrideMaxRoster={overrideMaxRoster}
            unlockMaxRoster={() => handleFilter(filter, nikkeList.broster.roster.nikkeIds, false, { maxRosterSize: 256 })}
            nikkeData={nikkeData}
            defaultNikkePortrait={defaultNikkePortrait}
            {...additionalProps}
        />
    }

    /**
     * Called on component mount/load (empty dependency).
     * - Fetches information from online database.
     * - Sets Nikke Data and Nikke List to match the new information.
     * - Concludes loading (sets isLoading to false).
     * - Adds the resize listener (once) without overwriting the one in the parent App.js.
     */
    useEffect(() => {
        // Fetch database information.
        // Use Axios to get the CSV (Comma-separated Values) data from the URL (my Google Spreadsheet).
        let csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPsUYbJeBgyP__oQ9VQmhhuSt8XicQKBf4KLgZi6iZ-70ApxVhcnkPp456GPlRFFbCSVVLq_w8RRN6/pub?output=csv';

        // Fetch Nikke Data from database. Check for isLoading to prevent fetch running multiple times and overwriting dependencies.
        if (isLoading)
            axios.get(csvUrl)
                .then((response) => {
                    // Convert the csv-formatted data from response into an array of objects.
                    let tempNikkeData = parseCsv(response.data);

                    // Set nikkeData and nikkeList states.
                    setNikkeData(tempNikkeData);
                    setNikkeList({
                        ...initNikkeList,
                        broster: {
                            ...initNikkeList.broster,
                            roster: {
                                ...initNikkeList.broster.roster,
                                nikkeIds: getAllNikkeIds(tempNikkeData)
                            }
                        }
                    });

                    // Update isLoading.
                    setIsLoading(false);
                })
                .catch((error) => {
                    // Throw error if caught.
                    console.error('Error fetching CSV data:', error);
                });
        // End of axios get

        // Add additional eventListener for window resizing.
        window.addEventListener('resize', handleResize);
    }, [])

    /**
     * Called after isLoading is updated.
     * - Initializes Squad and Bench according to URI's Query.
     * - Enforces new URL over old URL.
     * - Calls to update Roster using Filter.
     * - Update Portraits.
     */
    useEffect(() => {
        // Fetch list information found in dynamic URL upon page startup.
        let listById = readUriQuery(searchParams.get('squads'), searchParams.get('bench'));
        if (listById != null) {
            // Call RosterDependents to Filter. Grab filtered roster IDs.
            let frosterIds = updateRosterDependents(listById.broster.roster.nikkeIds);

            // Update NikkeList and squadCt according to URI Query with proper filtered roster IDs.
            setNikkeList({
                ...listById,
                broster: {
                    ...listById.broster,
                    froster: {
                        ...listById.broster.froster,
                        nikkeIds: frosterIds
                    }
                }
            });
            setsquadCt(listById.squadOrder.length);

            // Also enforce the new URL (nikke-team-builder) over the old URL (nikkeTeamBuilder).
            window.history.replaceState(null, '', '#/apps/nikke-team-builder?' + searchParams.toString());
        }
        // If URI Query is empty, update filtered roster normally.
        else {
            // Call RosterDependents to Filter.
            updateRosterDependents();

            // Also enforce the new URL (nikke-team-builder) over the old URL (nikkeTeamBuilder).
            window.history.replaceState(null, '', '#/apps/nikke-team-builder');
        }

        // Import Portraits and Default Portrait based on nikkeData.
        setNikkePortraits(getNikkePortraits(nikkeData));
        setDefaultNikkePortrait(getDefaultNikkePortrait(nikkeData));
    }, [isLoading])

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
     * @return an array of Nikke IDs that pass the filter.
     */
    const updateRosterDependents = (inputIds, inputSettings = { allowDuplicates: settings.allowDuplicates, maxRosterSize: settings.maxRosterSize }) => {
        if (inputIds == null)
            return handleFilter(filter, nikkeList.broster.roster.nikkeIds, false, inputSettings);
        else
            return handleFilter(filter, inputIds, false, inputSettings);
    }

    return (
        <div id='nikke-tb' className='page' style={{ fontSize: props.windowSmall ? '0.75rem' : '1rem' }}>
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
                onClick={() => settings.debugMode ? console.log(nikkeData, nikkeList, settings, visibility)
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
                            <QuestionMarkIcon />
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
                        IconComponent={CodeDropDownIcon}
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
                            '.MuiOutlinedInput-notchedOutline': { border: settings.targetCode === 'None' ? 0 : '1px solid gold' }
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
                            <SettingsIcon />
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
                            ><AddIcon />
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
                            startIcon={settings.editable ? <DriveFileRenameOutlineSharpIcon /> : <EditIcon />}
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
                {/* Squads Section */}
                <div
                    id='squad-megacontainer'
                    style={{
                        gridTemplateColumns: 'repeat(' + settings.squadsPerRow + ', 1fr)',
                        gridTemplateRows: 'repeat(' + Math.ceil((nikkeList.squadOrder.length + visibility.tutorial) / settings.squadsPerRow) + ', min-content)'
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
                                    portraits={nikkePortraits}
                                    defaultNikkePortrait={defaultNikkePortrait}
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
                                                ><DeleteForeverIcon fontSize='small' /></IconButton></Tooltip>
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
                                                ><AddIcon /></IconButton></Tooltip>
                                        </div>
                                        : null
                                }
                            </div>;
                        })
                    }
                    {/* Tutorial tip */}
                    {
                        visibility.tutorial ?
                            <div
                                className='squad-supercontainer tutorial'
                                style={{
                                    width: props.windowSmall ? '20.25em' : '36.5rem'
                                }}
                            >
                                <h4>Tip:</h4>
                                <Button
                                    onClick={() => setVisibility({ ...visibility, tutorial: false })}
                                    size={props.windowSmall ? 'small' : 'medium'}
                                >
                                    Dismiss <CloseIcon />
                                </Button>
                                <p>
                                    For instructions, select the <QuestionMarkIcon fontSize='inherit' className='menu-icon-text' /> button above.
                                </p><p>
                                    Want more squads?
                                    Toggle the <EditIcon fontSize='inherit' className='menu-icon-text' /> Edit button above
                                    and add more with <AddIcon fontSize='inherit' className='menu-icon-text' />.
                                </p>
                            </div>
                            : null
                    }
                </div>

                {/* Bench Section */}
                <NikkeList
                    key={'bench'}
                    section={nikkeList.broster.bench}
                    nikkes={collectNikkes(nikkeList.broster.bench.nikkeIds)}
                    icons={Icons}
                    portraits={nikkePortraits}
                    defaultNikkePortrait={defaultNikkePortrait}
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