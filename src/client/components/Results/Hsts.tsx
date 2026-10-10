import { Card } from 'client/components/Form/Card';
import Row, { type RowProps } from 'client/components/Form/Row';

// Split an HSTS header into its directives, showing flags like preload as Yes
const parseHeader = (header: string): RowProps[] =>
  header
    .split(';')
    .filter((part) => part.trim())
    .map((part) => {
      const [name, ...value] = part.split('=');
      return { lbl: name.trim(), val: value.length ? value.join('=').trim() : true };
    });

const HstsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { hstsHeader, message } = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="HSTS Enabled?" val={!!hstsHeader} />
      {hstsHeader &&
        parseHeader(hstsHeader).map((directive) => <Row key={directive.lbl} {...directive} />)}
      {message && <p>{message}</p>}
    </Card>
  );
};

export default HstsCard;
