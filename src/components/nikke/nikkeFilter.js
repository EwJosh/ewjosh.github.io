import React from 'react';
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
        props.setVisibility({
            ...props.visibility,
            'filter': !props.visibility.filter
        });
    }

    const handleToggleTagCategoryVisibility = (category) => {
        // Check if props.visibility.categoryIcons should be true or false
        // Don't check with Burst category. Start on index 1 to skip Burst too
        if (category !== 'Burst') {
            let hasVisibility = false;
            for (let i = 1; i < props.visibility.categories.length; i++) {
                let ctgr = props.visibility.categories[i];
                console.log(category, props.visibility[category],
                    ctgr, props.visibility[ctgr]
                );


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
            console.log(hasVisibility);

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
                props.visibility.filter ?
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
                            sx={{
                                width: props.windowSmall ? '55%' : '70%',
                                padding: '6px 0'
                            }}
                        >
                            Hide Filter
                        </Button>
                        <Button
                            onClick={handleResetFilter}
                            variant='contained'
                            color='error'
                            sx={{
                                width: props.windowSmall ? '40%' : '25%',
                                padding: '6px 0'
                            }}
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
                props.visibility.filter ?
                    (
                        <div id='filter'>
                            {/* Main and misc filter tags */}
                            <div
                                id='filter-list-container'
                                className={props.windowSmall ? 'grid-column' : 'grid-row'}
                                style={{
                                    flexWrap: props.windowSmall ? 'initial' : 'wrap'
                                }}
                            >
                                {
                                    // For each category in tags, create a ToggleButtonGroup
                                    props.tags.categories.map(category => {
                                        return (
                                            <div className='filter-category grid-column' key={'category-' + category}>
                                                {

                                                    (props.visibility.categories.indexOf(category) !== -1) ?
                                                        <div className='filter-category-visibility-container grid-row'>
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
                                                                    onClick={() => handleToggleTagCategoryVisibility(category)}
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
                                                        width: '100%',
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
                                    size='small'
                                    sx={{
                                        minWidth: props.windowSmall ? '80%' : '5rem',
                                        maxWidth: '100%',
                                        marginTop: '0.5em',
                                        flexGrow: 4,
                                        boxSizing: 'border-box'
                                    }}
                                    InputProps={{
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
                                // size='small'
                                sx={{
                                    minWidth: '25%',
                                    marginTop: '1em'
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