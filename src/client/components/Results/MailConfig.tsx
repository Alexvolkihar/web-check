import { Card } from 'client/components/Form/Card';
import Row, { ListRow, Section, type RowProps } from 'client/components/Form/Row';
import { toStatus } from 'client/components/misc/Icon';
import type { Severity } from 'client/analysis/types';
import {
  checkSpf,
  checkDmarc,
  checkDkim,
  checkMtaSts,
  findRecords,
  mxHosts,
  sendsNoMail,
  type MailData,
} from 'client/analysis/rules/mail-config';

// A check as Yes, unless it failed, with an icon for how well it passed
const checkRow = ({ severity }: { severity: Severity }): RowProps => {
  const status = toStatus(severity);
  return { val: status !== 'error', status };
};

const dkimStatus = (d: MailData): RowProps => {
  const check = checkRow(checkDkim(d));
  if (d.dkim?.length) return check;
  return { ...check, val: sendsNoMail(d) ? 'Not needed' : 'Not found' };
};

// MTA-STS as a yes or no, or its mode when not enforced yet
const mtaStsStatus = (d: MailData): RowProps => {
  if (!d.mtaSts) return { val: 'Not set up', status: 'info' };
  const check = checkMtaSts(d)!;
  if (check.severity === 'info') return { val: `Mode: ${d.mtaSts.mode}`, status: 'info' };
  return checkRow(check);
};

const MailConfigCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const mailServer = props.data;
  const txt = mailServer.txtRecords || [];
  const senders = (findRecords(txt, 'v=spf1')[0] || '')
    .split(' ')
    .map((term) => term.split('include:')[1])
    .filter(Boolean);
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Section title="Mail Security Checklist">
        <Row lbl="SPF" {...checkRow(checkSpf(mailServer))} />
        <Row lbl="DKIM" {...dkimStatus(mailServer)} />
        <Row lbl="DMARC" {...checkRow(checkDmarc(mailServer))} />
        <Row lbl="BIMI" val={findRecords(txt, 'v=BIMI1').length > 0 || 'Not set up'} />
        {mxHosts(mailServer).length > 0 && (
          <>
            <Row lbl="MTA-STS" {...mtaStsStatus(mailServer)} />
            <Row lbl="TLS-RPT" val={findRecords(txt, 'v=TLSRPTv1').length > 0 || 'Not set up'} />
            <Row lbl="DANE" val={mailServer.dane?.length > 0 || 'Not set up'} />
          </>
        )}
      </Section>
      {mailServer.mxRecords?.length > 0 && (
        <Section title="MX Records">
          {mailServer.mxRecords.map((record: any, index: number) => (
            <Row
              key={index}
              lbl={record.exchange || 'Null MX, accepts no mail'}
              val={record.exchange && `Priority: ${record.priority}`}
            />
          ))}
        </Section>
      )}
      {mailServer.mailServices?.length > 0 && (
        <Section title="External Mail Services">
          {mailServer.mailServices.map((service: any, index: number) => (
            <Row key={index} lbl={service.provider} title={service.value} />
          ))}
        </Section>
      )}
      {senders.length > 0 && <ListRow title="Authorised Senders" list={senders} />}
      {txt.length > 0 && (
        <Section title={`Mail-related TXT Records (${txt.length})`} collapsible>
          {txt.map((record: string[], index: number) => (
            <Row key={index}>{record.join('')}</Row>
          ))}
        </Section>
      )}
    </Card>
  );
};

export default MailConfigCard;
