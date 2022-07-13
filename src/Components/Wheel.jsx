import Segment from "./Segment";

export default function Wheel(props) {
    const numberOfSegments = props.letters.length;
    const degreeAngle = 360 / numberOfSegments;
    let currentAngle = 43; // random number so it looks randomly distributed throught the circle

    return (
        <div id={'wheel-container'} data-testid={'wheel'}>
            <div className={'wheel'}>
                <div id={'center-circle'} />
                <div className={'wheel-inner'} >
                    {
                        props.letters.map((letter, index) => {
                            const dividerAngle = 180 + currentAngle + (degreeAngle / 2);
                            const currentSegment = <Segment key={index}
                                letter={letter ?? '*'}
                                isAnswerLetter={index === props.answerPosition}
                                displayAngle={currentAngle}
                                dividerAngle={dividerAngle} />
                            currentAngle = currentAngle + degreeAngle;
                            return currentSegment;
                        })
                    }
                </div>
            </div>
        </div>
    );
}
