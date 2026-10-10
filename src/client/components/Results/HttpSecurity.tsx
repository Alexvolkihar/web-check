import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';
import { toStatus } from 'client/components/misc/Icon';
import { SEVERITIES } from 'client/analysis/types';
import { HEADERS, checkHeader, hasFrameAncestors } from 'client/analysis/rules/http-security';

const cardStyles = `
  span.lbl { flex: none !important; }
  span.val { flex: 1; text-align: right; }
`;

// A header's value, with the status of its worst finding
const showHeader = (d: any, key: string) => {
  const severities = checkHeader(d, key).map((finding) => finding.severity);
  const status = toStatus(SEVERITIES.find((s) => severities.includes(s)) || 'pass');
  const val = d[key] || (key === 'xFrameOptions' && hasFrameAncestors(d) ? 'Via CSP' : 'No');
  return { val, status };
};

const HttpSecurityCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const d = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {Object.entries(HEADERS).map(
        ([key, label]) =>
          (d[key] || key !== 'xXSSProtection') && (
            <Row key={key} lbl={label} {...showHeader(d, key)} />
          ),
      )}
    </Card>
  );
};

export default HttpSecurityCard;
