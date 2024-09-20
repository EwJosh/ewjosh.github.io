import React, { useState } from 'react';
import Tags from '../../assets/data/NikkeTags.json';

// Import MUI components
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Import MUI icons
import Close from '@mui/icons-material/Close';
import ContentPaste from '@mui/icons-material/ContentPaste';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { styled, Tooltip } from '@mui/material';

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
    const [snackbar, setSnackbar] = useState(false);

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
                    <Close />
                </IconButton>
            </DialogTitle>
            <hr style={{ width: '100%', margin: 0, boxSizing: 'border-box' }} />

            {/* Body */}
            <DialogContent
                id='settings-dialog-body'
                sx={{
                    overflow: "initial",
                    padding: props.windowSmall ? '2rem 0' : '2rem'
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
                    onChange={() => props.updateSettings('allowDuplicates', !props.settings.allowDuplicates)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Allow Duplicate Nikkes </span>

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
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={props.settings.compactMode}
                    onChange={() => props.updateSettings('compactMode', !props.settings.compactMode)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Compact Mode </span>
                {/* Hide Nikke Avatars */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={props.visibility.avatars}
                    onChange={(event) => props.setVisibility({
                        ...props.visibility,
                        avatars: !props.visibility.avatars
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Hide Nikke Avatars </span>
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
                {/* Hide Quick-Move Buttons */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={!props.visibility.quickMove}
                    onChange={(event) => props.setVisibility({
                        ...props.visibility,
                        quickMove: !props.visibility.quickMove
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'>Hide Quick-move in Squads</span>

                {/* === Export Category === */}
                <div className='grid-column-full justify-self-left'>
                    <h3 >Export</h3>
                    <hr />
                </div>
                <Tooltip title='Copy Team Code' placement='top' arrow>
                    <DashedButton
                        className='sett-dashed-btn grid-column-span-3 justify-self-end'
                        onClick={() => onClickCopyButton(false)}
                        color='primary'
                        sx={{
                            minWidth: 0,
                            width: '100%'
                        }}
                    >
                        <ContentPaste />
                        Squads Only
                    </DashedButton>
                </Tooltip>
                <Tooltip title='Copy Team Code' placement='top' arrow>
                    <DashedButton
                        className='sett-dashed-btn grid-column-span-3 justify-self-end'
                        onClick={() => onClickCopyButton(true)}
                        color='primary'
                        sx={{
                            minWidth: 0,
                            width: '100%'
                        }}
                    >
                        <ContentPaste />
                        Squads + Bench
                    </DashedButton>
                </Tooltip>
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
                {/* Debug Mode */}
                {/* <FormControlLabel
                    className='grid-column-full justify-self-center'
                    control={<Switch
                        checked={props.settings.debugMode}
                        onChange={() => props.updateSettings('debugMode', !props.debugMode)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color='warning'
                    />}
                    label='Debug Mode'
                /> */}

            </DialogContent>
        </Dialog >
    );
}

export default NikkeSettings;