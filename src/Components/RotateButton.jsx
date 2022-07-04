export default function RotateButton(props) {
    return (
        <button className='keyboard-button' onClick={props.onClick}>
            {props.label}
        </button>
    );
}