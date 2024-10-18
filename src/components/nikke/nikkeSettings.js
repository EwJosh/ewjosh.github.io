import React, { useState } from 'react';
import Tags from '../../assets/nikke/data/NikkeTags.json';

// Import MUI components
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material';

// Import MUI icons
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

// Restyled MUI Select and Switch to standardize sizing and coloring.
const StyledSelect = styled(Select)({
    minWidth: '3.75rem',
    maxHeight: '2.5rem',
    backgroundColor: '#ffffff0f'
})
const StyledSwitch = styled(Switch)({
    minWidth: '3.75rem',
    maxHeight: '2.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #767676',
    backgroundColor: '#ffffff0f'
})

// Restyled div container for a MUI Slider.
const StyledSliderContainer = styled('div')({
    width: '6rem',
    height: '2.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #767676',
    backgroundColor: '#ffffff0f',
    justifyContent: 'center',
    alignContent: 'center',
    '.MuiSlider-root': {
        transform: 'translateY(-25%)',
        marginBottom: 0
    },
    '.MuiSlider-mark': {
        height: '8px',
        transform: 'translate(-50%, -50%)'
    },
    '.MuiSlider-markLabel': {
        transform: 'translateX(-50%) translateY(-50%)'
    }
})

// Restyled MUI Button with a Dashed Outlined.
const DashedButton = styled(Button)({
    minWidth: '3.75rem',
    maxHeight: '2.5rem',
    fontWeight: 'bold',
    fontSize: 'large',
    textTransform: 'none',
    outline: '2px dashed #90caf9',
    padding: 0
})

function NikkeSettings(props) {
    // Whether the snackbar/alert for copying links is visible.
    const [snackbar, setSnackbar] = useState(false);

    /**
     * Calls to update Roster Dependents with the new allowDuplicates value.
     * Toggles allowDuplicates and re-filters roster. 
     */
    const onUpdateAllowDuplicates = () => {
        props.updateRosterDependents({ allowDuplicates: !props.settings.allowDuplicates });
    }

    /**
     * Calls to update Roster Dependents with the new maxRosterSize value.
     * Sets maxRosterSize to value and re-filters roster. 
     * 
     * @param {number} value Limit of how many Nikkes can be rendered in Roster.
     */
    const onUpdateMaxRosterSize = (value) => {
        props.updateRosterDependents({ maxRosterSize: value });
    }

    /**
     * Updates compactMode to the new value. Also ensures Roster is not minimized when updated.
     * 
     * @param {number} value Value determining compactMode's status. (==0 if disabled, <0 if enabled to the left, >0 if enabled to the right)
     */
    const onUpdateCompactMode = (value) => {
        props.setVisibility({
            ...props.visibility,
            rosterMin: false
        });
        props.updateSettings('compactMode', value);
    }

    /**
     * Calls to copy the URI with the desired queries to the system's clipboard.
     * 
     * @param {boolean} benchWanted if true, the bench query will be included.
     */
    const onClickCopyButton = (benchWanted) => {
        props.copyUriQueryToClipboard(benchWanted);
        setSnackbar(true);
    }

    return (
        <Dialog
            id='settings-dialog'
            open={props.settings.openSettings}
            onClose={props.onClose}
            PaperProps={{
                style: {
                    minWidth: props.windowSmall ? '95vw' : '25vw'
                }
            }}
        >
            {/* Header */}
            <DialogTitle className='dialog-header'>
                Settings
                <IconButton onClick={props.onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <hr />

            {/* Body */}
            <DialogContent
                id='settings-dialog-body'
                sx={{
                    overflow: "initial",
                    padding: props.windowSmall ? '2rem 1rem' : '2rem'
                }}
            >

                {/* === General Category === */}
                <div className='grid-column-full justify-self-left'>
                    <h3 >General</h3>
                    <hr />
                </div>
                {/* Code Weakness */}
                <StyledSelect
                    className='grid-column-span-2 justify-self-end'
                    value={props.settings.targetCode}
                    onChange={(event) => props.updateSettings('targetCode', event.target.value)}
                    SelectDisplayProps={{
                        style: {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }}
                >
                    <MenuItem value='None'>
                        <img
                            className='sett-select-icon'
                            src={props.icons.Blank}
                            alt='sett-select-None'
                        />
                        None
                    </MenuItem>
                    {
                        Tags.Code.map(code => {
                            return <MenuItem key={code} value={code}>
                                <img
                                    className={'sett-select-icon'}
                                    src={props.icons.Code[code]}
                                    alt={'sett-select-' + code}
                                />
                                {code}
                            </MenuItem>
                        })
                    }
                </StyledSelect>
                <span className='grid-column-span-4 justify-self-start'>Code Weakness</span>
                {/* Enable Reviews */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={props.settings.enableReviews}
                    onChange={() => props.updateSettings('enableReviews', !props.settings.enableReviews)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'>Enable Reviews</span>
                {/* Allow Duplicates */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={props.settings.allowDuplicates}
                    onChange={onUpdateAllowDuplicates}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Allow Duplicate Nikkes </span>
                {/* Max Nikkes in Roster */}
                <StyledSelect
                    className='grid-column-span-2 justify-self-end'
                    value={props.settings.maxRosterSize}
                    onChange={(event) => onUpdateMaxRosterSize(event.target.value)}
                >
                    <MenuItem value={16}>
                        16
                    </MenuItem>
                    <MenuItem value={32}>
                        32
                    </MenuItem>
                    <MenuItem value={64}>
                        64
                    </MenuItem>
                    <MenuItem value={256}>
                        ALL
                    </MenuItem>
                </StyledSelect>
                <span
                    className='grid-column-span-4 justify-self-start'
                >
                    Max Nikkes in Roster
                </span>

                {/* === Visibility Category === */}
                <div className='grid-column-full justify-self-left'>
                    <h3 >Visibility</h3>
                    <hr />
                </div>
                {/* Squads Displayed Per Row */}
                <StyledSelect
                    className='grid-column-span-2 justify-self-end'
                    value={props.settings.squadsPerRow}
                    onChange={(event) => props.updateSettings('squadsPerRow', event.target.value)}
                >
                    <MenuItem value={1}>
                        1
                    </MenuItem>
                    <MenuItem value={2}>
                        2
                    </MenuItem>
                    <MenuItem value={3} disabled={props.windowSmall}>
                        3
                    </MenuItem>
                </StyledSelect>
                <span
                    className='grid-column-span-4 justify-self-start'
                >
                    Squads Displayed per Row
                </span>
                {/* Compact Mode */}
                <StyledSliderContainer
                    className='grid-column-span-2 justify-self-end'
                >
                    <Slider
                        value={props.settings.compactMode}
                        onChange={(event, value) => onUpdateCompactMode(value)}
                        color={props.settings.compactMode === 0 ? 'unselected' : 'warning'}
                        track={false}
                        marks={[
                            { value: -1, label: 'Left' },
                            { value: 0, label: 'Off' },
                            { value: 1, label: 'Right' }
                        ]}
                        min={-1}
                        step={1}
                        max={1}
                        size='small'

                    />
                </StyledSliderContainer>
                <span className='grid-column-span-4 justify-self-start'> Compact Mode </span>
                {/* Hide Nikke Portrait Background */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={!props.visibility.portraitGradient}
                    onChange={(event) => props.setVisibility({
                        ...props.visibility,
                        portraitGradient: !props.visibility.portraitGradient
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Hide background for Nikke portraits </span>
                {/* Hide Filter */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={!props.visibility.filter}
                    onChange={(event) => props.setVisibility({
                        ...props.visibility,
                        filter: !props.visibility.filter
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Hide Filter </span>
                {/* Hide Quick-Move and Info Buttons */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={!props.visibility.squadClean}
                    onChange={(event) => props.setVisibility({
                        ...props.visibility,
                        squadClean: !props.visibility.squadClean
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'>Hide Quick Move and Info buttons in Squads</span>

                {/* === Export Category === */}
                <div className='grid-column-full justify-self-left'>
                    <h3 >Export</h3>
                    <hr />
                </div>
                {/* Copy URL: Squads Only */}
                <Tooltip title='Copy Team URL' placement='top' arrow>
                    <DashedButton
                        className={
                            props.windowSmall ?
                                'sett-dashed-btn grid-column-full '
                                : 'sett-dashed-btn grid-column-span-3'
                        }
                        onClick={() => onClickCopyButton(false)}
                        color='primary'
                        sx={{
                            minWidth: 0,
                            width: '100%'
                        }}
                    >
                        <ContentPasteIcon />
                        Squads Only
                    </DashedButton>
                </Tooltip>
                {/* Copy URL: Squads and Bench */}
                <Tooltip title='Copy Team URL' placement='top' arrow>
                    <DashedButton
                        className={
                            props.windowSmall ? 'grid-column-full' : 'grid-column-span-3'
                        }
                        onClick={() => onClickCopyButton(true)}
                        color='primary'
                        sx={{
                            minWidth: 0,
                            width: '100%'
                        }}
                    >
                        <ContentPasteIcon />
                        Squads + Bench
                    </DashedButton>
                </Tooltip>

                {/* Snackbar/Alert for copying links */}
                <Snackbar
                    open={snackbar}
                    onClose={() => setSnackbar(false)}
                    autoHideDuration={5000}
                >
                    <Alert
                        onClose={() => setSnackbar(false)}
                        severity='success'
                    >
                        Link copied to clipboard
                    </Alert>
                </Snackbar>
            </DialogContent>
        </Dialog >
    );
}

export default NikkeSettings;