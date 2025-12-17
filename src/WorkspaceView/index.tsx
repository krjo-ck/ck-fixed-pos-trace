import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNumericRadix, useProjectData, useSessionData } from '@kvaser/canking-api/hooks';
import { CanChannelSelectControl, CanIdentifierControl, canIdentifierType } from '@kvaser/canking-api/controls';
import { sendCanMessage } from '@kvaser/canking-api/ipc';
import { CanFrameFlag } from '@kvaser/canking-api/models';
import { Box, Button } from '@mui/material';
import icon from '../assets/icon.png';

// If any data should be stored in the project file then add it to this interface
interface IProjectData {
  // This is an example showing how to store the selected channel id to the project file
  channelId: string;
}

// Define any default values for the project data that will be used when the component is created
const defaultProjectData: IProjectData = {
  channelId: '',
};

// If any data should be stored in the session data then add it to this interface
// Session data will be persistent when the view is hidden, but it will not be saved to the project file
interface ISessionData {
  // This is an example showing how to store the selected CAN id to the session data
  canId: number;
  canIdType: canIdentifierType;
}

// Define any default values for the project data that will be used when the component is created
const defaultSessionData: ISessionData = {
  canId: 0,
  canIdType: 'standard',
};

// This component is the component that will be loaded into the Workspace view
function WorkspaceView() {
  // Get this view's unique id from search params
  const [searchParams] = useSearchParams();
  const idString = searchParams.get('id');
  const id = idString !== null ? Number.parseInt(idString, 10) : -1;

  // Use the useNumericRadix hook to convert the CAN id correctly according to the user settings
  const numericRadix = useNumericRadix();

  // Use the useProjectData hook to serialize/deserialize your view data to the project
  const { projectData, setProjectData } = useProjectData<IProjectData>(id, defaultProjectData);

  // Use the useSessionData hook to serialize/deserialize your view data to the session data
  const { sessionData, setSessionData } = useSessionData<ISessionData>(id, defaultSessionData);

  // A callback that will get the new selected channel id and save it to the project data
  const onChannelIdentifierChange = useCallback((channelId: string) => {
    const data = { ...projectData };
    data.channelId = channelId;
    setProjectData(data);
  }, [projectData, setProjectData]);

  // A callback that will get the new selected CAN id and save it to the session data
  const onCanIdentifierChange = useCallback((canId: string, canIdType: canIdentifierType) => {
    const data = { ...sessionData };
    data.canId = Number.parseInt(canId, numericRadix);
    data.canIdType = canIdType;
    setSessionData(data);
  }, [numericRadix, sessionData, setSessionData]);

  // A callback that will send out a CAN message on the selected channel with the specified CAN id
  const onSendCanMessage = useCallback(() => {
    if (projectData.channelId !== '') {
      const flags = sessionData.canIdType === 'extended' ? CanFrameFlag.CAN_FRAME_FLAG_EXT : CanFrameFlag.CAN_FRAME_FLAG_STD;
      sendCanMessage(projectData.channelId, sessionData.canId, [], flags)
    }
  }, [projectData.channelId, sessionData.canId, sessionData.canIdType]);

  return (
    <Box aria-label="canking-extension-view" height={'100%'} width={'100%'}>
      <h3>Add your elements here!</h3>
      <div>This is an example how to embed an image:</div>
      <img src={icon} height={50}/>
      <div style={{marginTop: 20}}>This is an example how to use the CanChannelSelectControl:</div>
      <CanChannelSelectControl
        channelIdentifier={projectData.channelId}
        onChannelIdentifierChange={onChannelIdentifierChange}
        hideSectionControl
      />
      <div style={{marginTop: 20}}>This is an example how to use the CanIdentifierControl:</div>
      <CanIdentifierControl
        canIdentifier={sessionData.canId.toString(numericRadix).toUpperCase()}
        canIdentifierType={sessionData.canIdType}
        onCanIdentifierChange={onCanIdentifierChange}
        hideSection
      />
      <div style={{marginTop: 20}}>This is an example how to use a Button to send out a CAN message:</div>
      <Button variant="contained" size="large" onClick={onSendCanMessage}>
        Send CAN Message
      </Button>
    </Box>
  );
}

export default WorkspaceView;
