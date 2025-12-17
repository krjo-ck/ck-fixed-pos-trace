import { CanKingDataProvider } from '@kvaser/canking-api/controls';
import WorkspaceView from './WorkspaceView';

function App() {
  return (
    <CanKingDataProvider>
      <WorkspaceView />
    </CanKingDataProvider>
  );
}

export default App;
