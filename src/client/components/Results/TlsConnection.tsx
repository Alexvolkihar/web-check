import { Card } from 'client/components/Form/Card';
import Row, { Section } from 'client/components/Form/Row';
import { toStatus, type Status } from 'client/components/misc/Icon';
import { protocolSeverity } from 'client/analysis/rules/tls-connection';

// Each TLS version, with its status when enabled and when disabled
const VERSIONS: [string, string, Status?, Status?][] = [
  ['TLSv1.3', 'TLS 1.3', 'pass', 'info'],
  ['TLSv1.2', 'TLS 1.2'],
  ['TLSv1.1', 'TLS 1.1', 'error', 'pass'],
  ['TLSv1', 'TLS 1.0', 'error', 'pass'],
];

const formatEphemeralKey = (k: any): string => {
  if (!k?.type) return '';
  const parts = [k.type];
  if (k.name) parts.push(`(${k.name})`);
  if (k.size) parts.push(`${k.size}-bit`);
  return parts.join(' ');
};

const TlsConnectionCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element => {
  const d = props.data || {};
  const cipherName = d.cipher?.standardName || d.cipher?.name || '';
  const ephemeral = formatEphemeralKey(d.ephemeralKey);
  const severity = protocolSeverity(d.protocol || '');
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {d.protocol && (
        <Row lbl="Protocol" val={d.protocol} status={severity && toStatus(severity)} />
      )}
      {cipherName && <Row lbl="Cipher Suite" val={cipherName} />}
      {d.cipher?.version && <Row lbl="Cipher Version" val={d.cipher.version} />}
      {ephemeral && <Row lbl="Ephemeral Key" val={ephemeral} />}
      {d.alpnProtocol && (
        <Row
          lbl="ALPN"
          val={d.alpnProtocol}
          status={d.alpnProtocol === 'h2' ? 'pass' : undefined}
        />
      )}
      <Row
        lbl="Forward Secrecy"
        val={!!d.forwardSecrecy}
        status={d.forwardSecrecy ? 'pass' : 'warning'}
      />
      <Row
        lbl="Session Resumption"
        val={!!d.sessionResumption}
        status={d.sessionResumption ? 'pass' : 'info'}
      />
      <Row
        lbl="OCSP Stapling"
        val={d.ocspStapled ? 'Present' : 'Not Present'}
        status={d.ocspStapled ? 'pass' : 'info'}
        title={d.ocspStapled ? undefined : 'May impact visitor privacy'}
      />
      <Row
        lbl="Certificate Trust"
        val={!!d.authorized}
        yes="Trusted"
        no={d.authError || 'Untrusted'}
      />
      {d.versions && (
        <Section title="TLS Versions">
          {VERSIONS.map(([id, label, enabled, disabled]) => {
            const on = d.versions.includes(id);
            return (
              <Row
                key={id}
                lbl={label}
                val={on ? 'Enabled' : 'Disabled'}
                status={on ? enabled : disabled}
              />
            );
          })}
        </Section>
      )}
    </Card>
  );
};

export default TlsConnectionCard;
