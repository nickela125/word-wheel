import KeyboardButton from './KeyboardButton';
import RotateButton from './RotateButton';

export default function Keyboard(props) {
    const keyboardLabels = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    return (
        <div id='keyboard-container' data-testid={'keyboard'}>
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
                                            isSelected={letter === props.answerLetter}
                                            onClick={() => props.onLetterClick(letter)}
                                        />
                                    );
                                })
                            }
                        </div>
                    })
                }
                <div className='keyboard-row'>
                    <RotateButton
                        label={'↶'}
                        onClick={() => props.onRotateClicked(false)}
                    />
                    <button className='keyboard-button' onClick={() => props.onSubmitClicked()}>
                        {'SUBMIT'}
                    </button>
                    <RotateButton
                        label={'↷'}
                        onClick={() => props.onRotateClicked(true)}
                    />
                </div>
            </div>
        </div>
    );
}