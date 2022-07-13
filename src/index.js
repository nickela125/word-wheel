import { createRoot } from 'react-dom/client';
import Game from './Components/Game';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);

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