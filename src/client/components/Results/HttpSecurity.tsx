import { Card } from 'client/components/Form/Card';
import Row, { type RowProps } from 'client/components/Form/Row';
import { worstStatus } from 'client/components/misc/Icon';
import { HEADERS, checkHeader, hasFrameAncestors } from 'client/analysis/rules/http-security';

const cardStyles = `
  span.lbl { flex: none !important; }
  span.val { flex: 1 1 auto !important; max-width: none !important; }
`;

// A header's value, with the status of its worst finding, and any problems above it on hover
const showHeader = (d: any, key: string): RowProps => {
  const findings = checkHeader(d, key);
  const problems = findings.filter((f) => f.severity !== 'pass').map((f) => f.title);
  const val = d[key] || (key === 'xFrameOptions' && hasFrameAncestors(d) ? 'Via CSP' : 'No');
  return {
    val,
    status: worstStatus(findings),
    title: [...problems, d[key]].filter(Boolean).join('\n'),
  };
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
