import React, { Component } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';

export default class Instructions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        }
    }

    render() {
        const handleClickOpen = () => {
            this.setState({ open: true });
        };
        const handleClose = () => {
            this.setState({ open: false });
        }
        return (
            <>
                <IconButton
                    size="large"
                    aria-label="help-button"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleClickOpen}
                    color="inherit"
                >
                    <HelpIcon />
                </IconButton>
                <Dialog open={this.state.open} onClose={handleClose}>
                    <DialogTitle>Instructions</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Add a single letter to complete an 8 letter word reading either clockwise or anti-clockwise.
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
};