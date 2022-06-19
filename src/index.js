import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 
require('seedrandom')

class KeyboardButton extends React.Component {
    render() {
        return (
            <button className={(this.props.isSelected ? 'selected' : '') + ' keyboard-button'} onClick={() => this.props.onClick()}>
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
            <div id='keyboard-container'>
                <div className={'keyboard'}>
                    {
                        keyboardLabels.map((row, index) => {
                            return <div key={'row-' + index} className='keyboard-row'>
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
                    <div className='keyboard-row'>
                        <button className='keyboard-button' onClick={() => this.props.onRotateClicked(false)}>
                            {'↶'}
                        </button>
                        <button className='keyboard-button' onClick={() => this.props.onSubmitClicked()}>
                            {'SUBMIT'}
                        </button>
                        <button className='keyboard-button' onClick={() => this.props.onRotateClicked(true)}>
                            {'↷'}
                        </button>
                    </div>
                </div>    
            </div>    
        );
    }
}

class Segment extends React.Component {

    render () {
        const divStyle = {
            transform: 'rotate(' + this.props.displayAngle + 'deg) translate(250%) rotate(-' + this.props.displayAngle + 'deg)'
          };
        return (
            <div className={'letter ' + (this.props.isAnswerLetter ? 'answer-letter' : '')} style={divStyle}>
                {this.props.letter}
            </div>
        );;
    }
}

class Wheel extends React.Component {

    render () {
        const numberOfSegments = this.props.letters.length;
        const degreeAngle = 360 / numberOfSegments;
        let currentAngle = 43;

        return (
            <div id='wheel-container'>
                <div className={'wheel'}>
                    <div className={'wheel-inner'} />
                    {
                        this.props.letters.map((letter, index) => {
                            const currentSegment = <Segment key={index} letter={letter ?? '*'} isAnswerLetter={index == this.props.answerPosition} displayAngle={currentAngle} />
                            currentAngle = currentAngle + degreeAngle;
                            return currentSegment;
                        })
                    }
                </div>    
            </div>        
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        const answerWord = this.getAnswerWord();
        
        this.state = this.generateGame(answerWord);
        this.state.answerGuess = null;
        this.state.answerGuessPosition = null;
    }

    getAnswerWord() {
        return 'COMPLETE';
    }

    generateGame(answerWord) {
        const numberOfLetters = answerWord.length;
        const randomNumberGenerator = this.getRandomNumberGenerator();
        const indexOfLetterToStartWith = Math.floor(randomNumberGenerator() * (numberOfLetters));
        let indexOfLetterToRemove = Math.floor(randomNumberGenerator() * (numberOfLetters));

        const rotatedArray = this.createRotatedLetterArray(answerWord, indexOfLetterToStartWith);

        const answerLetter = rotatedArray[indexOfLetterToRemove];

        const arrayWithoutAnswerLetter = this.removeLetterAtIndex(rotatedArray, indexOfLetterToRemove);       

        return {
            letters : arrayWithoutAnswerLetter,
            answerLetter : answerLetter,
            answerPosition : indexOfLetterToRemove,
        };
    }

    removeLetterAtIndex(array, index) {
        let arrayWithoutLetter = array.slice(0, index);
        if (index != array.length - 1) {
            const secondHalfOfArray = array.slice(index + 1, array.length);
            arrayWithoutLetter = arrayWithoutLetter.concat(secondHalfOfArray);
        }
        return arrayWithoutLetter;
    }

    createRotatedLetterArray(word, indexToRotateFrom)
    {
        const rotatedLetters = [];

        for (let i = 0; i < word.length; i++){
            const currentLetter = (i + indexToRotateFrom) % word.length;
            rotatedLetters.push(word.charAt(currentLetter));
        }

        return rotatedLetters;
    }

    getRandomNumberGenerator() {
        // Make sure everyone gets the same randoms value every day
        const seedrandom = require('seedrandom');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return seedrandom(today.getTime());
    }

    handleLetterClick (letter) {
        this.setState({
            answerGuess: letter,
            answerGuessPosition: 0,
        });
    }

    handleRotateLetter(rotateClockwise) {
        let newAnswerPosition = rotateClockwise ? this.state.answerGuessPosition + 1 : this.state.answerGuessPosition - 1;
        if (newAnswerPosition < 0) {
            newAnswerPosition = this.state.letters.length;
        } else {
            newAnswerPosition %= this.state.letters.length + 1;
        }
        
        this.setState({
            answerGuessPosition: newAnswerPosition
        });
    }

    checkAnswer() {
        const correctAnswer = this.state.answerGuessPosition == this.state.answerPosition &&
            this.state.answerGuess == this.state.answerLetter;
        this.setState({
            hasWon: correctAnswer,
        });
    }

    render () {
        const lettersCopy = this.state.letters.slice();
        if (this.state.answerGuess != null && this.state.answerGuessPosition != null) {
            lettersCopy.splice(this.state.answerGuessPosition, 0, this.state.answerGuess);
        }        

        return (
            <div className='parent-container'>
                <Wheel 
                    letters={lettersCopy}
                    answerPosition={this.state.answerGuessPosition}
                />
                <Keyboard 
                    answerLetter={this.state.answerGuess} 
                    onLetterClick={(letter) => this.handleLetterClick(letter)} 
                    onRotateClicked={(rotateClockwise) => this.handleRotateLetter(rotateClockwise)}
                    onSubmitClicked={() => this.checkAnswer()}
                />
                <div>
                    {this.state.hasWon ? 'You are a winner!' : ''}
                </div>
            </div>
        );
    }
}

class LayoutTest extends React.Component {
    render () {
        return (
            <div id="container">
                <div id="wheel-box">WHEEL</div>
                <div id="keyboard-box">KEYBOARD</div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    //<LayoutTest/>,
    document.getElementById('root')
);