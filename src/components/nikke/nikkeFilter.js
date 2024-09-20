import React from 'react';

// Import MUI components
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material';

// Import MUI icons
import Close from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// Restyled MUI ToggleButton for coloring them orange when selected.
const StyledToggleButton = styled(ToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: '#b37227'
    }
})

function NikkeFilter(props) {
    /**
     * Toggles a filter option when selected. Calls for a re-filter in Team Builder.
     * @param {string} category Filterable tag category.
     * @param {string} value Filtered tag category's new array.
     */
    const onFilter = (category, value) => {
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
        // Check if props.visibility.categoryIcons should be true or false
        // Don't check with Burst category. Start on index 1 to skip Burst too
        if (category !== 'Burst') {
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
        // If clicked category is Burst, don't check and just flip
        else
            props.setVisibility({
                ...props.visibility,
                [category]: !props.visibility[category]
            })
    }

    /**
     * Resets filter to its initial state.
     */
    const handleResetFilter = () => {
        props.onFilter({
            ...props.tags,
            'Rarity': ['SSR'],  // Initialize Rarity to only have SSR selected.
            'Name': ''          // Add Name to filter (not in Tags) and initialize as blank.
        })
    }

    /**
     * Sets the Name attribute in the filter. Called when the TextField for Nikke Name is updated.
     * @param {string} name Value of the Name being searched.
     */
    const handleSearchedNameChange = (name) => {
        props.onFilter({
            ...props.filter,
            'Name': name
        })
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
        if (props.icons[category] == null)
            return <span>{tag}</span>;
        else if (category === 'Code' && tag === props.targetCode)
            return [
                <img
                    src={props.icons.Highlight}
                    alt={'Highlight'}
                    className={'filter-icon icon-overlay' + (selectState ? ' filter-icon-selected' : ' filter-icon-unselected')}
                />,
                <img
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

    return (
        <div
            id='filter-container'
            className='flex-column'
            style={{
                maxWidth: props.windowSmall ? '100%' : '80vw',
                minWidth: props.mainPage ? '100%' : '80vw'
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
                <h2
                    onClick={() => props.debugMode ? console.log(props.filter) : null}
                >
                    Filter
                </h2>
                {
                    (props.visibility.filterMin) ?
                        null :
                        <Button
                            onClick={handleResetFilter}
                            variant='contained'
                            color='error'
                            sx={{
                                height: props.windowSmall ? '1.5rem' : '100%',
                                minWidth: 'auto',
                                maxWidth: '50%',
                                marginRight: '0rem',
                                borderRadius: '0',
                                position: 'absolute',
                                top: 0,
                                right: '4rem'
                            }}
                        >
                            <SettingsBackupRestoreIcon sx={{ marginRight: props.windowSmall ? 0 : '0.25rem' }} />
                            {props.windowSmall ? null : 'Reset'}
                        </Button>
                }
                <Button
                    onClick={() => handleToggleVisibility('filterMin')}
                    variant='contained'
                    disableTouchRipple
                    color={props.visibility.filterMin ? 'success' : 'pumpkin'}
                    sx={{
                        height: props.windowSmall ? '1.5rem' : '100%',
                        minWidth: 'auto',
                        maxWidth: '50%',
                        borderRadius: props.visibility.filterMin ? '0 0.5rem 0.5rem 0' : '0 0.5rem 0 0',
                        position: 'absolute',
                        top: 0,
                        right: 0
                    }}
                >
                    {
                        props.visibility.filterMin ?
                            <ArrowDropUpIcon />
                            : <ArrowDropDownIcon />
                    }
                </Button>
            </div>
            {/* Body */}
            {
                props.visibility.filterMin ?
                    null :
                    <div
                        id='filter-body'
                        className={props.windowSmall ? 'flex-column' : 'flex-row'}
                        style={{
                            flexWrap: props.windowSmall ? 'initial' : 'wrap'
                        }}
                    >
                        {
                            // * Main tags *
                            // For each category in tags, create a ToggleButtonGroup
                            props.tags.categories.map(category => {
                                return (
                                    <div
                                        className='filter-category flex-column'
                                        key={'category-' + category}
                                        style={{
                                            minWidth: props.windowLarge ? 'revert' : '20%'
                                        }}
                                    >
                                        {

                                            (props.visibility.categories.indexOf(category) !== -1) ?
                                                <div className='filter-category-visibility-container flex-row'>
                                                    <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                                                    {/* Create IconButton for toggling visibility */}
                                                    <Tooltip
                                                        title={props.visibility[category] ?
                                                            'Hide Icons'
                                                            : 'Show Icons'
                                                        }
                                                        placement='top'
                                                    >
                                                        <IconButton
                                                            onClick={() => handleToggleVisibility(category)}
                                                            sx={{ padding: '0', maxWidth: '1rem', maxHeight: '1rem' }}
                                                        >
                                                            {
                                                                props.visibility[category] ?
                                                                    <Visibility sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                                                    : <VisibilityOff sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                                            }
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                : <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                                        }

                                        <ToggleButtonGroup
                                            className='filter-btn-group'
                                            value={props.filter[category]}
                                            onChange={(event, value) => onFilter(category, value)}
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
                                                        return;

                                                    let selectState = isSelected(category, tag);

                                                    return (
                                                        <StyledToggleButton
                                                            value={tag}
                                                            key={'tag-' + tag}
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
                                    </div>
                                )
                            })
                        }
                    </div>
            }

            {/* Footer */}
            {
                props.visibility.filterMin ?
                    null :
                    <div
                        id='filter-footer'
                        className={props.windowSmall ? 'flex-column' : 'flex-row'}
                    >
                        {/* Search by Name */}
                        <TextField
                            id='filter-name'
                            label='Nikke Name'
                            value={props.filter.Name}
                            onChange={(event) => handleSearchedNameChange(event.target.value)}
                            size={props.windowSmall ? 'small' : 'medium'}
                            sx={{
                                minWidth: props.windowSmall ? '100%' : '35%'
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleSearchedNameChange('')}
                                        >
                                            <Close />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                style: {
                                    paddingRight: 0
                                }
                            }}
                        />

                        {/* Misc tags, WIP */}
                        <FormControl
                            id='filter-misc'
                            // size='small'
                            sx={{
                                minWidth: props.windowSmall ? '100%' : '50%',
                                maxWidth: '100%',
                                boxSizing: 'border-box'
                            }}
                            InputProps={{
                            }}
                        >
                            <InputLabel
                                id='filter-misc-input-label'
                                size={props.windowSmall ? 'small' : 'normal'}
                            >Tags (WIP)</InputLabel>
                            <Select
                                labelId='filter-misc-input-label'
                                size={props.windowSmall ? 'small' : 'medium'}
                            >
                                <MenuItem disabled>Coming soon</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
            }
        </div >
    );
}

export default NikkeFilter;