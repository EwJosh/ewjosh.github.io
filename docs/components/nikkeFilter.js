import React, { useState } from 'react';
import { Button, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function NikkeFilter(props) {
    /**
     * Active set of tags to process user filtering and can be modified.
     * [TO IMPLEMENT]
     * Healing, Shields, Piercing, True-Damage-Buff, MagSize-Buff, etc.
     */
    const [filter, setFilter] = useState({
        ...props.tags
    });

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
        if (props.tags[category].length === filter[category].length) {

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

        // Set Filter
        setFilter({
            ...filter,
            [category]: newValue
        });

        props.onFilter({
            ...filter,
            [category]: newValue
        });
    }

    const onToggleFilterVisibility = () => {
        console.log(props);
        props.setVisible({
            ...props.visible,
            'filter': !props.visible.filter
        });
        // console.log(props.visible);
    }

    const onToggleTagCategoryVisibility = (category) => {
        props.setVisible({
            ...props.visible,
            [category]: !props.visible[category]
        })
    }

    /** 
     * @param {string} category The filter category of the tag
     * @param {string} target The tag being filtered
     * @returns true if the target tag exists inside the filtered category
     */
    const isSelected = (category, target) => {
        if (filter[category] == null)
            return false;

        let index = filter[category].indexOf(target);
        if (index < 0)
            return false;
        else
            return true;
    }

    return (
        <div id='filter-container' className='paper-back grid-column'>
            {
                props.visible.filter ?
                    <Button
                        onClick={onToggleFilterVisibility}
                        variant={'outlined'}
                    >
                        Hide Filter
                    </Button>
                    : <Button
                        onClick={onToggleFilterVisibility}
                        variant={'contained'}
                    >
                        Show Filter
                    </Button>
            }
            {
                props.visible.filter ?
                    (
                        <div id='filter'>
                            {
                                // For each category in tags, create a ToggleButtonGroup
                                props.tags.categories.map(category => {
                                    return (
                                        <div className='filter-category grid-column' key={'category-' + category}>
                                            {

                                                (props.visible.categories.indexOf(category) !== -1) ?
                                                    <div className='filter-category-visibility-container grid-row'>
                                                        <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                                                        <IconButton
                                                            onClick={() => onToggleTagCategoryVisibility(category)}
                                                            sx={{ padding: '0', maxWidth: '1rem', maxHeight: '1rem' }}
                                                        >
                                                            {
                                                                props.visible[category] ?
                                                                    <Visibility sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                                                    : <VisibilityOff sx={{ maxWidth: '1rem', maxHeight: '1rem' }} />
                                                            }
                                                        </IconButton>
                                                    </div>
                                                    : <h3>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h3>
                                            }

                                            <ToggleButtonGroup
                                                value={filter[category]}
                                                onChange={(event, value) => onFilter(category, value)}
                                                sx={{
                                                    width: '100%',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {
                                                    // For each tag in a given category, create a ToggleButton with its value
                                                    props.tags[category].map(tag => {
                                                        let selectState = isSelected(category, tag);

                                                        return (
                                                            <ToggleButton
                                                                value={tag}
                                                                color={selectState ? 'success' : 'warning'}
                                                                key={'tag-' + tag}
                                                                sx={{
                                                                    fontWeight: selectState ? 'bold' : 'normal'
                                                                    // fontSize: selectState ? 'large' : 'normal',
                                                                    // padding: selectState ? '10px' : '15px 10px',
                                                                    // border: selectState ? '5% 3%' : '3%',
                                                                    // height: '100%',
                                                                    // width: '2rem'
                                                                }}
                                                            >
                                                                {
                                                                    (props.icons[category] == null) ?
                                                                        <span>{tag}</span> :
                                                                        <img
                                                                            src={props.icons[category][tag]}
                                                                            alt={tag}
                                                                            className={'filter-icon' + (selectState ? ' filter-icon-selected' : ' filter-icon-unselected')}
                                                                        />
                                                                }
                                                            </ToggleButton>
                                                        )
                                                    })
                                                }
                                            </ToggleButtonGroup>
                                        </div>
                                    )
                                })
                            }
                        </div>)
                    : null
            }
        </div>
    );
}

export default NikkeFilter;