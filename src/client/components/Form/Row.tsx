import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import { StatusIcon, type Status } from 'client/components/misc/Icon';

export interface RowProps {
  lbl?: string;
  val?: string | number | boolean;
  status?: Status;
  yes?: string;
  no?: string;
  title?: string;
  link?: string;
  plaintext?: string;
  listResults?: string[];
  children?: ReactNode;
}

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  column-gap: 0.5rem;
  padding: 0.25rem;
  &:not(:last-child) {
    border-bottom: 1px solid ${colors.primaryTransparent};
  }
  > a {
    color: ${colors.textColor};
    &:hover {
      color: ${colors.primary};
    }
  }
  span.lbl {
    font-weight: bold;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.val {
    max-width: 16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
      color: ${colors.primary};
    }
    svg {
      margin-right: 0.4em;
    }
  }
`;

const Details = styled.details`
  transition: all 0.2s ease-in-out;
  > summary {
    padding-left: 1rem;
    list-style: none;
    cursor: pointer;
    &::-webkit-details-marker {
      display: none;
    }
  }
  > summary:before {
    content: '►';
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] > summary:before {
    content: '▼';
  }
`;

const Collapsible = styled(Details)`
  > summary {
    margin: 1rem 0 0.5rem 0;
  }
`;

const SubRows = styled.div`
  padding: 0.25rem;
  background: ${colors.primaryTransparent};
`;

const PlainText = styled.pre`
  background: ${colors.background};
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  padding: 0.25rem;
`;

const List = styled.ul`
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  margin: 0;
  padding: 0.25rem 0.25rem 0.25rem 1rem;
  li {
    text-overflow: ellipsis;
    list-style: circle;
    &:first-letter {
      text-transform: capitalize;
    }
    &::marker {
      color: ${colors.primary};
    }
  }
`;

// Only date-format strings holding an ISO date or a time, not names with numbers in
const isDateLike = (value: any): boolean => {
  if (typeof value !== 'string' || !/\d{4}-\d\d-\d\d|\d\d?:\d\d:\d\d/.test(value)) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  return date >= new Date('1995-01-01') && date <= new Date('2030-12-31');
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

// The text shown for a value, with dates formatted and booleans as yes or no
const valueText = ({ val, yes = 'Yes', no = 'No' }: RowProps): string => {
  if (typeof val === 'boolean') return val ? yes : no;
  return isDateLike(val) ? formatDate(val as string) : String(val ?? '');
};

// A value's status icon and text, as a link when given one
const Value = (props: RowProps) => {
  const { val, link } = props;
  const status = props.status || (typeof val === 'boolean' ? (val ? 'pass' : 'error') : undefined);
  const text = valueText(props);
  return (
    <>
      {status && <StatusIcon status={status} />}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          {text}
        </a>
      ) : (
        text
      )}
    </>
  );
};

const snip = (text: string, length: number = 80) => {
  if (text.length < length) return text;
  return `${text.substring(0, length)}...`;
};

// A titled group of rows, which can start collapsed
export const Section = (props: {
  title: ReactNode;
  collapsible?: boolean;
  children: ReactNode;
}) => {
  const { title, collapsible, children } = props;
  const heading = (
    <Heading as="h4" size="small" align="left" color={colors.primary} inline={collapsible}>
      {title}
    </Heading>
  );
  if (!collapsible) {
    return (
      <>
        {title && heading}
        {children}
      </>
    );
  }
  return (
    <Collapsible>
      <summary>{heading}</summary>
      {children}
    </Collapsible>
  );
};

export const ExpandableRow = (props: RowProps & { rowList?: RowProps[]; open?: boolean }) => {
  const { lbl, val, title, rowList = [], open } = props;
  return (
    <Details open={open}>
      <StyledRow as="summary">
        <span className="lbl" title={title}>
          {lbl}
        </span>
        {val != null && (
          <span className="val" title={title || valueText(props)}>
            <Value {...props} />
          </span>
        )}
      </StyledRow>
      <SubRows>
        {rowList.map((row, index) => (
          <Row key={index} {...row} />
        ))}
      </SubRows>
    </Details>
  );
};

export const ListRow = (props: { list: string[]; title: string }) => {
  const { list, title } = props;
  return (
    <Section title={title}>
      {list.map((entry, index) => (
        <Row key={`${entry}-${index}`}>{entry}</Row>
      ))}
    </Section>
  );
};

const Row = (props: RowProps) => {
  const { lbl, val, title, plaintext, listResults, children } = props;
  if (children) return <StyledRow>{children}</StyledRow>;
  const text = valueText(props);
  return (
    <StyledRow>
      {lbl && (
        <span className="lbl" title={title}>
          {lbl}
        </span>
      )}
      {val != null && (
        <span
          className="val"
          title={title || text}
          onClick={() => navigator.clipboard.writeText(text)}
        >
          <Value {...props} />
        </span>
      )}
      {plaintext && <PlainText>{plaintext}</PlainText>}
      {listResults && (
        <List>
          {listResults.map((listItem, listIndex) => (
            <li key={listIndex} title={listItem}>
              {snip(listItem)}
            </li>
          ))}
        </List>
      )}
    </StyledRow>
  );
};

export default Row;
