/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Krister Johansson. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFixedPositionModeMeasurementData, useNumericRadix, useProjectData } from '@kvaser/canking-api/hooks';
import { CanChannelSelectControl } from '@kvaser/canking-api/controls';
import { decimalToFixed, decimalToHex, Frame } from '@kvaser/canking-api/models';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
// interface ISessionData {
// }

// Define any default values for the project data that will be used when the component is created
// const defaultSessionData: ISessionData = {
// };

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
  // const { sessionData, setSessionData } = useSessionData<ISessionData>(id, defaultSessionData);

  // Use the useFixedPositionModeMeasurementData hook to get the latest measurement data
  // for all messages/frames with an unique fixed position key (Id + FrameFormat + ChannelId + Direction)
  const fixedPosData = useFixedPositionModeMeasurementData();

  // Only display frames/messages for the selected channel
  const fixedPosDataForChannel = useMemo(() =>
    fixedPosData
      .filter((data: Frame) => data.sourceId === projectData.channelId)
      .sort((a, b) => a.properties['FIXED_MODE_SORTABLE_KEY']?.stringValue.localeCompare(b.properties['FIXED_MODE_SORTABLE_KEY']?.stringValue ?? '') ?? 0),
    [fixedPosData, projectData.channelId]);

  // A callback that will get the new selected channel id and save it to the project data
  const onChannelIdentifierChange = useCallback((channelId: string) => {
    const data = { ...projectData };
    data.channelId = channelId;
    setProjectData(data);
  }, [projectData, setProjectData]);

  // A helper function to format the data bytes according to the selected numeric radix
  const formatData = useCallback((frameData: number[]) => {
    let res = '';
      frameData.forEach(v => {
        if (numericRadix === 16) {
          res = `${res}${decimalToHex(v)} `;
        } else {
          res = `${res}${decimalToFixed(v, 3)} `;
        }
      });
    return res;
  }, [numericRadix]);

  return (
    <Box aria-label="canking-extension-view" height={'100%'} width={'100%'}>
      <div style={{ marginLeft: '4px', marginRight: '4px' }}>
      <CanChannelSelectControl
        channelIdentifier={projectData.channelId}
        onChannelIdentifierChange={onChannelIdentifierChange}
        hideSectionControl
        />
        <TableContainer>
          <Table aria-label="fixed-position-data-table" size="small" padding="none">
            <TableHead>
              <TableRow>
                <TableCell>Channel</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Dir</TableCell>
                <TableCell>Length</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Delta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixedPosDataForChannel.map((data: Frame) => (
                <TableRow key={data.properties['FIXED_MODE_SORTABLE_KEY']?.stringValue ?? `${data.hashCode}`} hover>
                  <TableCell>{data.sourceName}</TableCell>
                  <TableCell>{data.messageName}</TableCell>
                  <TableCell><pre style={{ margin: '0px' }}>{numericRadix === 16 ? decimalToHex(data.id!, 8) : data.id!}</pre></TableCell>
                  <TableCell>{data.tx ? 'Tx' : 'Rx'}</TableCell>
                  <TableCell>{data.data.length}</TableCell>
                  <TableCell><pre style={{ margin: '0px' }}>{formatData(data.data)}</pre></TableCell>
                  <TableCell>{data.time.toFixed(6)}</TableCell>
                  <TableCell>{data.properties['FIXED_MODE_DELTA_TIME']?.doubleValue?.toFixed(6) ?? ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
}

export default WorkspaceView;
