import React, { useState } from 'react';
import { MinimizeButton } from '../../pages/nikkeTeamBuilder.js';
import Presets from '../../assets/nikke/data/NikkeFilterPresets.json';

// Import MUI components
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material';

// Import MUI icons
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LinkIcon from '@mui/icons-material/Link.js';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Nikke data keys that are affected by Presets.
const PRESET_KEYS = ['Triggers', 'Skill Effects', 'Skill Targets'];

// Restyled MUI ToggleButton for coloring them orange when selected.
const StyledToggleButton = styled(ToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: '#b37227'
    }
});

// Restyled MUI Select. Used for Favorite Items.
const StyledSelect = styled(Select)({
    minWidth: '3.75rem',
    maxHeight: '3.5rem',
    backgroundColor: '#005050',
    textAlign: 'center',
    maxWidth: '100%',
    boxSizing: 'border-box',
});

// Restyled MUI TextField. Used for Name input.
const StyledTextField = styled(TextField)({
    backgroundColor: '#005050',
    borderRadius: '4px',
    '.MuiInputLabel-shrink, &.filter-category-active .MuiOutlinedInput-notchedOutline': {
        color: '#ffa726',
        borderColor: '#ffa726'
    }
})

// Restyled MUI Autocomplete. Used for Presets, Triggers, Skills, and Scaling.
const StyledAutocomplete = styled(Autocomplete)({
    maxWidth: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#005050',
    borderRadius: '4px',
    zIndex: 1,
    '.MuiInputLabel-shrink, &.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-notchedOutline': {
        color: '#ffa726',
        borderColor: '#ffa726'
    }
});

function NikkeFilter(props) {
    // Current selected Preset. Null if none is selected.
    const [presetId, setPresetId] = useState(null);

    /**
     * Updates filter directly and calls for a re-filter in Team Builder.
     * Called when textfield (Name), select (presets and favItem), and autocomplete (arrays) are updated.
     * FIlter is updated purely using the category as key and the given value as its value.
     * 
     * @param {string} category Filterable tag category.
     * @param {any} value Filtered tag category's new value.
     */
    const onFilter = (category, value) => {
        // If category modified can be preset, set presetId to Custom.
        if (!PRESET_KEYS.includes(category))
            setPresetId('Custom');

        // Call handleFilter in Team Builder using new filter values
        props.onFilter({
            ...props.filter,
            [category]: value
        });
    }

    /**
     * Updates filter when a button group is updated. Calls for a re-filter in Team Builder.
     * New filter depends on the category's initial value.
     * If all options were selected before, set the filter to only use the 'de-selected' (toggled) option,
     * If all options are to be deselected now, set the filter to use all options.
     * This behavior is intended to reflect Nikke's in-game filter system.
     * 
     * @param {string} category Filterable tag category.
     * @param {string} value Filtered tag category's new array.
     */
    const onFilterButtonGroup = (category, value) => {
        let newValue = value;

        // If filter category is at default and value is selected,
        // Filter value and remove all others

        // Check if default tags and filtered tags are at equal length
        if (props.tags[category].length === props.filter[category].length) {

            // Iterate through the list of default tags
            for (let i = 0; i < props.tags[category].length; i++) {

                // Search for the tag missing from value, then save it and break
                if (value.indexOf(props.tags[category][i]) === -1) {
                    newValue = [props.tags[category][i]]
                    break;
                }
            }
        }

        // If all filter values are removed, reset filter category
        else if (value.length === 0)
            newValue = props.tags[category];

        // Call handleFilter in Team Builder using new filter values
        props.onFilter({
            ...props.filter,
            [category]: newValue
        });
    }

    /**
     * Toggles visibility of a tag category to influence the rendering of icons on NikkeUnits.
     * If the categories [Class, Code, Company, Weapon] are invisible, visibility.categoryIcons will be false
     * to skip the rendering of the icon div in NikkeUnits.
     * @param {string} category Filterable tag category.
     */
    const handleToggleVisibility = (category) => {
        // Check if props.visibility.categoryIcons should be true or false (for condensing Nikke Unit, if necessary)
        // Don't check with Burst/Cooldown categories. Start on index 1 to skip Burst too
        if (category !== 'Burst' && category !== 'Burst Cooldown') {
            let hasVisibility = false;
            for (let i = 1; i < props.visibility.categories.length; i++) {
                let ctgr = props.visibility.categories[i];

                // If the clicked category and the checking category are the same
                if (category === ctgr) {
                    // If the checked category is already false (i.e. we are now enabling a category),
                    // then ctgrIcons will always be true
                    if (!props.visibility[ctgr]) {
                        hasVisibility = true;
                        break;
                    }
                    // If the checked category is true and being disabled, continue
                }
                // If the clicked category and the checking category are the different,
                // And if the checked category is still visible, ctgrIcons is true
                else if (props.visibility[ctgr]) {
                    hasVisibility = true;
                    break;
                }
                // If the checked category is diferent and false, continue
            }

            // Set accordingly
            props.setVisibility({
                ...props.visibility,
                [category]: !props.visibility[category],
                'categoryIcons': hasVisibility
            })
        }
        // If clicked category is Burst or Burst Cooldown, do the following....
        // When toggling Burst visibility, Burst Cooldown will always match.
        else if (category === 'Burst') {
            props.setVisibility({
                ...props.visibility,
                'Burst': !props.visibility['Burst'],
                'Burst Cooldown': !props.visibility['Burst']
            });
        }
        // When toggling Burst Cooldown to be visible, make Burst visible.
        // When toggling Burst Cooldown to be invisible, don't change Burst.
        else if (category === 'Burst Cooldown') {
            if (props.visibility['Burst Cooldown'])
                props.setVisibility({
                    ...props.visibility,
                    'Burst Cooldown': false
                });
            else
                props.setVisibility({
                    ...props.visibility,
                    'Burst': true,
                    'Burst Cooldown': true
                });
        }
        else if (category === 'Rarity') {
            props.setVisibility({
                ...props.visibility,
                'Rarity': !props.visibility['Rarity']
            })
        }
    }

    /**
     * Resets filter to its initial state.
     */
    const handleResetFilter = () => {
        props.onFilter({
            // Initialize Basic Tags to have all selected.
            'Burst': props.tags.Burst,
            'Burst Cooldown': props.tags['Burst Cooldown'],
            'Class': props.tags.Class,
            'Code': props.tags.Code,
            'Company': props.tags.Company,
            'Weapon': props.tags.Weapon,

            'Rarity': ['SSR'],  // Initialize Rarity to only have SSR selected.
            'FavItem': 'all',   // Initialize FavItem to show both favAble and favBoosted.
            'Name': '',         // Add Name to filter (not in Tags) and initialize as blank.
            'Triggers': [],     // Initialize TSS to be empty.
            'Scaling Stats': [],
            'Scaling Effects': [],
            'Skill Effects': [],
            'Skill Targets': []
        })
    }

    /**
     * Builds a component containing a header and a visibility toggle button, if needed. The component is centered on the header.
     * @param {string} category Representation of the filtered category and the string to be displayed. 
     * @returns a <div> component containing a header for the filtered category and a visibility toggle button, if needed.
     */
    const getCategoryHeader = (category) => {
        if (props.tags.mainCategories.indexOf(category) !== -1)
            return <div className='filter-category-visibility-container flex-row'>
                {
                    props.windowSmall ?
                        <h4>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h4>
                        : <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                }
                {/* Create IconButton for toggling visibility */}
                <Tooltip
                    title={(category === 'Rarity' && props.visibility.Rarity) ?
                        'Hide Highlights' : (category === 'Rarity' && !props.visibility.Rarity) ?
                            'Show Highlights' : props.visibility[category] ?
                                'Hide Icons' : 'Show Icons'
                    }
                    placement='top'
                >
                    <IconButton
                        onClick={() => handleToggleVisibility(category)}
                        sx={{ padding: '0', maxWidth: '1rem', maxHeight: '1rem' }}
                    >
                        {
                            props.visibility[category] ?
                                <VisibilityIcon sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                : <VisibilityOffIcon sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                        }
                    </IconButton>
                </Tooltip>
            </div>;
        else
            return <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>;
    }

    /**
     * Builds a ToggleButtonGroup for the given category
     * that contains ToggleButtons based on the category's available tags.
     * @param {string} category Filter category to build the group of buttons.
     * @returns a group of toggle buttons that affect the filter's status relative to the category.
     */
    const getButtonGroup = (category) => {
        return <ToggleButtonGroup
            className='filter-btn-group'
            value={props.filter[category]}
            onChange={(event, value) => onFilterButtonGroup(category, value)}
            sx={{
                maxWidth: '100%',
                boxSizing: 'border-box',
                justifyContent: 'center'
            }}
        >
            {
                // For each tag in a given category, create a ToggleButton with its value
                props.tags[category].map(tag => {
                    if (tag == null)
                        return null;

                    let selectState = isSelected(category, tag);

                    return (
                        <StyledToggleButton
                            value={tag}
                            key={'tag-' + category + '-' + tag}
                            sx={{
                                // maxWidth: props.windowSmall ? '20%' : 'none',
                                backgroundColor: '#70809069',
                                fontWeight: selectState ? 'bold' : 'normal',
                                textDecoration: selectState ? 'inherit' : 'line-through',

                                padding: selectState ?
                                    (props.windowSmall ? '1px 5px' : '10px')
                                    : (props.windowSmall ? '1px 4px' : '9px'),

                                outline: tag === props.targetCode ? '3px solid #ffd500' : 0,
                                zIndex: tag === props.targetCode ? 1 : 0
                            }}
                        >
                            {
                                getTagIcon(category, tag, selectState)
                            }
                        </StyledToggleButton>
                    )
                })
            }
        </ToggleButtonGroup>
    }

    /**
     * Builds a Select component purely for filtering Favorite Item -related Nikkes.
     * Uses related FavItem Icons in the select options.
     * @returns a Select component for filter options regarding Favorite Items
     */
    const getFavItemSelect = () => {
        return <StyledSelect
            value={props.filter.FavItem}
            key='FavItem'
            onChange={(event) => onFilterButtonGroup('FavItem', event.target.value)}
            size={props.windowSmall ? 'small' : 'medium'}
            color='warning'
            SelectDisplayProps={{
                style: {
                    display: 'flex',
                    alignItems: 'center'
                }
            }}
        >
            <MenuItem value={'favAble'}>
                <img
                    src={props.icons.FavItem.favAble}
                    alt=''
                    className='filter-select-icon'
                />
                Show Base Nikkes
            </MenuItem>
            <MenuItem value={'favBoosted'}>
                <img
                    src={props.icons.FavItem.favBoosted}
                    alt=''
                    className='filter-select-icon'
                />
                Apply Favorite Items
            </MenuItem>
            <MenuItem value={'all'}>
                <img
                    src={props.icons.FavItem.favAble}
                    alt=''
                    className='filter-select-icon'
                />
                <img
                    src={props.icons.FavItem.favBoosted}
                    alt=''
                    className='filter-select-icon'
                />
                Show Both
            </MenuItem>
        </StyledSelect>;
    }

    /** 
     * Checks whether a filtered tag is selected or not.
     * @param {string} category The filter category of the tag.
     * @param {string} tag The tag being filtered.
     * @returns true if the target tag exists inside the filtered category.
     */
    const isSelected = (category, tag) => {
        if (props.filter[category] == null)
            return false;

        let index = props.filter[category].indexOf(tag);
        if (index < 0)
            return false;
        else
            return true;
    }

    /**
     * Builds a React component (<span> or <img>) depending on the input.
     * If the tag doesn't have a corresponding icon, returns a <span> of the tag.
     * If the tag matches the targetCode, return a render of a highlighted icon.
     * Otherwise, return an <img> of the tag's icon.
     * @param {*} category The filter category of the tag.
     * @param {*} tag The tag being filtered.
     * @param {*} selectState Whether the tag is selected or not.
     * @returns A React component to display the filtered tag.
     */
    const getTagIcon = (category, tag, selectState) => {
        if (category === 'Burst Cooldown' || category === 'Rarity')
            return <span>{tag}</span>;
        else if (category === 'Code' && tag === props.targetCode)
            return [
                <img
                    key='Highlight'
                    src={props.icons.Highlight}
                    alt={'Highlight'}
                    className={'filter-icon icon-overlay' + (selectState ? ' filter-icon-selected' : ' filter-icon-unselected')}
                />,
                <img
                    key={tag}
                    src={props.icons[category][tag]}
                    alt={tag}
                    className={'filter-icon' + (selectState ? ' filter-icon-selected' : ' filter-icon-unselected')}
                />];
        else
            return <img
                src={props.icons[category][tag]}
                alt={tag}
                className={'filter-icon' + (selectState ? ' filter-icon-selected' : ' filter-icon-unselected')}
            />;
    }

    /**
     * Updates preset-related filter categories according to the selected filter and calls for a re-filter.
     * If the reason is 'clear', presetId will be nulled and the filter options for Triggers and Skills will be cleared.
     * Otherwise, the function will grab the predetermined filter arrays from the imported Presets JSON.
     * and set the respective filter categories to use the fetched data.
     * 
     * @param {object} event React event source of the callback (unused).
     * @param {string} value The selected option
     * @param {string} reason The purpose of the update. If 'clear', properly clears related filter categories.
     */
    const updatePreset = (value, reason) => {
        // If reason is 'clear', null presetId and empty related filter categories. Return after.
        if (reason === 'clear') {
            setPresetId(null)
            props.onFilter({
                ...props.filter,
                'Triggers': [],
                'Skill Effects': [],
                'Skill Targets': []
            })
            return;
        }

        // Fetch preset object from the Presets JSON.
        // If not found, return. Otherwise, update presetId.
        let preset = Presets[value];
        if (preset == null)
            return;
        else
            setPresetId(value);

        // Create a new filter object and update it with the given preset.
        let newFilter = {
            ...props.filter,
            ...preset
        };

        // Call for a re-filter with the new filter.
        props.onFilter(newFilter);
    }

    /**
     * Gets the available preset options that are nested within preset option categories.
     * @returns an array of strings that represent the available presets.
     */
    const getPresetArray = () => {
        let array = [];

        // Loop through and fetch each of the categories of presets.
        for (let j = 0; j < Presets.categories.length; j++) {
            let category = Presets['category ' + Presets.categories[j]];

            // Loop through the category and fetch each preset and push it.
            for (let i = 0; i < category.length; i++) {
                let preset = category[i];

                if (preset != null)
                    array.push(preset);
            }
        }

        return array;
    }

    /**
     * Builds an Autocomplete (TextField + Select) based of a given category.
     * Allows for multiple options to be selected simultaneously.
     * @param {string} category filter category of multi-selectable options.
     * @returns a React component Autocomplete with filterable options and multi-select functionality.
     */
    const getAutocomplete = (category) => {
        return <StyledAutocomplete
            value={props.filter[category]}
            key={category}
            onChange={(event, value) => { onFilter(category, value) }}
            size={props.windowSmall ? 'small' : 'medium'}
            multiple
            options={props.tags[category]}
            disableCloseOnSelect
            fullWidth
            limitTags={3}
            disableListWrap
            filterOptions={autocompFilterOptions}
            renderOption={autocompRenderOption}
            renderInput={(params) => renderInput(params, category)}
            sx={{
                minWidth: props.windowSmall ? '100%' : '40%',
                maxWidth: props.windowSmall ? '100%' : '75%',
            }}
        />;
    }

    /**
     * Autocomplete-related function.
     * Filters all options of an autocomplete relative to the the input inside its state.
     * An option is filtered in if the input can be found at the beginning of any of the option's words. 
     * 
     * @param {Array<object>} options Array of selectable options.
     * @param {object} state Object containing the status of the related autocomplete
     * (Notably any user-provided input for filtering).
     * @returns an array of filtered options to render in the autocomplete.
     */
    const autocompFilterOptions = (options, state) => {
        // Escape special characters in the input.
        let input = state.inputValue.toLowerCase();
        input = input.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');

        // Filter available options based on inputValue (default)
        // But only at the start of a word.
        // (e.g. 're' won't proc 'Above hp thREshold')
        // Create regex to check for start+input OR whitespace+input
        let regex = new RegExp(
            '^' + input
            + '|\\s' + input
        );
        return options.filter(option => {
            if (regex.exec(option.toLowerCase()) != null)
                return true;
            else
                return false;
        });
    }

    /**
     * Autocomplete-related function.
     * Renders an individual option with a prepended checkbox depending on its selected state.
     * 
     * @param {object} props Props to apply to the <li> component.
     * @param {object} option The object to render.
     * @param {object} state The state of the option. (Notably selected, whether the object is selected.) 
     * @returns a <li> component containing a checked or unchecked box and the tag.
     */
    const autocompRenderOption = (props, option, { selected }) => {
        // Configure rendering of options to also include a Checkbox Icon.
        const { key, ...optionProps } = props;
        return (
            <li key={key} {...optionProps}>
                {
                    selected ?
                        <CheckBoxIcon color='warning' /> : <CheckBoxOutlineBlankIcon />
                }
                {option}
            </li>
        );
    }

    /**
     * Autocomplete-related function. (Required.)
     * Handles the rendering of the Autocomplete system.
     * Builds a TextField of the given props and label.
     * 
     * @param {object} props Props to pass to the TextField
     * @param {string} label String to label the TextField. Generally, the related category.
     * @returns a TextField component to display input.
     */
    const renderInput = (props, label) => {
        return < TextField {...props} label={label} color='warning' />;
    }

    /**
     * Builds a set of Autocompletes (TextField + Select) and connecting Link/LinkOff Icons
     * based on the given categories. Calls getAutocomplete() for each category.
     * Each Autocomplete allows for multiple options to be selected simultaneously.
     * If every autocomplete within contains a non-empty selection, the link will be rendered as active (Link),
     * otherwise the link will be rendered as inactive (LinkOff).
     * 
     * @param {string} categories filter category of multi-selectable options.
     * @returns a React component Autocomplete with filterable options and multi-select functionality.
     */
    const getLinkedAutocompletes = (categories) => {
        // Initialize Array to hold the Autcompletes and Link Icons.
        let autocompletes = [];

        // Check if the link is active: True if all filtered options for the related categories are non-empty.
        let linkActive = true;
        for (let i = 0; i < categories.length; i++) {
            console.log(props.filter[categories[i]]);

            if (props.filter[categories[i]].length === 0) {
                linkActive = false;
                break;
            }
        }

        // Loop through the list of categories.
        for (let i = 0; i < categories.length; i++) {
            // If not the first category, prepend with a Link/Off Icon depending if its active.
            if (i !== 0)
                autocompletes.push(
                    linkActive ?
                        <LinkIcon
                            className={props.windowSmall ? 'rotate-90-deg' : null}
                            key={'link-' + i}
                            htmlColor='#ccc'
                        />
                        : <LinkOffIcon
                            className={props.windowSmall ? 'rotate-90-deg' : null}
                            key={'link-' + 1}
                            htmlColor='#333'
                            style={{
                                margin: '-4px 0'
                            }}
                        />
                );
            // Push Autocomplete from getter.
            autocompletes.push(getAutocomplete(categories[i]));
        }

        // Build div with the created array of autocompletes and Link Icons.
        return <div
            className='filter-category-linked'
            key={categories[0]}
            style={{
                minWidth: props.windowSmall ? '100%' : '75%',
                flexDirection: props.windowSmall ? 'column' : 'row',
                marginTop: '0.5rem'
            }}
        >
            {autocompletes}
        </div>
    }

    return (
        <div
            id='filter-container'
            className='flex-column'
            style={{
                maxWidth: '100%',
                minWidth: props.mainPage ? '80vw' : '100%'
            }}
        >
            {/* Header */}
            <div
                id='filter-header'
            >
                <FilterAltIcon
                    className='section-badge'
                    onClick={() => handleToggleVisibility('filterMin')}
                />
                <h2>
                    Filter
                </h2>
                {
                    (props.visibility.filterMin) ?
                        null :
                        <Button
                            id='filter-reset-btn'
                            onClick={handleResetFilter}
                            variant='contained'
                            color='error'
                            sx={{
                                height: props.windowSmall ? '1.5rem' : '100%',
                            }}
                        >
                            <SettingsBackupRestoreIcon sx={{ marginRight: props.windowSmall ? 0 : '0.25rem' }} />
                            {props.windowSmall ? null : 'Reset'}
                        </Button>
                }
                <MinimizeButton
                    onClick={() => handleToggleVisibility('filterMin')}
                    variant='contained'
                    disableTouchRipple
                    disableElevation
                    color={props.visibility.filterMin ? 'success' : 'pumpkin'}
                    sx={{
                        height: props.windowSmall ? '1.5rem' : '100%',
                        borderRadius: props.visibility.filterMin ? '0 0.25rem 0.25rem 0' : '0 0.25rem 0 0'
                    }}
                >
                    {
                        props.visibility.filterMin ?
                            <ArrowDropUpIcon />
                            : <ArrowDropDownIcon />
                    }
                </MinimizeButton>
            </div>
            {/* Body */}
            {
                props.visibility.filterMin ?
                    null :
                    <div
                        id='filter-body'
                        style={{
                            gridTemplateColumns: props.windowSmall ?
                                '[start] repeat(1, 1fr) [end]'
                                : '[start] repeat(' + props.gridWidth + ', 1fr) [end]',
                        }}
                    >
                        {/* Search by Name */}
                        <StyledTextField
                            id='filter-name'
                            className={props.filter.Name.length === 0 ? '' : 'filter-category-active'}
                            label='Nikke Name'
                            value={props.filter.Name}
                            onChange={(event) => onFilter('Name', event.target.value)}
                            size={props.windowSmall ? 'small' : 'medium'}
                            fullWidth
                            sx={{
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => onFilter('Name', '')}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    paddingRight: 0
                                }
                            }}
                        />
                        {
                            /* Main tags */
                            // For each category in tags, create a ToggleButtonGroup
                            props.tags.mainCategories.map(category => {
                                return (
                                    <div
                                        className='filter-category flex-column'
                                        key={'category-' + category}
                                        style={{
                                            minWidth: props.windowLarge ? 'revert' : '20%'
                                        }}
                                    >
                                        {
                                            getCategoryHeader(category)
                                        }
                                        {
                                            getButtonGroup(category)
                                        }
                                    </div>
                                )
                            })
                        }

                        {/* Advanced Presets */}
                        <StyledAutocomplete
                            value={presetId}
                            onChange={(event, value, reason) => updatePreset(value, reason)}
                            label='Advanced Presets'
                            size={props.windowSmall ? 'small' : 'medium'}
                            filterOptions={autocompFilterOptions}
                            options={getPresetArray()}
                            renderInput={(params) => renderInput(params, 'Presets')}
                            fullWidth
                            sx={{ gridColumn: '1 / -1' }}
                        />
                    </div>
            }

            {/* Show/Hide Advanced Options */}
            <Button
                id='filter-advanced-btn'
                className='grid-column-span-2'
                onClick={() => handleToggleVisibility('filterAdvanced')}
                variant='contained'
                color='secondary'
                disableTouchRipple
                disableElevation
                fullWidth
            >
                {props.visibility.filterAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </Button>

            {/* Footer: Advanced Options */}
            {
                props.visibility.filterMin ?
                    null :
                    props.visibility.filterAdvanced ?
                        <div
                            id='filter-footer'
                            style={{
                                gridTemplateColumns: props.windowSmall ? '[start] repeat(1, 1fr) [end]' : '[start] 1fr [end]'
                            }}
                        >
                            {/* Favorite Item */}
                            {
                                getFavItemSelect()
                            }

                            {/* Triggers, Skills, Scalings */}
                            {
                                props.tags.advancedCategories.map(category => {
                                    if (Array.isArray(category))
                                        return getLinkedAutocompletes(category);
                                    else
                                        return getAutocomplete(category);
                                })
                            }
                        </div>
                        : null
            }
        </div >
    );
}

export default NikkeFilter;