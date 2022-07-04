export default function Segment (props) {
    const divStyle = {
        transform: 'rotate(' + props.displayAngle + 'deg) translate(250%) rotate(-' + props.displayAngle + 'deg)'
        };
    return (
        <>
            <div className={'letter ' + (props.isAnswerLetter ? 'answer-letter' : '')} style={divStyle}>
                {props.letter}
            </div>
            <div className={'divider'} style={{transform: 'rotate('+ props.dividerAngle + 'deg)'}} />
        </>
    );
}