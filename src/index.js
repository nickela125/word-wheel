import ReactDOM from 'react-dom';
import Game from './Components/Game';
import './index.css';
require('seedrandom')

/* TODO List
    - Fix rotate algorithm
    - Fix Layout of title and instructions
    - Mobile layout
    - Instructions
    - Winning message
    - Colours for dark and light mode
    - Timer with time on winning message
    - Save results with cookies
    - Share results
    - Fix bug if you press rotate with no letter
    - Check that random is working correctly
    - Come up with words
*/

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);