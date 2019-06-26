import React from 'react'

export interface PreviewProps {
  html: string;
  className?: string;
}

export interface Preview extends React.Component<PreviewProps, any> {
  render(): any;
}