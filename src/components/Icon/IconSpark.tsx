/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import * as React from 'react';

export const IconSpark = React.memo<JSX.IntrinsicElements['svg']>(
  function IconSpark({className}) {
    return (
      <svg
        className={cn('inline', className)}
        fill="none"
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" fill="#eee" r="16" />
        <rect fill="#eee" height="32" rx="3" width="32" />
        <path
          d="m15.7915 24.75h-.1583c-.1336-.0364-.2516-.1156-.3359-.2255s-.1302-.2443-.1308-.3828v-7.725h-2.3583c-.7006 0-1.3726-.2783-1.868-.7737s-.7737-1.1673-.7737-1.868v-6.31663c.0022-.16509.0687-.32281.1854-.43955.1168-.11675.2745-.18329.4396-.18545h5c.1651.00216.3228.0687.4396.18545.1167.11674.1832.27446.1854.43955v4.37503h3.3833c.3798-.0032.7536.0947 1.0831.2836s.6028.462.7919.7914c.1902.3293.2903.703.2903 1.0833s-.1001.754-.2903 1.0833l-5.3416 9.3584c-.0537.0964-.1323.1766-.2276.2323s-.2037.0849-.3141.0843zm-4.375-16.66663v5.69163c0 .3691.1466.7231.4076.9841s.615.4076.9841.4076h2.9833c.1651.0022.3228.0687.4396.1855.1167.1167.1832.2744.1854.4395v5.9833l4.1667-7.3166c.0796-.1396.1215-.2976.1215-.4584 0-.1607-.0419-.3187-.1215-.4583-.0815-.1472-.203-.2684-.3505-.3495s-.3149-.1189-.4829-.1088h-3.9583c-.1651-.0022-.3228-.0687-.4396-.1855-.1167-.1167-.1832-.2744-.1854-.4395v-4.37503z"
          fill="#606060"
          stroke="#606060"
          strokeWidth=".5"
        />
      </svg>
    );
  }
);

IconSpark.displayName = 'IconSpark';
