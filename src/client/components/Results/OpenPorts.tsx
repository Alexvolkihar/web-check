import { Card, Note } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const OpenPortsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const portData = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {portData.openPorts.map((port: any) => (
        <Row key={port}>{port}</Row>
      ))}
      <Note>
        Unable to establish connections to:
        <br />
        {portData.failedPorts.join(', ')}
      </Note>
    </Card>
  );
};

export default OpenPortsCard;
