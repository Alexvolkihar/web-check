import styled from '@emotion/styled';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import colors from 'client/styles/colors';
import type { Severity } from 'client/analysis/types';

export type Status = 'pass' | 'info' | 'warning' | 'error';

const STATUSES: Record<Status, { icon: IconDefinition; color: string; label: string }> = {
  pass: { icon: faCircleCheck, color: colors.success, label: 'Pass' },
  info: { icon: faCircleInfo, color: colors.info, label: 'Info' },
  warning: { icon: faTriangleExclamation, color: colors.warning, label: 'Warning' },
  error: { icon: faCircleXmark, color: colors.danger, label: 'Error' },
};

const Svg = styled.svg`
  height: 1em;
  flex-shrink: 0;
  vertical-align: -0.125em;
`;

interface IconProps {
  icon: IconDefinition;
  color?: string;
  label?: string;
}

// A Font Awesome icon, drawn as an inline SVG
const Icon = ({ icon, color = 'currentColor', label }: IconProps) => {
  const [width, height, , , path] = icon.icon;
  return (
    <Svg
      viewBox={`0 0 ${width} ${height}`}
      fill={color}
      role="img"
      aria-label={label}
      aria-hidden={!label}
    >
      <path d={Array.isArray(path) ? path.join(' ') : path} />
    </Svg>
  );
};

export const StatusIcon = ({ status }: { status: Status }) => <Icon {...STATUSES[status]} />;

export const toStatus = (severity: Severity): Status =>
  severity === 'critical' || severity === 'issue' ? 'error' : severity;

export default Icon;
