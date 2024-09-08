import React, { useEffect } from 'react';
import "./clock.css";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

function Clock() {
    // const [shrtOptions, setShrtOptions] = React.useState({
    //     year: "2-digit",
    //     month: "2-digit",
    //     day: "2-digit",
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     second: "2-digit",
    //     hour12: false,
    //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //e.g. "America/Los_Angeles"
    //     timeZoneName: "shortOffset"
    // });
    const [longOptions, setLongOptions] = React.useState({
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //e.g. "America/Los_Angeles"
        timeZoneName: "short"
    });
    // const [time, setTime] = React.useState(new Date());
    const [timeObj, setTimeObj] = React.useState(new Intl.DateTimeFormat([], longOptions).formatToParts(new Date()));
    const [useOtherTimeZone, setUseOtherTimeZone] = React.useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // setTime(new Date());
            setTimeObj(new Intl.DateTimeFormat([], longOptions).formatToParts(new Date()));
        }, 1000);

        return () => clearInterval(interval);
    }, [longOptions]);

    // const getTimestamp = () => {
    //     return time.toLocaleTimeString([], shrtOptions);
    // }

    const toggleTfHrFormat = () => {
        setLongOptions({
            ...longOptions,
            hour12: !longOptions.hour12
        });
    }

    const setTimeZoneSelect = (event) => {
        let value = event.target.value;
        if (value === "XXX") {
            setUseOtherTimeZone(true);
            value = Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        else
            setUseOtherTimeZone(false);

        setLongOptions({
            ...longOptions,
            timeZone: value
        });
    }

    const setTimeZoneOther = (event) => {
        setLongOptions({
            ...longOptions,
            timeZone: event.target.value
        });
    }

    return (
        <div className="page flex-row">
            <div id="left-sidebar" className="paper-back">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!longOptions.hour12}
                                onChange={toggleTfHrFormat}
                            />
                        }
                        label="24-hour Format"
                    />

                    <FormControl size="small">
                        <InputLabel id="time-zone-select-label">Time Zone</InputLabel>
                        <Select
                            id="time-zone-select-btn"
                            labelId="time-zone-select-label"
                            onChange={setTimeZoneSelect}
                            defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
                        >
                            <MenuItem value={"Pacific/Honolulu"}>Pacific/Honolulu</MenuItem>
                            <MenuItem value={"America/Los_Angeles"}>America/Los_Angeles</MenuItem>
                            <MenuItem value={"America/Phoenix"}>America/Phoenix</MenuItem>
                            <MenuItem value={"America/Denver"}>America/Denver</MenuItem>
                            <MenuItem value={"America/Chicago"}>America/Chicago</MenuItem>
                            <MenuItem value={"America/New_York"}>America/New_York</MenuItem>
                            <MenuItem value={"Europe/London"}>Europe/London</MenuItem>
                            <MenuItem value={"Europe/Paris"}>Europe/Paris</MenuItem>
                            <MenuItem value={"Asia/Dubai"}>Asia/Dubai</MenuItem>
                            <MenuItem value={"Asia/Bangkok"}>Asia/Bangkok</MenuItem>
                            <MenuItem value={"Asia/Manila"}>Asia/Manila</MenuItem>
                            <MenuItem value={"Asia/Tokyo"}>Asia/Tokyo</MenuItem>
                            <MenuItem value={"Australia/Sydney"}>Australia/Sydney</MenuItem>
                            <MenuItem value={"XXX"}>Other</MenuItem>
                        </Select>
                    </FormControl>
                    {useOtherTimeZone ?
                        <TextField
                            label="Other Time Zone"
                            margin="normal"
                            size="small"
                            variant="standard"
                            onChange={setTimeZoneOther}
                        />
                        :
                        null
                    }
                </FormGroup>

            </div>
            <div id="main-block" className="paper-back">
                <span id="date">
                    <span>
                        {timeObj.find(element => element.type === "weekday").value},
                    </span>
                    <span>

                        {timeObj.find(element => element.type === "month").value}
                    </span>
                    <span>

                        {timeObj.find(element => element.type === "day").value},
                    </span>
                    <span>
                        {timeObj.find(element => element.type === "year").value}
                    </span>
                </span>
                <span id="time">
                    <span>
                        {timeObj.find(element => element.type === "hour").value}:
                        {timeObj.find(element => element.type === "minute").value}:
                        {timeObj.find(element => element.type === "second").value}
                    </span>
                    <span>
                        {timeObj.find(element => element.type === "timeZoneName").value}
                    </span>

                </span>
            </div>
        </div >
    );
}

export default Clock;