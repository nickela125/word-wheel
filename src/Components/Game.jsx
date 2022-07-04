import React from 'react';
import Keyboard from './Keyboard';
import Wheel from './Wheel';

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
        const randomNumberGenerator = this.getRandomNumberGenerator();
        const indexOfLetterToStartWith = Math.floor(randomNumberGenerator() * (numberOfLetters));
        const indexOfLetterToRemove = Math.floor(randomNumberGenerator() * (numberOfLetters));

        //const rotatedArray = this.createRotatedLetterArray(answerWord, 0);
        const letterArray = answerWord.split('');

        const answerLetter = letterArray[indexOfLetterToRemove];

        const arrayWithoutAnswerLetter = this.removeLetterAtIndex(letterArray, indexOfLetterToRemove);

        return {
            letters: arrayWithoutAnswerLetter,
            answerLetter: answerLetter,
            answerPosition: indexOfLetterToRemove,
            startingIndex: indexOfLetterToStartWith
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

    createRotatedArray(originalArray, indexToRotateFrom) {
        const rotatedLetters = [];

        for (let i = 0; i < originalArray.length; i++) {
            const currentLetter = (i + indexToRotateFrom) % originalArray.length;
            rotatedLetters.push(originalArray[currentLetter]);
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

    handleLetterClick(letter) {
        this.setState({
            answerGuess: letter,
            answerGuessPosition: 0,
        });
    }

    handleRotateLetter(rotateClockwise) {
        let newGuessPosition = rotateClockwise ? this.state.answerGuessPosition + 1 : this.state.answerGuessPosition - 1;
        const newLetterArray = this.state.letters.slice();
        let newAnswerPosition = this.state.newGuessPosition;

        if (newGuessPosition < 0) {
            newGuessPosition = this.state.letters.length;

            // Move last letter to the start to make the rotate smooth 
            const lastLetter = newLetterArray.pop();
            newLetterArray.unshift(lastLetter);
            newAnswerPosition--;

        } else if (newGuessPosition === this.state.letters.length + 1) {
            newGuessPosition = 0;

            // Move first letter to the end to make the rotate smooth
            const firstLetter = newLetterArray.shift();
            newLetterArray.push(firstLetter);
            newAnswerPosition++;
            //newAnswerPosition %= 
        }

        this.setState({
            answerGuessPosition: newGuessPosition,
            letters: newLetterArray,
        });
    }

    checkAnswer() {
        const correctAnswer = this.state.answerGuessPosition === this.state.answerPosition &&
            this.state.answerGuess === this.state.answerLetter;
        this.setState({
            hasWon: correctAnswer,
        });
    }

    render() {
        const lettersCopy = this.createRotatedArray(this.state.letters.slice(), this.state.startingIndex);
        if (this.state.answerGuess !== null && this.state.answerGuessPosition !== null) {
            lettersCopy.splice(this.state.answerGuessPosition, 0, this.state.answerGuess);
        }

        return (
            <div className='parent-container'>
                <h1>Word Wheeldle</h1>
                <button className={'help-button'}>?</button>
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