/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Krister Johansson. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
