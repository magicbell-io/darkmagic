import * as React from 'react';

import { makeComponent } from '../lib/component.js';
import { ComponentProps, styled } from '../lib/stitches.js';

const StyledBadge = styled('div', {
  font: '$caption',
  fontSize: '$3xs',
  textTransform: 'uppercase',
  height: '$5',
  display: 'inline-flex',
  alignItems: 'center',
  userSelect: 'none',
  gap: '$2',
  padding: '0 10px',
  borderRadius: '$full',

  '& svg': {
    flex: 'none',
  },

  variants: {
    color: {
      default: { $$color: '$colors$text-default' },
      muted: { $$color: '$colors$text-muted' },
      info: { $$color: '$colors$text-info' },
      success: { $$color: '$colors$text-success' },
      warning: { $$color: '$colors$text-warning' },
      error: { $$color: '$colors$text-error' },
      'accent-1': { $$color: '$colors$accent-1-text' },
      'accent-2': { $$color: '$colors$accent-2-text' },
      'accent-3': { $$color: '$colors$accent-3-text' },
    },
    variant: {
      filled: {
        background: '$$color',
        color: '$text-default',
      },
      dot: {
        color: '$text-default',
        '& svg': { color: '$$color' },
        padding: '0 $2',
      },
      outline: {
        '& svg': { color: '$$color' },
        border: '1px solid $$color',
        color: '$$color',
      },
    },
  },
});

const DotIcon = function DotIcon() {
  return (
    <svg width={8} height={8} viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
};

type StyledBadgeProps = ComponentProps<typeof StyledBadge>;
type BadgeProps = {
  /**
   * The icon to show before the label. Defaults to a filled dot.
   */
  icon?: React.FunctionComponent | React.ReactElement;
  /**
   * The color of the leading icon.
   */
  color?: StyledBadgeProps['color'];
  /**
   * The label to show. Any valid React node is allowed, but a short string is recommended.
   */
  children?: React.ReactNode;
  /**
   * The variant of the badge.
   */
  variant?: StyledBadgeProps['variant'];
};

export const Badge = React.forwardRef<React.ElementRef<typeof StyledBadge>, BadgeProps>(function Badge(
  { icon, color = 'muted', children, variant = 'dot', ...props },
  ref,
) {
  const Icon = makeComponent(icon) || (variant === 'dot' ? DotIcon : null);

  return (
    <StyledBadge color={color} variant={variant} {...props} ref={ref}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      {children ? <div>{children}</div> : null}
    </StyledBadge>
  );
});
