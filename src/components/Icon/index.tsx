// Icon
import * as React from 'react';
import './font.less';

interface IconProps {
  type: string;
}

export default function Icon(props: IconProps) {
  return <i className={`rmel-iconfont rmel-icon-${props.type}`} />;
}
