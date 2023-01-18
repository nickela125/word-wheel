import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Instructions from './Instructions';

export default function Title() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar >
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, variant: 'h5' }} align='center'>
                        Word Wheel
                    </Typography>
                    <Instructions />
                </Toolbar>
            </AppBar>
        </Box>
    );
}