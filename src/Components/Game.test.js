import React from 'react'
import Game from './Game';
import { render, within, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom';

jest.mock('./GameRandom');
const gameRandom = require('./GameRandom.js');
let renderedElement;

beforeEach(() => {
  // ['E','E','C','O','M','P','L']
  gameRandom.default.mockImplementation(() => jest
    .fn()
    .mockImplementationOnce(() => 6 / 7) // gives indexOfLetterToRemove: 6
    .mockImplementationOnce(() => 2 / 6)// gives indexOfStartOfWord: 2
  );

  renderedElement = render(<Game />)
});

test('shows the title, wheel and keyboard', () => {
  const header = screen.getByText('Word Wheeldle');
  const wheelComponent = screen.getByTestId('wheel')
  const keyboardComponent = screen.getByTestId('keyboard');

  expect(header).toBeInTheDocument();
  expect(wheelComponent).toBeInTheDocument();
  expect(keyboardComponent).toBeInTheDocument();
});

//TODO all the following needs changing when I sort out the different words
test('initial rotated word shows in wheel minus a letter', () => {
  const letterElements = screen.getAllByTestId('letter');
  const letters = letterElements.map(letter => letter.innerHTML);
  expect(letterElements.length).toBe(7);
  expect(letters).toEqual(['E','E','C','O','M','P','L']);
});

test('clicking a keyboard letter adds letter to start of wheel letters', () => {
  clickKeyboardButton('X');

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements.length).toBe(8);
  expect(letterElements[0].innerHTML).toBe('X');
});

test('clicking a subsequent letter replaces the first', () => {
  clickKeyboardButton('X');
  clickKeyboardButton('R');

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements.length).toBe(8);
  expect(letterElements[0].innerHTML).toBe('R');
});

test('clicking a subsequent letter after rotating replaces the first', () => {
  clickKeyboardButton('X');
  clickKeyboardButton('↷');
  clickKeyboardButton('R');

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements.length).toBe(8);
  expect(letterElements[1].innerHTML).toBe('R');
});

test('clicking the same letter multiple times does nothing', () => {
  clickKeyboardButton('X');
  clickKeyboardButton('X');

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements.length).toBe(8);
  expect(letterElements[0].innerHTML).toBe('X');
});

test('rotate clockwise button moves selected letter forwards one space', () => {
  clickKeyboardButton('X');

  const letterElements = screen.getAllByTestId('letter');
  for (let click = 0; click < 7; click++) {
    clickKeyboardButton('↷');

    expect(letterElements[click + 1].innerHTML).toBe('X');
  }
});

test('rotate anticlockwise button moves selected letter to end and end letter to the start', () => {
  const lastLetter = screen.getAllByTestId('letter')[6].innerHTML;

  clickKeyboardButton('X');
  clickKeyboardButton('↶');

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements[7].innerHTML).toBe('X');
  // We move the original last letter to the start to make the roation look smooth
  expect(letterElements[0].innerHTML).toBe(lastLetter);
});

test('rotate clockwise a full rotation puts the selected letter at the start and start letter at end', () => {
  const firstLetter = screen.getAllByTestId('letter')[0].innerHTML;

  clickKeyboardButton('X');

  for (let click = 0; click < 8; click++) {
    clickKeyboardButton('↷');
  }

  const letterElements = screen.getAllByTestId('letter');

  expect(letterElements[0].innerHTML).toBe('X');
  // We move the original first letter to the end to make the roation look smooth
  expect(letterElements[7].innerHTML).toBe(firstLetter);
});

test('rotate anticlockwise a full rotation puts the selected letter at the start', () => {
  clickKeyboardButton('X');
  for (let click = 0; click < 8; click++) {
    clickKeyboardButton('↶');
  }

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements[0].innerHTML).toBe('X');
});

test('answer position does not require rotation, winning message shows with just letter and submit', () => {
  // ['O','M','P','L','E','T','E']
  resetRandomNumbers(0, 0);

  expect(screen.queryByText('You are a winner!')).not.toBeInTheDocument();

  clickKeyboardButton('C');
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer letter in wrong place does not show winning message', () => {
  // ['E','E','C','O','M','P','L']
  clickKeyboardButton('C');
  clickKeyboardButton('SUBMIT');

  winningMessageDoesNotShow();
});

test('wrong answer letter in correct place does not show winning message', () => {
  // ['O','M','P','L','E','T','E']
  resetRandomNumbers(0, 0);

  clickKeyboardButton('X');
  clickKeyboardButton('SUBMIT');

  winningMessageDoesNotShow();
});

test('answer letter in correct place after full clockwise rotation shows winning message', () => {
  // ['O','M','P','L','E','T','E']
  resetRandomNumbers(0, 0);

  clickKeyboardButton('C');
  for (let click = 0; click < 8; click++) {
    clickKeyboardButton('↷');
  }
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer letter in correct place after full anticlockwise rotation shows winning message', () => {
  // ['O','M','P','L','E','T','E']
  resetRandomNumbers(0, 0);

  clickKeyboardButton('C');
  for (let click = 0; click < 8; click++) {
    clickKeyboardButton('↶');
  }
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer letter in correct place after 7 full clockwise rotations, winning message shows when in correct position', () => {
  // ['O','M','P','L','E','T','E']
  resetRandomNumbers(0, 0);

  clickKeyboardButton('C');
  for (let click = 0; click < 56; click++) {
    clickKeyboardButton('↷');
  }

  clickKeyboardButton('SUBMIT');
});

test('answer letter in correct place after 7 full anticlockwise rotations, winning message shows when in correct position', () => {
  // ['O','M','P','L','E','T','E']
  resetRandomNumbers(0, 0);

  clickKeyboardButton('C');
  for (let click = 0; click < 56; click++) {
    clickKeyboardButton('↶');
  }

  clickKeyboardButton('SUBMIT');
});



test('asnity check answer letter in correct place after 7 full anticlockwise rotations, winning message shows when in correct position', () => {
  // ['E','E','C','O','M','P','L']
  clickKeyboardButton('T');
  for (let click = 0; click < 57; click++) {
    clickKeyboardButton('↷');
  }

  clickKeyboardButton('SUBMIT');
});

test('answer position requires rotation clockwise, winning message shows when in correct position', () => {
  // ['E','E','C','O','M','P','L']
  clickKeyboardButton('T');
  clickKeyboardButton('↷');
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer position requires rotation anticlockwise, winning message shows when in correct position', () => {
  // ['C','O','M','P','L','E','T']
  resetRandomNumbers(7, 0);

  clickKeyboardButton('E');
  clickKeyboardButton('↶');
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer position requires clockwise rotation past start of word, winning message shows when in correct position', () => {
  // ['T','E','C','O','M','P','E']
  resetRandomNumbers(4, 2);

  clickKeyboardButton('L');
  for (let click = 0; click < 6; click++) {
    clickKeyboardButton('↷');
  }
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer position reached by anticlockwise rotation past start of word, winning message shows when in correct position', () => {
  // ['E','E','C','O','M','P','L']
  clickKeyboardButton('T');
  for (let click = 0; click < 6; click++) {
    clickKeyboardButton('↶');
  }
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('answer position is last letter in word, winning message shows when in correct position', () => {
  // ['C','O','M','P','L','E','T']
  resetRandomNumbers(7, 0);

  clickKeyboardButton('E');
  for (let click = 0; click < 7; click++) {
    clickKeyboardButton('↷');
  }
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('start is last letter in word, winning message shows when in correct position', () => {
  // ['M','P','L','E','T','E','C']
  resetRandomNumbers(1, 6);

  clickKeyboardButton('O');
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

test('start is last letter in word, winning message shows when in correct position after complete clockwise rotation', () => {
  // ['M','P','L','E','T','E','C']
  resetRandomNumbers(1, 6);

  clickKeyboardButton('O');
  for (let click = 0; click < 7; click++) {
    clickKeyboardButton('↷');
  }
  clickKeyboardButton('SUBMIT');

  winningMessageShows();
});

// above but past start of word
// answer position is last position in word - what if you put it at the front
// answer is start of word
// one where starting position flips at end of word or answer does - starting letter is at end and flips to start on rotate



// answer letter moved to wrong place - should disable buttons

function clickKeyboardButton(buttonText) {
  const keyboardComponent = screen.getByTestId('keyboard');
  const keyboardButton = within(keyboardComponent).getByText(buttonText);
  fireEvent.click(keyboardButton);
}

function resetRandomNumbers(firstRandomNumber, secondRandomNumber) {
  jest.clearAllMocks();
  gameRandom.default.mockImplementation(() => jest
    .fn()
    .mockImplementationOnce(() => firstRandomNumber / 7) // gives indexOfLetterToRemove
    .mockImplementationOnce(() => secondRandomNumber / 6) // gives indexOfStartOfWord
  );

  renderedElement.unmount();
  render(<Game />);
}

function winningMessageShows() {
  const winningMessage = screen.queryByText('You are a winner!');
  expect(winningMessage).toBeInTheDocument();
}

function winningMessageDoesNotShow() {
  const winningMessage = screen.queryByText('You are a winner!');
  expect(winningMessage).not.toBeInTheDocument();
}