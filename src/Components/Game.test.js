import '@testing-library/jest-dom'

import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'

import Game from './Game';
import { getRandomNumberGenerator } from './GameRandom';

// jest.mock('./GameRandom.js', () => {
//   // __esModule: true,
//   // default: jest.fn().mockImplementation(() => "Craig")
 
//     return jest.fn().mockImplementation(() => {
//       return 1;
//     });
  
// });

// jest.mock('./GameRandom');


beforeAll(() => {
  // NOT GOING IN HERE?
  //jest.useFakeTimers('modern');
  //jest.setSystemTime(new Date(2022, 7, 12, 0, 0, 0));
  // random date gives us
  // - indexOfLetterToStartWith: 2 
  // - indexOfLetterToRemove: 6
  // jest.mock('./GameRandom.js', () => ({
  //   __esModule: true,
  //   getRandomNumberGenerator: jest.fn(),
  // }));
});

afterAll(() => {
  //jest.useRealTimers();
});

test('shows the title, wheel and keyboard', () => {
  render(<Game />)
  expect(screen.getByText('Word Wheeldle')).toBeInTheDocument();
  expect(screen.getByTestId('wheel')).toBeInTheDocument();
  expect(screen.getByTestId('keyboard')).toBeInTheDocument();
});

//TODO all the following needs changing when I sort out the different words
test('initial word shows in wheel minus a letter', () => {
  render(<Game />)
  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements.length).toBe(7);
  const letters = letterElements.map(letter => letter.innerHTML);
  expect(letters).toEqual(['E', 'E', 'C', 'O', 'M', 'P', 'L']);
});

test('clicking a keyboard letter adds letter to start of wheel letters', () => {
  render(<Game />);
  fireEvent.click(screen.getByText('X'));
  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements.length).toBe(8);
  expect(letterElements[0].innerHTML).toBe('X');
});

test('rotate clockwise button moves selected letter forwards one space', () => {
  render(<Game />);
  fireEvent.click(screen.getByText('X'))
  const letterElements = screen.getAllByTestId('letter');
  for (let click = 1; click < 8; click++) {
    fireEvent.click(screen.getByText('↷'));
    expect(letterElements[click].innerHTML).toBe('X');
  }
});

test('rotate clockwise a full rotation puts the selected letter at the start and start letter at end', () => {
  render(<Game />);
  const firstLetter = screen.getAllByTestId('letter')[0].innerHTML;

  fireEvent.click(screen.getByText('X'));

  for (let click = 0; click < 8; click++) {
    fireEvent.click(screen.getByText('↷'));
  }

  const letterElements = screen.getAllByTestId('letter');

  expect(letterElements[0].innerHTML).toBe('X');
  // We move the original first letter to the end to make the roation look smooth
  expect(letterElements[7].innerHTML).toBe(firstLetter);
});

test('rotate anticlockwise button moves selected letter to end', () => {
  render(<Game />);
  const lastLetter = screen.getAllByTestId('letter')[6].innerHTML;

  fireEvent.click(screen.getByText('X'));
  fireEvent.click(screen.getByText('↶'));

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements[7].innerHTML).toBe('X');
  // We move the original last letter to the start to make the roation look smooth
  expect(letterElements[0].innerHTML).toBe(lastLetter);
});

test('rotate anticlockwise a full rotation puts the selected letter at the start', () => {
  render(<Game />);

  fireEvent.click(screen.getByText('X'));
  for (let click = 0; click < 8; click++) {
    fireEvent.click(screen.getByText('↶'));
  }

  const letterElements = screen.getAllByTestId('letter');
  expect(letterElements[0].innerHTML).toBe('X');
});

test('answer letter in correct place shows winning message', () => {
  render(<Game />);

  expect(screen.getByText('You are a winner!')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('O'));
  fireEvent.click(screen.getByText('SUBMIT'));

  expect(screen.getByText('You are a winner!')).toBeInTheDocument();
});

test('answer letter in wrong place does not show winning message', () => {
  render(<Game />);

  fireEvent.click(screen.getByText('O'));
  fireEvent.click(screen.getByText('SUBMIT'));
  fireEvent.click(screen.getByText('↶'));

  expect(screen.getByText('You are a winner!')).not.toBeInTheDocument();
});

test('answer letter in correct place after full rotation shows winning message', () => {
  render(<Game />);

  fireEvent.click(screen.getByText('O'));
  for (let click = 0; click < 8; click++) {
    fireEvent.click(screen.getByText('↶'));
  }
  fireEvent.click(screen.getByText('SUBMIT'));

  expect(screen.getByText('You are a winner!')).toBeInTheDocument();
});

// remove answer lette4r
// ['E','E','C','O','M','P','L'] 
// 	+ 'X' (startingIndex + 1)

// ['X','E','E','C','O','M','P','L'] 
// 	+ '↷' * 7(if guessIndex > startingIndex (first time), startingIndex - 1)
// ['E','X','E','C','O','M','P','L'] 
// ['E','E','C','O','M','P','L','X'] 
// 	+ '↷' (if starting index was 0, now length - 1)
// ['X','E','C','O','M','P','L','E']

// 	+ '↶' (if starting index was length - 1, now 0)
// ['E','E','C','O','M','P','L','X']
// 	+ '↶' * 7 (if guessIndex < startingIndex (first time), startingIndex + 1)
// ['E','E','C','O','M','P','X','L']
// ['X','E','E','C','O','M','P','L']
