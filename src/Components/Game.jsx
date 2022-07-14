import React from 'react';
import Keyboard from './Keyboard';
import Wheel from './Wheel';
import getRandomNumberGenerator from './GameRandom';

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
            answerPosition: indexOfLetterToRemove,
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

    createRotatedArray(originalArray, indexToMoveStartTo) {
        const rotatedLetters = [];

        // originalArray: ['C','O','M','P','L','E','E']
        // indexToMoveStartTo: 2
        // result: ['E','E','C','O','M','P','L']

        const indexOfOriginalToStartWith = originalArray.length - indexToMoveStartTo;
        for (let i = 0; i < originalArray.length; i++) {
            const currentLetter = (i + indexOfOriginalToStartWith) % originalArray.length;
            rotatedLetters.push(originalArray[currentLetter]);
        }

        return rotatedLetters;
    }

    handleLetterClick(letter) {
        // handle removing?
        const lettersCopy = this.state.letters.slice();
        if (this.state.answerGuess !== null){
            lettersCopy[0] = letter;
        } else {
            lettersCopy.unshift(letter);
        }
        
        this.setState({
            answerGuess: letter,
            answerGuessPosition: 0,
            letters: lettersCopy,
        });
    }

    handleRotateLetter(rotateClockwise) {
        if (this.state.answerGuessPosition === null) {
            return;
        }

        let newGuessPosition;
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
        }
        else {
            newGuessPosition = this.state.answerGuessPosition - 1;

            if (newGuessPosition < 0) {
                newGuessPosition = this.state.letters.length - 1;
    
                // Move last letter to the start to make the rotate smooth 
                const lastLetter = lettersCopy.pop();
                lettersCopy.unshift(lastLetter);
    
            } 
        }

        lettersCopy.splice(newGuessPosition, 0, this.state.answerGuess);

        this.setState({
            answerGuessPosition: newGuessPosition,
            letters: lettersCopy,
        });
    }

    checkAnswer() {
        const correctAnswer = ((this.state.answerGuessPosition % 7) + this.state.startingIndex) === this.state.answerPosition &&
            this.state.answerGuess === this.state.answerLetter;
        this.setState({
            hasWon: correctAnswer,
        });
    }

    render() {
        return (
            <div className='parent-container'>
                <h1>Word Wheeldle</h1>
                <button className={'help-button'}>?</button>
                <Wheel
                    letters={this.state.letters}
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