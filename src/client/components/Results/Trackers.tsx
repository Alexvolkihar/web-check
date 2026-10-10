import { Card } from 'client/components/Form/Card';
import Row, { ExpandableRow, ListRow, Section } from 'client/components/Form/Row';

const regions = new Intl.DisplayNames(['en'], { type: 'region' });

// Rows shown when a tracker is expanded, skipping any that are unknown
const details = (tracker: any) =>
  [
    { lbl: 'Requests', val: String(tracker.requests) },
    ...tracker.hosts.map((host: string) => ({ lbl: 'Host', val: host })),
    { lbl: 'Based In', val: tracker.country && regions.of(tracker.country) },
    { lbl: 'Privacy Policy', val: tracker.privacyPolicy && 'View', link: tracker.privacyPolicy },
  ].filter((row) => row.val);

const TrackersCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { requests, trackers = [], otherTrackers = [], unknown = [] } = props.data;
  const categories: string[] = [...new Set<string>(trackers.map((t: any) => t.category))];
  const companies = new Set(trackers.map((t: any) => t.company)).size;
  const found = trackers.length + otherTrackers.length + unknown.length;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Requests Made" val={requests} />
      {companies > 0 && <Row lbl="Companies" val={companies} />}
      {!found && <Row lbl="Third Parties" val="None" status="pass" />}
      {categories.map((category) => (
        <Section key={category} title={category}>
          {trackers
            .filter((t: any) => t.category === category)
            .map((tracker: any) => (
              <ExpandableRow
                key={tracker.name}
                lbl={tracker.name}
                val={tracker.company}
                rowList={details(tracker)}
              />
            ))}
        </Section>
      ))}
      {otherTrackers.length > 0 && <ListRow title="Other Trackers" list={otherTrackers} />}
      {unknown.length > 0 && <ListRow title="Unrecognised" list={unknown} />}
    </Card>
  );
};

export default TrackersCard;
