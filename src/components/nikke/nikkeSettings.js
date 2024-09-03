import React from 'react';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import Close from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

function NikkeSettings(props) {
    return (
        <Dialog
            id='settings-dialog'
            open={props.settings.open}
            onClose={props.onClose}
            PaperProps={{
                style: {
                    minWidth: '25vw'
                }
            }}
        >
            <DialogTitle className='dialog-header' style={{}}>
                Settings
                <IconButton onClick={props.onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <hr style={{ width: '100%', margin: 0, boxSizing: 'border-box' }} />
            <DialogContent
                id='settings-dialog-body'
                sx={{ overflow: "initial" }}
            >
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
                    labelPlacement='start'
                    sx={{
                        margin: 0,
                        flexDirection: 'row'
                    }}
                />
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
                    labelPlacement='start'
                    sx={{
                        margin: 0,
                        flexDirection: 'row'
                    }}
                />
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
                    labelPlacement='start'
                    sx={{
                        margin: 0,
                        flexDirection: 'row'
                    }}
                />
                <FormControl>
                    <InputLabel id='sett-code-weak-label'>Code Weakness</InputLabel>
                    <Select
                        labelId='sett-code-weak-label'
                        value={props.settings.targetCode}
                        onChange={(event) => props.setSettings({
                            ...props.settings,
                            targetCode: event.target.value
                        })}
                        sx={{
                            // minWidth: '100%'
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
                <FormControlLabel
                    control={<Switch
                        checked={props.debugMode}
                        onChange={() => props.setDebugMode(!props.debugMode)}
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