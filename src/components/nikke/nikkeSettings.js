import React from 'react';

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

// Import MUI icons
import Close from '@mui/icons-material/Close';
import ContentPaste from '@mui/icons-material/ContentPaste';

function NikkeSettings(props) {
    return (
        <Dialog
            id='settings-dialog'
            open={props.settings.openSettings}
            onClose={props.onClose}
            PaperProps={{
                style: {
                    minWidth: '25vw'
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
                sx={{ overflow: "initial" }}
            >
                {/* Code Weakness */}
                <FormControl>
                    <InputLabel
                        id='sett-code-weak-label'
                        sx={{
                            backgroundColor: '#383838',
                            padding: '0 0.5rem'
                        }}
                    >Code Weakness</InputLabel>
                    <Select
                        labelId='sett-code-weak-label'
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
                        <MenuItem value='Electric'>
                            <img
                                className='sett-select-icon'
                                src={props.icons.Code.Electric}
                                alt='sett-select-Electric'
                            />
                            Electric
                        </MenuItem>
                        <MenuItem value='Fire'>
                            <img
                                className='sett-select-icon'
                                src={props.icons.Code.Fire}
                                alt='sett-select-Fire'
                            />
                            Fire
                        </MenuItem>
                        <MenuItem value='Iron'>
                            <img
                                className='sett-select-icon'
                                src={props.icons.Code.Iron}
                                alt='sett-select-Iron'
                            />
                            Iron
                        </MenuItem>
                        <MenuItem value='Water'>
                            <img
                                className='sett-select-icon'
                                src={props.icons.Code.Water}
                                alt='sett-select-Water'
                            />
                            Water
                        </MenuItem>
                        <MenuItem value='Wind'>
                            <img
                                className='sett-select-icon'
                                src={props.icons.Code.Wind}
                                alt='sett-select-Wind'
                            />
                            Wind
                        </MenuItem>
                    </Select>
                </FormControl>
                <Button
                    id='sett-export-btn'
                    onClick={props.getSquadId}
                    startIcon={<ContentPaste />}
                    color='primary'
                    sx={{
                    }}
                >
                    Copy Team Link
                </Button>
                {/* Enable Ratings */}
                <FormControlLabel
                    control={<Switch
                        checked={props.settings.enableRatings}
                        onChange={(event) => props.setSettings({
                            ...props.settings,
                            enableRatings: !props.settings.enableRatings
                        })}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color='warning'
                    />}
                    label='Enable Ratings'
                />
                {/* Allow Duplicates */}
                <FormControlLabel
                    control={<Switch
                        checked={props.settings.allowDuplicates}
                        onChange={(event) => props.setSettings({
                            ...props.settings,
                            allowDuplicates: !props.settings.allowDuplicates
                        })}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color='warning'
                    />}
                    label='Allow Duplicate Nikkes'
                />
                {/* Hide Filter */}
                <FormControlLabel
                    control={<Switch
                        checked={!props.visibility.filter}
                        onChange={(event) => props.setVisibility({
                            ...props.visibility,
                            filter: !props.visibility.filter
                        })}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color='warning'
                    />}
                    label='Hide Filter'
                />
                {/* Hide Quick-Move Buttons */}
                <FormControlLabel
                    control={<Switch
                        checked={!props.visibility.quickMove}
                        onChange={(event) => props.setVisibility({
                            ...props.visibility,
                            quickMove: !props.visibility.quickMove
                        })}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color='warning'
                    />}
                    label='Hide Quick-move in Squads'
                />
                {/* Debug Mode */}
                <FormControlLabel
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
                />

            </DialogContent>
        </Dialog >
    );
}

export default NikkeSettings;