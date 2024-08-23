import React from 'react';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import Close from '@mui/icons-material/Close';

function NikkeSettings(props) {
    return (
        <Dialog
            id='settings-dialog'
            open={props.settings.open}
            onClose={props.onClose}
            PaperProps={{
                style: {
                    minWidth: '50vw'
                }
            }}
        >
            <DialogTitle>
                <div id='settings-dialog-header'>
                    Settings
                    <IconButton onClick={props.onClose}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent
                id='settings-dialog-body'
                sx={{ overflow: "initial" }}
            >
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
                            minWidth: '100%'
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