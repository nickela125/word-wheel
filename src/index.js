import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class KeyboardButton extends React.Component {
    render() {
        return (
            <button className={this.props.isSelected ? 'selected' : ''} onClick={() => this.props.onClick()}>
                {this.props.label}
            </button>
        );
    }
}

class RotateButton extends React.Component {
    render() {
        return (
            <button onClick={() => this.props.onClick()}>
                {this.props.label}
            </button>
        );
    }
}

class Keyboard extends React.Component {
    render () {
        const keyboardLabels = [
            ['Q','W','E','R','T','Y','U','I','O','P'],
            ['A','S','D','F','G','H','J','K','L'],
            ['Z','X','C','V','B','N','M']
        ];
        return (
            <div>
                {
                    keyboardLabels.map((row, index) => {
                        return <div key={'row-' + index}>
                            {
                                row.map((letter) => {
                                    return (
                                        <KeyboardButton 
                                            key={letter}
                                            label={letter} 
                                            isSelected={letter == this.props.answerLetter} 
                                            onClick={() => this.props.onLetterClick(letter)}
                                        />
                                    );
                                })
                            }
                        </div>
                    })
                }
                <div>
                    <button onClick={() => this.props.onRotateClicked(false)}>
                        {'↶'}
                    </button>
                    <button 
                        // onClick={() => this.props.onClick()}
                        >
                        {'SUBMIT'}
                    </button>
                    <button onClick={() => this.props.onRotateClicked(true)}>
                        {'↷'}
                    </button>
                </div>
            </div>        
        );
    }
}

class Segment extends React.Component {
    render () {
        return <div className={this.props.isAnswerLetter ? 'answer-letter' : ''}>{this.props.letter}</div>;
    }
}

class Wheel extends React.Component {
    render () {
        const lettersCopy = this.props.letters.slice();
        lettersCopy.splice(this.props.answerPosition, 0, this.props.answerLetter);

        return (
            <div>
                {
                    lettersCopy.map((letter, index) => {
                        return <Segment key={index} letter={letter ?? '*'} isAnswerLetter={index == this.props.answerPosition} />
                    })
                }
            </div>            
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            letters : ['T','C','O','M','P','L','E'],
            answerLetter : 'A',
            answerPosition : 0,
        };
    }

    handleLetterClick (letter) {
        this.setState({
            answerLetter: letter
        });
    }

    handleRotateLetter(rotateClockwise) {
        let newAnswerPosition = rotateClockwise ? this.state.answerPosition + 1 : this.state.answerPosition - 1;
        if (newAnswerPosition < 0) {
            newAnswerPosition = this.state.letters.length;
        } else {
            newAnswerPosition %= this.state.letters.length + 1;
        }
        
        this.setState({
            answerPosition: newAnswerPosition
        });
    }

    render () {
        return (
            <div>
                <Wheel 
                    letters={this.state.letters}
                    answerPosition={this.state.answerPosition}
                    answerLetter={this.state.answerLetter}
                />
                <Keyboard 
                    answerLetter={this.state.answerLetter} 
                    onLetterClick={(letter) => this.handleLetterClick(letter)} 
                    onRotateClicked={(rotateClockwise) => this.handleRotateLetter(rotateClockwise)}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);