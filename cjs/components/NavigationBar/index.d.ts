import * as React from 'react';
interface NavigationBarProps {
    left?: React.ReactElement[];
    right?: React.ReactElement[];
    visible: boolean;
}
export default function NavigationBar(props: NavigationBarProps): React.JSX.Element;
export {};
