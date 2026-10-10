import { Card, Note } from 'client/components/Form/Card';
import Row, { Section } from 'client/components/Form/Row';
import { getPath } from 'client/utils/result-processor';

const SecurityTxtCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { isPresent, foundIn, isPgpSigned, fields = {}, content } = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Present" val={!!isPresent} status={isPresent ? 'pass' : 'warning'} />
      {isPresent && (
        <>
          <Row lbl="File Location" val={foundIn} />
          <Row lbl="PGP Signed" val={!!isPgpSigned} status={isPgpSigned ? 'pass' : 'info'} />
          {Object.entries(fields).map(([field, value]: [string, any]) => {
            const isLink = value.includes('http');
            return (
              <Row
                key={field}
                lbl={field}
                val={isLink ? getPath(value) : value}
                link={isLink ? value : undefined}
              />
            );
          })}
          <Section title="View Full Policy" collapsible>
            <Row plaintext={content} />
          </Section>
        </>
      )}
      {!isPresent && (
        <Note>
          Having a security.txt ensures security researchers know how and where to safely report
          vulnerabilities.
        </Note>
      )}
    </Card>
  );
};

export default SecurityTxtCard;
