import { Card } from 'client/components/Form/Card';
import { ExpandableRow, type RowProps } from 'client/components/Form/Row';

const processScore = (percentile: number) => {
  return `${Math.round(percentile * 100)}%`;
};

interface Audit {
  id: string;
  score?: number | string;
  scoreDisplayMode?: string;
  title?: string;
  description?: string;
  displayValue?: string;
}

const makeValue = (audit: Audit): RowProps => {
  if (audit.displayValue) return { val: audit.displayValue };
  if (audit.score == null) return { val: 'N/A' };
  if (audit.scoreDisplayMode === 'binary') {
    return { val: audit.score === 1, yes: 'Pass', no: 'Fail' };
  }
  return { val: audit.score };
};

const LighthouseCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const lighthouse = props.data;
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {Object.keys(categories).map((key: string, index: number) => {
        const scoreIds = categories[key].auditRefs.map((ref: { id: string }) => ref.id);
        const scoreList = scoreIds.map((id: string) => {
          return {
            lbl: audits[id].title,
            title: audits[id].description,
            ...makeValue(audits[id]),
          };
        });
        return (
          <ExpandableRow
            key={`lighthouse-${index}`}
            lbl={categories[key].title || key}
            val={processScore(categories[key].score)}
            rowList={scoreList}
          />
        );
      })}
    </Card>
  );
};

export default LighthouseCard;
