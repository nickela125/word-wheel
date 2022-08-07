import { createRoot } from 'react-dom/client';
import Game from './Components/Game';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);

/* TODO List
    - Timer with time on winning message
    - Save results with cookies
    - Share results
    - Check that random is working correctly
    - Come up with words
    - Colours for dark and light mode
    - Enable keyboard shortcuts
    - typescript
    - redux
*/