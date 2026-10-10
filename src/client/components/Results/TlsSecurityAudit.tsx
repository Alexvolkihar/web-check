import { Card } from 'client/components/Form/Card';
import Row, { type RowProps } from 'client/components/Form/Row';
import type { Status } from 'client/components/misc/Icon';

// Booleans are direct, ints follow SSL Labs scheme: 1 = safe, 2/3 = vulnerable
const isVulnerable = (v: any): boolean => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 2 || v === 3;
  return false;
};

const yesNo = (v: any, no: Status = 'error'): RowProps => ({
  val: !!v,
  status: v ? 'pass' : no,
});

// A yes or no where yes is the risk
const risk = (v: any): RowProps => ({ val: !!v, status: v ? 'warning' : 'pass' });

const fwdSecrecy = (n: number): RowProps => {
  if (n & 4) return { val: 'With all browsers', status: 'pass' };
  if (n & 2) return { val: 'With most modern browsers', status: 'warning' };
  if (n & 1) return { val: 'Limited', status: 'warning' };
  return { val: false };
};

const hsts = (policy?: any): RowProps => {
  if (policy?.status !== 'present') return { val: 'Not set', status: 'error' };
  const days = Math.round((policy.maxAge || 0) / 86400);
  const sub = policy.includeSubDomains ? ' + includeSubDomains' : '';
  if (days >= 365) return { val: `${days} days${sub}`, status: 'pass' };
  return { val: `${days} days${sub} (recommend >= 365)`, status: 'warning' };
};

// renegSupport bits: 1 insecure client-init, 2 secure, 4 secure client-init, 8 required
const reneg = (n?: number): RowProps => {
  if (!n) return { val: 'Not supported', status: 'pass' };
  if (n & 1) return { val: 'Insecure client-initiated', status: 'warning' };
  const flags = [];
  if (n & 2) flags.push('secure');
  if (n & 4) flags.push('secure client-initiated');
  if (n & 8) flags.push('server-required');
  return { val: flags.join(', ') || 'unknown', status: 'pass' };
};

const sessionResumption = (n?: number): RowProps => {
  if (n === 2) return { val: 'Supported', status: 'pass' };
  if (n === 1) return { val: 'IDs returned, not resumed', status: 'warning' };
  return { val: 'Not enabled', status: 'info' };
};

const compression = (n?: number): RowProps =>
  n ? { val: 'Supported (CRIME risk)', status: 'warning' } : { val: 'Disabled', status: 'pass' };

// Each entry returns the row's value, or null to hide the row entirely
const POSTURE: Array<[string, (d: any) => RowProps | null]> = [
  ['Forward Secrecy', (d) => fwdSecrecy(d.forwardSecrecy)],
  ['HSTS', (d) => hsts(d.hstsPolicy)],
  ['Session Resumption', (d) => sessionResumption(d.sessionResumption)],
  ['OCSP Stapling', (d) => yesNo(d.ocspStapling, 'info')],
  ['Renegotiation', (d) => reneg(d.renegSupport)],
  ['Fallback SCSV (downgrade protection)', (d) => yesNo(d.fallbackScsv, 'warning')],
  ['Certificate Transparency', (d) => yesNo(d.hasSct)],
  ['HTTP -> HTTPS Forwarding', (d) => (d.httpForwarding == null ? null : yesNo(d.httpForwarding))],
  ['ChaCha20 Preferred', (d) => yesNo(d.chaCha20Preference, 'info')],
  ['AEAD Cipher Support', (d) => yesNo(d.supportsAead)],
  ['Legacy CBC Cipher Support', (d) => risk(d.supportsCBC)],
  ['TLS Compression', (d) => compression(d.compressionMethods)],
  ['Static DH Key Reuse', (d) => risk(d.dhYsReuse)],
  ['Weak DH Primes', (d) => risk(d.dhUsesKnownPrimes)],
  ['Static ECDH Parameter Reuse', (d) => risk(d.ecdhParameterReuse)],
];

const VULNS: Array<[string, string]> = [
  ['heartbleed', 'Heartbleed'],
  ['poodle', 'POODLE (SSLv3)'],
  ['poodleTls', 'POODLE (TLS)'],
  ['zombiePoodle', 'Zombie POODLE'],
  ['goldenDoodle', 'GOLDENDOODLE'],
  ['sleepingPoodle', 'Sleeping POODLE'],
  ['zeroLengthPaddingOracle', 'Zero-Length Padding Oracle'],
  ['freak', 'FREAK'],
  ['logjam', 'LOGJAM'],
  ['drownVulnerable', 'DROWN'],
  ['openSslCcs', 'OpenSSL CCS Injection'],
  ['openSSLLuckyMinus20', 'OpenSSL Padding Oracle'],
  ['bleichenbacher', 'ROBOT (Bleichenbacher)'],
  ['ticketbleed', 'Ticketbleed'],
];

const TlsSecurityAuditCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element | null => {
  const ep = props.data?.endpoints?.[0];
  if (!ep?.details) return null;
  const d = ep.details;
  const protocols = (d.protocols || []).map((p: any) => `${p.name} ${p.version}`).join(', ');
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {ep.grade && <Row lbl="Grade" val={ep.grade} />}
      {ep.gradeTrustIgnored && ep.gradeTrustIgnored !== ep.grade && (
        <Row lbl="Grade (trust ignored)" val={ep.gradeTrustIgnored} />
      )}
      {protocols && <Row lbl="Protocols" val={protocols} />}
      {POSTURE.map(([label, getter]) => {
        const row = getter(d);
        return row && <Row key={label} lbl={label} {...row} />;
      })}
      {VULNS.map(([key, label]) => (
        <Row key={key} lbl={label} val={!isVulnerable(d[key])} yes="Safe" no="Vulnerable" />
      ))}
    </Card>
  );
};

export default TlsSecurityAuditCard;
