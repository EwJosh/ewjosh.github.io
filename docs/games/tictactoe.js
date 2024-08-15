import React from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const boardSize = 3;

function TicTacToe() {

    let board = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
        board.splice(0, 0, new Array(boardSize));
    }

    const showBoard = () => {
        for (let i = 0; i < boardSize; i++) {

        }
    }

    const getTileIcon = (tile) => {
        switch (tile) {
            case "X":
                return <CloseIcon />;
            case "O":
                return <CircleOutlinedIcon />;
            default:
                return <CheckBoxOutlineBlankIcon />;
        }
    }

    return (
        <div>
            <Grid2 container id="ttt-board">
                {
                    board.map((row, index) => {
                        row.map((item, index) => {
                            return getTileIcon(item);
                        })
                    })
                }
            </Grid2>
        </div>
    );
}

export default TicTacToe;