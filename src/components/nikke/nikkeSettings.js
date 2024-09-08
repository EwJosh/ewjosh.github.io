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

// Import MUI icons
import Close from '@mui/icons-material/Close';
import ContentPaste from '@mui/icons-material/ContentPaste';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { styled, Tooltip } from '@mui/material';

const StyledSelect = styled(Select)({
    minWidth: '3.75rem',
    backgroundColor: '#ffffff0f'
})

const StyledSwitch = styled(Switch)({
    minWidth: '3.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #767676',
    backgroundColor: '#ffffff0f'
})

function NikkeSettings(props) {
    const [squadId, setSquadId] = useState(props.getSquadId());

    const onSquadIdUpdate = (event) => {
        setSquadId(event.target.value);
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
                {/* Code Weakness */}
                <StyledSelect
                    className='grid-column-span-2 justify-self-end'
                    value={props.settings.targetCode}
                    onChange={(event) => props.setSettings({
                        ...props.settings,
                        targetCode: event.target.value
                    })}
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
                {/* Squads Displayed Per Row */}
                <StyledSelect
                    className='grid-column-span-2 justify-self-end'
                    value={props.settings.squadsPerRow}
                    onChange={(event) => props.setSettings({
                        ...props.settings,
                        squadsPerRow: event.target.value
                    })}
                >
                    <MenuItem value={1}>
                        1
                    </MenuItem>
                    <MenuItem value={2} disabled={props.windowSmall}>
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
                {/* Enable Ratings */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={props.settings.enableRatings}
                    onChange={(event) => props.setSettings({
                        ...props.settings,
                        enableRatings: !props.settings.enableRatings
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'>Enable Ratings</span>
                {/* Allow Duplicates */}
                <StyledSwitch
                    className='grid-column-span-2 justify-self-end'
                    checked={props.settings.allowDuplicates}
                    onChange={(event) => props.setSettings({
                        ...props.settings,
                        allowDuplicates: !props.settings.allowDuplicates
                    })}
                    inputProps={{ 'aria-label': 'controlled' }}
                    color='warning'
                />
                <span className='grid-column-span-4 justify-self-start'> Allow Duplicate Nikkes </span>
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
                {/* Export/Import Section s0=83-53-98-93-68&s1=38-85-86-97&s2=20-99-100-102&s3=118 */}
                <Tooltip title='Copy Team Code' placement='top' arrow>
                    <Button
                        id='sett-export-btn'
                        className='grid-column-span-1 justify-self-end'
                        onClick={props.copySquadIdToClipboard}
                        color='primary'
                        sx={{
                            minWidth: 0,
                            width: '100%'
                        }}
                    >
                        <ContentPaste />
                    </Button>
                </Tooltip>

                <TextField
                    className='grid-column-span-4 justify-self-center'
                    defaultValue={props.getSquadId()}
                    onChange={onSquadIdUpdate}
                    sx={{
                        width: '100%',
                        backgroundColor: '#ffffff0f'
                    }}
                >
                </TextField>
                <Tooltip title='Import Team via Code' placement='top' arrow>
                    <Button
                        className='grid-column-span-1 justify-self-end'
                        id='sett-export-btn'
                        onClick={() => props.readSquadId(squadId)}
                        color='primary'
                        sx={{
                            minWidth: 0,
                            width: '100%'
                        }}
                    >
                        <KeyboardReturnIcon />
                    </Button>
                </Tooltip>
                {/* </div> */}
                {/* Debug Mode */}
                {/* <FormControlLabel
                    control={<Switch
                        checked={props.settings.debugMode}
                        onChange={() => props.setSettings({
                            ...props.settings,
                            debugMode: !props.debugMode
                        })}
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