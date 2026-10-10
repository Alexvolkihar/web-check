import { Card } from 'client/components/Form/Card';
import Row, { type RowProps } from 'client/components/Form/Row';
import { toStatus, type Status } from 'client/components/misc/Icon';
import { gradeSeverity } from 'client/analysis/rules/tls-security-audit';
import { MIN_MAX_AGE } from 'client/analysis/rules/hsts';

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

// SSL Labs HSTS statuses that leave the site without a working policy
const HSTS_PROBLEMS: Record<string, string> = {
  absent: 'Not set',
  invalid: 'Invalid',
  disabled: 'Disabled',
};

// The HSTS policy SSL Labs found, held to the same one year max-age as the HSTS card
const hsts = (policy?: any): RowProps | null => {
  if (policy?.status !== 'present') {
    const problem = HSTS_PROBLEMS[policy?.status];
    return problem ? { val: problem, status: 'error' } : null;
  }
  const days = Math.round((policy.maxAge || 0) / 86400);
  const sub = policy.includeSubDomains ? ' + includeSubDomains' : '';
  const val = `${days} day${days === 1 ? '' : 's'}${sub}`;
  if (policy.maxAge >= MIN_MAX_AGE) return { val, status: 'pass' };
  return { val, status: 'warning', title: 'Under the one year the HSTS preload list needs' };
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
  ['Redirects To', (d) => (d.httpForwarding ? { val: d.httpForwarding } : null)],
  ['ChaCha20 Preferred', (d) => yesNo(d.chaCha20Preference, 'info')],
  ['AEAD Cipher Support', (d) => yesNo(d.supportsAead)],
  ['Legacy CBC Cipher Support', (d) => risk(d.supportsCBC)],
  ['TLS Compression', (d) => compression(d.compressionMethods)],
  ['Static DH Key Reuse', (d) => risk(d.dhYsReuse)],
  ['Weak DH Primes', (d) => risk(d.dhUsesKnownPrimes === 2)],
  ['Static ECDH Parameter Reuse', (d) => risk(d.ecdhParameterReuse)],
];

// Each vulnerability test, with any SSL Labs results that are neither safe nor vulnerable
const VULNS: Array<[string, string, Record<number, string>?]> = [
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
  ['bleichenbacher', 'ROBOT (Bleichenbacher)', { 4: 'Inconsistent results' }],
  ['ticketbleed', 'Ticketbleed', { 3: 'Similar bug found' }],
];

// A test result, where SSL Labs numbers mean 1 safe, below 1 untested, and above 1 vulnerable
const vulnerability = (result: unknown, others: Record<number, string> = {}): RowProps | null => {
  if (result == null) return null;
  if (typeof result === 'boolean') return { val: !result, yes: 'Safe', no: 'Vulnerable' };
  if (typeof result !== 'number' || result < 1) return { val: 'Not tested' };
  if (others[result]) return { val: others[result], status: 'warning' };
  return { val: result === 1, yes: 'Safe', no: 'Vulnerable' };
};

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
      {ep.grade && <Row lbl="Grade" val={ep.grade} status={toStatus(gradeSeverity(ep.grade))} />}
      {ep.gradeTrustIgnored && ep.gradeTrustIgnored !== ep.grade && (
        <Row lbl="Grade (trust ignored)" val={ep.gradeTrustIgnored} />
      )}
      {protocols && <Row lbl="Protocols" val={protocols} />}
      {POSTURE.map(([label, getter]) => {
        const row = getter(d);
        return row && <Row key={label} lbl={label} {...row} />;
      })}
      {VULNS.map(([key, label, others]) => {
        const row = vulnerability(d[key], others);
        return row && <Row key={key} lbl={label} {...row} />;
      })}
    </Card>
  );
};

export default TlsSecurityAuditCard;
