// navigationBar
import * as React from 'react';

interface NavigationBarProps {
  left?: JSX.Element;
  middle?: JSX.Element;
  right?: JSX.Element;
}

export default function NavigationBar(props: NavigationBarProps) {
  return (
    <div className={'rc-md-navigation'}>
      <div className="navigation-nav left">{props.left}</div>
      <div className="navigation-nav middle">{props.middle}</div>
      <div className="navigation-nav right">{props.right}</div>
    </div>
  );
}
