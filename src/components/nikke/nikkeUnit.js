import React, { useState } from 'react';
import Color from 'color';
import { Draggable } from '@hello-pangea/dnd';

// Import MUI components
import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener';

// Import MUI icons
import AddIcon from '@mui/icons-material/AddOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoIcon from '@mui/icons-material/InfoTwoTone';

// Color objects
const RED = Color.rgb(242, 109, 92);
const GREEN = Color.rgb(63, 184, 63);
const BLUE = Color.rgb(50, 152, 242);
const ORANGE = Color.rgb(255, 159, 64);
const YELLOW = Color.rgb(217, 224, 80);
const PURPLE = Color.rgb(94, 75, 170);
const PINK = Color.rgb(255, 155, 205);
const WHITE = Color.rgb(223, 223, 223);
const BLACK = Color.rgb(31, 31, 31);
// Array of skill target tags that target enemies. (SkTg Tags not found here target allies).
const ENEMIES = [
    "All Enemies",
    "Partial Enemies",
    "Single Enemy",
    "Code Enemies",
    "Target Enemies",
    "In-range Enemies"
];
// Array of skill target tags that are arbitrarily defined as 'basic' to allow for more color variation.
const BASIC_TARGETS = [
    "All Allies",
    "Partial Allies",
    "Self",
    "All Enemies",
    "Partial Enemies",
    "Single Enemy"
];

// Styled component for the (+/-) Quick-move Button.
const QuickMoveButton = styled(IconButton)({
    border: 'solid 2px',
    width: '1em',
    height: '1em',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    '&:hover': {
        backgroundColor: '#fff',
        filter: 'brightness(80%)'
    }
});

// Styled component for the (i) Info Button.
const InfoButton = styled(IconButton)({
    width: '1em',
    height: '1em',
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000000a0',
    '&:hover': {
        backgroundColor: '#000000a0',
        filter: 'brightness(120%)'
    }
});

function NikkeUnit(props) {
    // State for the anchor element used to place the popper.
    const [anchorEl, setAnchorEl] = useState(null);

    /**
     * Returns the className this Unit should have depending on the circumstances.
     * All units have 'nikke-unit'.
     * If windowSmall is active, append ' nikke-unit-small' to enable shrunken styling choices.
     * If bottom tag icons are hidden, append ' nikke-unit-hidden-icons' to skip the icons' div.
     * @returns React prop className that fits the Unit.
     */
    const getUnitClassName = () => {
        // Always have nikke-unit as a base.
        let className = 'nikke-unit';

        // If windowSmall is active, append ' nikke-unit-small' to enable shrunken styling choices.
        if (props.windowSmall)
            className += ' nikke-unit-small';

        // If bottom tag icons are hidden, append ' nikke-unit-hidden-icons' to skip the icons' div.
        if (!props.visibility.categoryIcons)
            className += ' nikke-unit-hidden-icons';

        if (props.hasTargetCode)
            className += ' highlight';

        return className;
    }

    /**
     * Returns the className this Unit's name span should have depending on the amount of characters in their name.
     * (e.g. 'nikke-name-long', 'nikke-name-xlong', 'nikke-name-xxlong')
     * @returns React prop className that fits the name span.
     */
    const getNameClassName = () => {
        let name = props.unit.Title;
        if (name == null)
            name = props.unit.Name;

        if (name.length >= 12)
            return ' nikke-name-xxlong';
        else if (name.length >= 11)
            return ' nikke-name-xlong';
        else if (name.length >= 8)
            return ' nikke-name-long';
        else
            return '';
    }

    /**
     * Creates a React component used for the quick-movment of a Nikke.
     * Comes with a Tooltip (describes action) and a (+) or (-) icon.
     * Results are dependent on the Unit's current section.
     * @returns Returns a React component for quick-moving a Nikke.
     */
    const getAddRemoveButton = () => {
        // If in Roster: Say 'Move to Bench' and use a (+) icon.
        if (props.sectionId === 'roster')
            return <Tooltip title='Move to Bench' placement='top' arrow>
                <AddIcon fontSize='small' />
            </Tooltip>;

        // If in Bench: Say 'Move to Roster' and use a (-) icon.
        else if (props.sectionId === 'bench')
            return <Tooltip title='Move to Roster' placement='top' arrow>
                <RemoveIcon fontSize='small' />
            </Tooltip>;

        // If in Squad: Say 'Move to Bench' and use a (-) icon.
        else
            return <Tooltip title='Move to Bench' placement='top' arrow>
                <RemoveIcon fontSize='small' />
            </Tooltip>;
    }

    /**
     * Calls the onMoveNikke function in its parent to deal with quick-moving a nikke.
     * Also ensures the popper is closed.
     */
    const onMoveNikke = () => {
        // Close Popper
        setAnchorEl(null);

        props.onMoveNikke(props.unit.Id, props.index);
    }

    /**
     * Getter for a Popper of detailed Nikke data.
     * @returns React component popper that displays Nikke data.
     */
    const getPopper = () => {
        return <Popper
            id='nikke-unit-popper'
            open
            anchorEl={anchorEl}
            placement='right-start'
            modifiers={[{
                name: 'flip',
                options: {
                    fallbackPlacements: ['right-end', 'left-start', 'left-end']
                },
            }]}
        >
            <ClickAwayListener
                onClickAway={() => setAnchorEl(null)}
            >
                {/* Popper content (Border color is Nikke's character color) */}
                <div
                    className='nikke-unit-details flex-column'
                    style={{
                        borderColor: '#' + props.unit.Color
                    }}
                >
                    {/* Name and other basic information */}
                    <h3>{props.unit.Name}</h3>
                    <hr />
                    <span ><b>Rarity:</b> {getChip('Rarity', props.unit.Rarity)}</span>
                    <span>
                        <b>Burst:</b>&nbsp;
                        {getChip('Burst', props.unit.Burst)}
                        &nbsp;:&nbsp;
                        {getChip('Burst Cooldown', props.unit['Burst Cooldown'])}
                    </span>
                    {
                        props.visibility.categories.map(ctgr =>
                            <span><b>{ctgr}:</b> {getChip(ctgr, props.unit[ctgr])}</span>
                        )
                    }
                    <hr />

                    {/* Advanced information */}
                    {
                        Boolean(props.unit.Triggers) ?
                            [
                                <span><b>Triggers:</b></span>,
                                <ul>{categoryToLi('Triggers')}</ul>
                            ] : null
                    }
                    {
                        (Boolean(props.unit['Scaling Stats']) || Boolean(props.unit['Scaling Stats'])) ?
                            [
                                <span><b>Scaling:</b></span>,
                                <ul>{categoriesToLi(['Scaling Stats', 'Scaling Effects'])}</ul>
                            ] : null
                    }
                    {
                        (Boolean(props.unit['Skill Effects']) || Boolean(props.unit['Skill Targets'])) ?
                            [
                                <span><b>Skills:</b></span>,
                                <ul>{categoriesToLi(['Skill Effects', 'Skill Targets'])}</ul>
                            ] : null
                    }
                </div>
            </ClickAwayListener>
        </Popper>
    }

    /**
     * Builds an array of data chip components to be used in a list.
     * @param {string} category Data category to build an array of list items from.
     * @returns an Array of list item components (<li>) of styled data.
     */
    const categoryToLi = (category) => {
        // Fetch unit's data, an array relative to the given category.
        let arr = props.unit[category]

        // Convert array, if it exists, into <li> component each containing a chip.
        return arr.map((item, index) => {
            return <li key={index}>{getChip(category, item)}</li>
        });
    }

    /**
     * Builds an array of linked data chip components to be used in a list.
     * @param {Array<String>} categories Array of data categories to build an array of list items from.
     * @returns an Array of list item components (<li>) of linked styled data.
     */
    const categoriesToLi = (categories) => {
        // Fetch unit's data, a 2D array relative to the given categories.
        let arrs = categories.map(ctgr =>
            props.unit[ctgr]
        );

        // Find the largest length of the given categories to allow full parsing.
        // (They should be equal length, but just in case...)
        let lengths = arrs.map(arr => {
            if (arr == null)
                return 0;
            return arr.length;
        });
        let maxLength = Math.max(...lengths);

        // Build an array of <li> containing chips linked together by spanned ' : '.
        let linkedArr = [];
        // Loop down the arrays index-first.
        for (let i = 0; i < maxLength; i++) {
            let link = [];
            // Per index, loop through the fetched categories.
            for (let j = 0; j < arrs.length; j++) {
                // Fetch the indexed tag.
                let tag = arrs[j][i];

                // If null, continue. If precedented, prepend a ' : '.
                if (tag == null)
                    continue;
                if (link.length !== 0)
                    link.push(<span>&nbsp;:&nbsp;</span>);

                // Push the chip.
                link.push(getChip(categories[j], tag));
            }
            // After a given index, push the link to the array.
            linkedArr.push(
                <li key={i}>{link}</li>
            );
        }

        // Return the array.
        return linkedArr;
    }

    /**
     * Builds a chip component whose style depends on the given arguments.
     * Called by getPopper() through either categoryToLi() or categoriesToLi().
     * @param {string} category Data category being viewed.
     * @param {string} value Data value derived from the given category.
     * @returns A <span> component in the style of a chip dependent on the given arguments.
     */
    const getChip = (category, value) => {
        // Fetch style object relative to arguments.
        let chipStyle = getChipStyle(category, value);

        // If category is Burst Cooldown, append ' sec' to give context.
        if (category === 'Burst Cooldown')
            value = value + ' sec';

        // Build chip and return.
        return <span
            className='tag-chip'
            style={chipStyle}
        >
            {value}
        </span >;
    }

    /**
     * Builds an object containing React-ready CSS styles depending on the given arguments.
     * Called by getPopper() eventually through getChip().
     * @param {string} category Data category being viewed.
     * @param {string} value Data value derived from the given category.
     * @returns An Object containing React-formatted CSS styles depent on the given arguments.
     */
    const getChipStyle = (category, value) => {
        // Initialize style object to build and return.
        let style = {};
        // Initialize background object. Default it to WHITE.
        let bgColor = WHITE;

        // Styles for Rarity chips.
        if (category === 'Rarity') {
            // Mirror in-game color representation of R/SR/SSR as Blue/Purple/Yellow.
            if (value === 'R')
                bgColor = BLUE;
            else if (value === 'SR')
                bgColor = PURPLE;
            else if (value === 'SSR')
                bgColor = YELLOW;
        }
        // Styles for Burst chips.
        else if (category === 'Burst') {
            // Color based on Burst Stage: 1->2->3 as Green->Yellow->Red.
            // (Personally/arbitrarily decided; akin to stop lights or colors common in Google Sheets.)
            if (value === '1' || value === '1R')
                bgColor = GREEN;
            else if (value === '2' || value === '2R')
                bgColor = YELLOW;
            else if (value === '3')
                bgColor = RED;
            else if (value === 'V')
                bgColor = BLACK;

            // If the Burst skill re-enters the stage, darken it enough to invert the text color.
            if (value === '1R')
                bgColor = bgColor.darken(0.25);
            else if (value === '2R')
                bgColor = bgColor.darken(0.5);
        }
        // Styles for Burst Cooldown chips.
        else if (category === 'Burst Cooldown') {
            // Color based on duration of cooldown. Similar scheme to Burst above.
            if (value === '20')
                bgColor = GREEN;
            else if (value === '40')
                bgColor = YELLOW;
            else if (value === '60')
                bgColor = RED;
        }
        // Styles for Code chips.
        else if (category === 'Code') {
            // Mirror in-game color representation of the respective Codes/Elements.
            if (value === 'Electric')
                bgColor = PURPLE;
            else if (value === 'Fire')
                bgColor = RED;
            else if (value === 'Iron')
                bgColor = ORANGE;
            else if (value === 'Water')
                bgColor = BLUE;
            else if (value === 'Wind')
                bgColor = GREEN;
        }
        // Styles for Weapon chips.
        else if (category === 'Weapon') {
            // Color based on Weapon. Sorta relates a weapon's color to a notable user.
            // Focus on assigning the subtractive primary and secondary colors (RYB-OGP).
            if (value === 'AR')
                bgColor = PURPLE;   // Scarlet
            else if (value === 'MG')
                bgColor = ORANGE;   // Modernia
            else if (value === 'RL')
                bgColor = BLUE;     // Laplace
            else if (value === 'SG')
                bgColor = GREEN;    // Guilty or Noir's Wind Code (leftover color tbh)
            else if (value === 'SMG')
                bgColor = YELLOW;   // Liter
            else if (value === 'SR')
                bgColor = RED;      // Red Hood or Alice
            // bgColor = BLACK;
            // style = { ...style, padding: '2px 4px', border: '1px solid #eee' }
        }
        // Styles for Class chips.
        else if (category === 'Class') {
            // Color based on Class. Relates to the feel of the class's role.
            // Focus on assigning the additive primary colors (RGB).
            if (value === 'Attacker')
                bgColor = RED;
            else if (value === 'Supporter')
                bgColor = GREEN;
            else if (value === 'Defender')
                bgColor = BLUE;
        }
        // Styles for Company chips.
        else if (category === 'Company') {
            // Mirror in-game color representation of the respective Company/Manufacturer's CEO.
            if (value === 'Elysion')
                bgColor = RED;      // Ingrid
            else if (value === 'Missilis')
                bgColor = PURPLE;   // Syuen
            else if (value === 'Tetra')
                bgColor = YELLOW;   // Mustang
            else if (value === 'Pilgrim')
                bgColor = BLUE;     // Andersen (Technically should be Brown, but Green is more distinct.)
            else if (value === 'Abnormal')
                bgColor = BLACK;    // No CEO
        }
        // Styles for Scaling Stats chips.
        else if (category === 'Scaling Stats') {
            // Color based on stat. Relates to the feel or user of the stat.
            if (value === 'ATK' || value === 'Final ATK')
                bgColor = RED;
            else if (value === 'DEF' || value === 'Final DEF')
                bgColor = BLUE;
            else if (value === 'Max HP' || value === 'Final Max HP')
                bgColor = GREEN;
            else if (value === 'Charge Spd')
                bgColor = ORANGE;
            else if (value === 'HP Loss')
                bgColor = PURPLE;
            else if (value === 'Max Ammo')
                bgColor = PINK;

            // Darken color if stat uses Final calculations.
            if (value === 'Final ATK' || value === 'Final DEF' || value === 'Final Max HP')
                bgColor = bgColor.darken(0.3);
        }
        // Styles for Scaling Effects chips.
        else if (category === 'Scaling Effects') {
            // Color based on effect. Relates to the feel or user of the effect.
            if (value === 'Deal Dmg')
                bgColor = RED;
            else if (value === 'Buff Dmg')
                bgColor = GREEN
            else if (value === 'Sustain')
                bgColor = BLUE;
        }
        // Styles for Skill Targets chips.
        else if (category === 'Skill Targets') {
            // Color based on target. Green for allies, Red for enemies. 
            if (ENEMIES.indexOf(value) === -1)
                bgColor = GREEN;
            else
                bgColor = RED;

            // Darken if not a basic target to allow for more varied colors.
            if (BASIC_TARGETS.indexOf(value) === -1)
                bgColor = bgColor.darken(0.3);
        }

        // Create style object. Set text color to contrast background color.
        if (bgColor != null)
            style = {
                ...style,
                color: bgColor.isDark() ? '#eee' : '#111',
                backgroundColor: bgColor
            };

        // Return style, if exists.
        return Boolean(style) ? style : null;
    }

    return (
        <Draggable
            // NOTE: Draggable *has* to use initial unit name as ID, otherwise element gets eaten when dragged
            draggableId={props.unit.Id + '-' + props.sectionId + '-' + props.index}
            key={props.unit.Id}
            index={props.index}
            isDragDisabled={props.sectionId === 'roster'}
        >
            {(provided) => (
                // NOTE: Do NOT add a MUI style prop to a Draggable child. Gets laggy/kinda broken.
                <div
                    className={getUnitClassName()}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {/* Image Container */}
                    <div className='nikke-image-container'>
                        {/* Quick Move Button */}
                        {
                            (props.sectionId === 'bench' || props.sectionId === 'roster' || props.visibility.squadClean) ?
                                <QuickMoveButton
                                    onClick={onMoveNikke}
                                    // variant='outlined'
                                    disableTouchRipple
                                    size='small'
                                    color={props.sectionId !== 'bench' ? 'success' : 'error'}
                                >
                                    {getAddRemoveButton()}
                                </QuickMoveButton>
                                : null
                        }
                        {/* Info Button */}
                        {
                            (props.sectionId === 'bench' || props.sectionId === 'roster' || props.visibility.squadClean) ?
                                <InfoButton
                                    onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
                                    disableTouchRipple
                                    size='small'
                                    color='info'
                                >
                                    <Tooltip title='More Details' placement='top' arrow>
                                        <InfoIcon fontSize='small' />
                                    </Tooltip>
                                </InfoButton>
                                : null
                        }

                        {/* Portrait Image */}
                        <img
                            className='nikke-image'
                            src={props.portrait}
                            alt={props.unit.Name}
                            style={{
                                borderColor: '#' + props.unit.Color,
                                backgroundImage: props.visibility.portraitGradient ?
                                    'linear-gradient(#00000000 40%, #' + props.unit.Color + ' 90%)'
                                    : 'none'
                            }}
                        />

                        {/* Favorite Item Icon */}
                        {
                            props.favItemIcon == null || !props.visibility.FavItem ?
                                null
                                : <img
                                    className={
                                        props.unit.favAble ?
                                            'nikke-icon nikke-fav-item fav-able'
                                            : 'nikke-icon nikke-fav-item fav-boosted'
                                    }
                                    src={props.favItemIcon}
                                    alt={
                                        props.unit.favAble ?
                                            'Without Favorite Item'
                                            : 'With Favorite Item'
                                    }
                                />
                        }

                        {/* Burst Icon */}
                        {
                            props.visibility['Burst'] ?
                                <div
                                    className='nikke-icon nikke-burst flex-row'
                                >
                                    <img
                                        className='nikke-icon-base'
                                        src={props.burstIcons[0]}
                                        alt={'Burst ' + props.unit.Burst}
                                    />
                                    {
                                        props.visibility['Burst Cooldown'] ? <img
                                            className='icon-underlay'
                                            src={props.burstIcons[1]}
                                            alt={props.unit['Burst Cooldown'] + 'sec'}
                                        />
                                            : null
                                    }
                                </div>
                                : null
                        }
                    </div>

                    {/* Name Container */}
                    <div className='nikke-name-container'>
                        <span className={'nikke-name' + getNameClassName()}>{props.unit.Title || props.unit.Name}</span>
                    </div>

                    {/* Tag Container */}
                    {
                        props.visibility.categoryIcons ?
                            < div
                                className='nikke-icon-container'
                                style={{
                                    backgroundColor: !props.visibility.Rarity ?
                                        null : props.unit.Rarity === 'SSR' ?
                                            '#ffe44960' : props.unit.Rarity === 'SR' ?
                                                '#ef88ff60' : '#49b9ff60'
                                }}>
                                {
                                    props.visibility.categories.map((category, index) => {
                                        if (category === 'Code' && props.visibility['Code'] && props.hasTargetCode)
                                            return <div
                                                key={category}
                                                className='nikke-icon flex-row'
                                            >
                                                <img
                                                    key={category}
                                                    className='icon-overlay'
                                                    src={props.highlightIcon}
                                                    alt={'Highlighted'}
                                                />
                                                <img
                                                    className='nikke-icon-base'
                                                    src={props.tagIcons[index]}
                                                    alt={category + ' ' + props.unit[category]}
                                                />
                                            </div>;
                                        else if (category !== 'Burst' && props.visibility[category])
                                            return <img
                                                key={category}
                                                className='nikke-icon'
                                                src={props.tagIcons[index]}
                                                alt={category + ' ' + props.unit[category]}
                                            />;
                                        else
                                            return null;
                                    })
                                }
                            </div>
                            : null
                    }
                    {
                        Boolean(anchorEl) ? getPopper() : null
                    }
                </div>
            )
            }
        </Draggable >
    );
}

export default NikkeUnit;