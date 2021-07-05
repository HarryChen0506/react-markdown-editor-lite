import * as React from 'react';

interface ToolBarProps {
  style?: React.CSSProperties;
  children: any;
}

export default function ToolBar(props: ToolBarProps) {
  return (
    <div className="tool-bar" style={props.style}>
      {props.children}
    </div>
  );
}
