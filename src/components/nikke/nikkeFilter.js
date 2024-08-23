import React, { useState } from 'react';
import { Button, ToggleButtonGroup, ToggleButton, IconButton, TextField, InputAdornment, Tooltip, Select, InputLabel, FormControl, MenuItem, styled } from '@mui/material';
import Close from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentPaste from '@mui/icons-material/ContentPaste';

const StyledToggleButton = styled(ToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: '#b37227'
    }
})

function NikkeFilter(props) {
    /**
     * Toggles a filter option when selected
     * @param {string} category Filter category
     * @param {string} value Filtered category's new array
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

    const handleToggleFilterVisibility = () => {
        props.setVisible({
            ...props.visible,
            'filter': !props.visible.filter
        });
    }

    const handleToggleTagCategoryVisibility = (category) => {
        props.setVisible({
            ...props.visible,
            [category]: !props.visible[category]
        })
    }

    const handleResetFilter = () => {
        props.onFilter({ ...props.tags })
    }

    const handleTextChange = (name) => {
        props.onFilter({
            ...props.filter,
            'Name': name
        })
    }

    /** 
     * @param {string} category The filter category of the tag
     * @param {string} target The tag being filtered
     * @returns true if the target tag exists inside the filtered category
     */
    const isSelected = (category, target) => {
        if (props.filter[category] == null)
            return false;

        let index = props.filter[category].indexOf(target);
        if (index < 0)
            return false;
        else
            return true;
    }

    return (
        <div id='filter-container' className='paper-back grid-column'>
            {
                // Hide/Show Filter Button
                props.visible.filter ?
                    <div className='filter-header grid-row'>
                        {
                            props.debugMode ?
                                <Tooltip
                                    title='Print Nikke Lists'
                                    placement='top'
                                >
                                    <IconButton
                                        onClick={() => console.log(props.filter)}
                                        sx={{ backgroundColor: '#ed6c02', width: '1.5rem', height: '1.5rem' }}
                                    >
                                        <ContentPaste sx={{ width: '1rem', height: '1rem' }} />
                                    </IconButton>
                                </Tooltip>
                                : null
                        }
                        <Button
                            onClick={handleToggleFilterVisibility}
                            variant={'outlined'}
                            sx={{ width: '70%' }}
                        >
                            Hide Filter
                        </Button>
                        <Button
                            onClick={handleResetFilter}
                            variant='contained'
                            color='error'
                            sx={{ width: '25%' }}
                        >
                            Reset Filter
                        </Button>
                    </div>
                    :
                    <Button
                        onClick={handleToggleFilterVisibility}
                        variant={'contained'}
                    >
                        Show Filter
                    </Button>
            }
            {
                // Filter options, if shown
                props.visible.filter ?
                    (
                        <div id='filter'>
                            {/* Main and misc filter tags */}
                            <div id='filter-category-container'>
                                {
                                    // For each category in tags, create a ToggleButtonGroup
                                    props.tags.categories.map(category => {
                                        return (
                                            <div className='filter-category grid-column' key={'category-' + category}>
                                                {

                                                    (props.visible.categories.indexOf(category) !== -1) ?
                                                        <div className='filter-category-visibility-container grid-row'>
                                                            <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                                                            {/* Create IconButton for toggling visibility */}
                                                            <Tooltip
                                                                title={props.visible[category] ?
                                                                    'Hide Icons'
                                                                    : 'Show Icons'
                                                                }
                                                                placement='top'
                                                            >
                                                                <IconButton
                                                                    onClick={() => handleToggleTagCategoryVisibility(category)}
                                                                    sx={{ padding: '0', maxWidth: '1rem', maxHeight: '1rem' }}
                                                                >
                                                                    {
                                                                        props.visible[category] ?
                                                                            <Visibility sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                                                            : <VisibilityOff sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                        : <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                                                }

                                                <ToggleButtonGroup
                                                    value={props.filter[category]}
                                                    onChange={(event, value) => onFilter(category, value)}
                                                    sx={{
                                                        width: '100%',
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
                                                                        backgroundColor: '#70809069',
                                                                        fontWeight: selectState ? 'bold' : 'normal',
                                                                        textDecoration: selectState ? 'inherit' : 'line-through',
                                                                        padding: selectState ? '10px' : '9px'
                                                                    }}
                                                                >
                                                                    {
                                                                        (props.icons[category] == null) ?
                                                                            <span>{tag}</span> :
                                                                            <img
                                                                                src={props.icons[category][tag]}
                                                                                alt={tag}
                                                                                className={
                                                                                    'filter-icon' + (
                                                                                        selectState ?
                                                                                            ' filter-icon-selected'
                                                                                            : ' filter-icon-unselected'
                                                                                    )
                                                                                }
                                                                            />
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
                                {/* Misc tags */}
                                <FormControl
                                    id='filter-misc'
                                    sx={{
                                        flexGrow: 4
                                    }}
                                >
                                    <InputLabel id='filter-misc-input-label'>Tags (WIP)</InputLabel>
                                    <Select
                                        labelId='filter-misc-input-label'
                                    >
                                        <MenuItem disabled>Coming soon</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            {/* Search by Name */}
                            <TextField
                                id='filter-name'
                                label='Nikke Name'
                                value={props.filter.Name}
                                onChange={(event) => handleTextChange(event.target.value)}
                                size='small'
                                sx={{
                                    width: '25%'
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleTextChange('')}
                                            >
                                                <Close />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    style: { paddingRight: 0 }
                                }}
                            />
                        </div>)
                    : null
            }
        </div>
    );
}

export default NikkeFilter;