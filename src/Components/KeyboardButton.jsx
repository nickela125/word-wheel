export default function KeyboardButton(props) {
    return (
        <button className={(props.isSelected ? 'selected' : '') + ' keyboard-button'} onClick={() => props.onClick()}>
            {props.label}
        </button>
    );
}
