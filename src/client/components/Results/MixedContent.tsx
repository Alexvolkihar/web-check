import { Card } from 'client/components/Form/Card';
import Row, { ListRow, type RowProps } from 'client/components/Form/Row';

// Sum up the mixed content, noting when the page's CSP upgrades it to https
const mixedSummary = (https: boolean, count: number, upgraded: boolean): RowProps => {
  if (!https) return { val: 'N/A, page is HTTP' };
  if (!count) return { val: 'None', status: 'pass' };
  if (upgraded) return { val: `${count} upgraded by CSP`, status: 'warning' };
  return { val: `${count} found`, status: 'error' };
};

const MixedContentCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { url, upgradeInsecureRequests, integrityPolicy, thirdPartyScripts } = props.data;
  const { active = [], passive = [], forms = [], missingCrossorigin = [] } = props.data;
  const { versioned = [], unversioned = [] } = props.data.missingIntegrity || {};
  const https = url.startsWith('https:');
  const mixed = active.length + passive.length + forms.length;
  const hashed = thirdPartyScripts - versioned.length - unversioned.length;
  const lists: [string, string[]][] = [
    ['Insecure Scripts, Styles & Frames', active],
    ['Insecure Images & Media', passive],
    ['Insecure Form Targets', forms],
    ['Versioned Scripts Without SRI', versioned],
    ['Unversioned Scripts Without SRI', unversioned],
    ['SRI Scripts Missing crossorigin', missingCrossorigin],
  ];
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      <Row lbl="Page" val={url} />
      <Row lbl="Mixed Content" {...mixedSummary(https, mixed, upgradeInsecureRequests)} />
      {https && (upgradeInsecureRequests || mixed > 0) && (
        <Row lbl="Upgrade Insecure Requests" val={upgradeInsecureRequests} />
      )}
      <Row lbl="Third-Party Scripts in HTML" val={thirdPartyScripts} />
      {thirdPartyScripts > 0 && <Row lbl="Using SRI" val={`${hashed} of ${thirdPartyScripts}`} />}
      {integrityPolicy && <Row lbl="Integrity-Policy" val="Enforced" status="pass" />}
      {lists.map(
        ([title, list]) => list.length > 0 && <ListRow key={title} title={title} list={list} />,
      )}
    </Card>
  );
};

export default MixedContentCard;
