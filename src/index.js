import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class KeyboardButton extends React.Component {
    render() {
        return <button>{this.props.label}</button>
    }
}

class Keyboard extends React.Component {
    render () {
        const keyboardLabels = [
            ['Q','W','E','R','T','Y','U','I','O','P'],
            ['A','S','D','F','G','H','J','K','L'],
            ['↶','Z','X','C','V','B','N','M','↷'],
            ['SUBMIT']
        ];
        return (
            <div>
                {
                    keyboardLabels.map((row, index) => {
                        return <div key={'row-' + index}>
                            {
                                row.map((letter) => {
                                    return <KeyboardButton key={letter} label={letter} />
                                })
                            }
                        </div>
                    })
                }
                
            </div>        
        );
    }
}

class Segment extends React.Component {
    render () {
        return <div>{this.props.letter}</div>;
    }
}

class Wheel extends React.Component {
    render () {
        return (
            <div>
                <Segment letter={'T'} />
                <Segment letter={'C'} />
                <Segment letter={'O'} />
                <Segment letter={'M'} />
                <Segment letter={'P'} />
                <Segment letter={'L'} />
                <Segment letter={'E'} />
            </div>            
        );
    }
}

class Game extends React.Component {
    render () {
        return (
            <div>
                <Wheel />
                <Keyboard />
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);