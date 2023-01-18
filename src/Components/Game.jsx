import React from 'react';
import Keyboard from './Keyboard';
import Wheel from './Wheel';
import Title from './Title';
import WinningMessage from './WinningMessage'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getRandomNumberGenerator from './GameRandom';
import { store } from './app/store'
import { Provider } from 'react-redux'

const theme = createTheme({
    palette: {
        primary: {
            main: '#18819D',
        },
        secondary: {
            main: '#1de9b6',
        },
    },
    typography: {
        fontFamily: [
            'monospace'
        ].join(','),
    }
});

export default class Game extends React.Component {
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
        const letterArray = answerWord.split('');
        const randomNumberGenerator = getRandomNumberGenerator();

        const indexOfLetterToRemove = Math.floor(randomNumberGenerator() * (numberOfLetters - 1));
        const answerLetter = letterArray[indexOfLetterToRemove];
        const arrayWithoutAnswerLetter = this.removeLetterAtIndex(letterArray, indexOfLetterToRemove);

        const indexOfStartOfWord = Math.floor(randomNumberGenerator() * (arrayWithoutAnswerLetter.length - 1));

        const rotatedArray = this.createRotatedArray(arrayWithoutAnswerLetter, indexOfStartOfWord);

        return {
            letters: rotatedArray,
            answerLetter: answerLetter,
            answerOffset: indexOfLetterToRemove,
            startingIndex: indexOfStartOfWord
        };
    }

    removeLetterAtIndex(array, index) {
        let arrayWithoutLetter = array.slice(0, index);
        if (index !== array.length - 1) {
            const secondHalfOfArray = array.slice(index + 1, array.length);
            arrayWithoutLetter = arrayWithoutLetter.concat(secondHalfOfArray);
        }
        return arrayWithoutLetter;
    }

    createRotatedLetterArray(word, indexToRotateFrom) {
        const rotatedLetters = [];

        for (let i = 0; i < word.length; i++) {
            const currentLetter = (i + indexToRotateFrom) % word.length;
            rotatedLetters.push(word.charAt(currentLetter));
        }

        return rotatedLetters;
    }

    // Example:
    // originalArray: ['C','O','M','P','L','E','E']
    // indexToMoveStartTo: 2
    // result: ['E','E','C','O','M','P','L']
    createRotatedArray(originalArray, indexToMoveStartTo) {
        const rotatedLetters = [];

        const indexOfOriginalToStartWith = originalArray.length - indexToMoveStartTo;
        for (let i = 0; i < originalArray.length; i++) {
            const currentLetter = (i + indexOfOriginalToStartWith) % originalArray.length;
            rotatedLetters.push(originalArray[currentLetter]);
        }

        return rotatedLetters;
    }

    handleLetterClick(letter) {
        const lettersCopy = this.state.letters.slice();
        let newStartingIndex = this.state.startingIndex;
        let newAnswerGuessPosition = this.state.answerGuessPosition;

        if (this.state.answerGuess !== null) {
            lettersCopy[newAnswerGuessPosition] = letter;
        } else {
            lettersCopy.unshift(letter);
            newAnswerGuessPosition = 0;

            if (this.state.startingIndex > 0) {
                newStartingIndex++;
            }
        }

        this.setState({
            answerGuess: letter,
            answerGuessPosition: newAnswerGuessPosition,
            startingIndex: newStartingIndex,
            letters: lettersCopy,
        });
    }

    handleRotateLetter(rotateClockwise) {
        if (this.state.answerGuessPosition === null) {
            return;
        }

        let newGuessPosition;
        let newStartingIndex = this.state.startingIndex;
        const lettersCopy = this.state.letters.slice();
        lettersCopy.splice(this.state.answerGuessPosition, 1);

        if (rotateClockwise) {
            newGuessPosition = this.state.answerGuessPosition + 1;

            if (newGuessPosition === this.state.letters.length) {
                newGuessPosition = 0;
                // Move first letter to the end to make the rotate smooth
                const firstLetter = lettersCopy.shift();
                lettersCopy.push(firstLetter);
            }
            if (this.state.startingIndex > 0 && newGuessPosition === this.state.startingIndex) {
                newStartingIndex--;
            }
        }
        else {
            newGuessPosition = this.state.answerGuessPosition - 1;

            if (newGuessPosition < 0) {
                newGuessPosition = this.state.letters.length - 1;

                // Move last letter to the start to make the rotate smooth 
                const lastLetter = lettersCopy.pop();
                lettersCopy.unshift(lastLetter);
            }
            if (this.state.startingIndex > 0 && newGuessPosition === this.state.startingIndex) {
                newStartingIndex++;
            }
        }

        lettersCopy.splice(newGuessPosition, 0, this.state.answerGuess);

        this.setState({
            answerGuessPosition: newGuessPosition,
            letters: lettersCopy,
            startingIndex: newStartingIndex,
        });
    }

    checkAnswer() {
        const correctAnswer = ((this.state.answerOffset + this.state.startingIndex) % this.state.letters.length) === this.state.answerGuessPosition &&
            this.state.answerGuess === this.state.answerLetter;
        this.setState({
            hasWon: correctAnswer,
        });
    }

    render() {
        return (
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <div className='parent-container'>
                        <Title />
                        <Wheel
                            letters={this.state.letters}
                            answerGuessPosition={this.state.answerGuessPosition}
                        />
                        <Keyboard
                            answerLetter={this.state.answerGuess}
                            onLetterClick={(letter) => this.handleLetterClick(letter)}
                            onRotateClicked={(rotateClockwise) => this.handleRotateLetter(rotateClockwise)}
                            onSubmitClicked={() => this.checkAnswer()}
                        />
                        <WinningMessage open={this.state.hasWon} />
                    </div>
                </ThemeProvider>
            </Provider>
        );
    }
}