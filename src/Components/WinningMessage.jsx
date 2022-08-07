import React, { Component } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import fireworks from '../fireworks.gif'

export default class Instructions extends React.Component {
    render() {
        return (
            <Dialog open={this.props.open}>
                <DialogTitle>Winner!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Congratulations, you have won!
                    </DialogContentText>
                    <DialogContentText align='center'>
                        <img src={fireworks} style={{height: '100px'}} />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }
};