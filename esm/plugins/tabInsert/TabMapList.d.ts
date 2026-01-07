import * as React from 'react';
interface TabMapListProps {
    value: number;
    onSelectMapValue?: (mapValue: number) => void;
}
declare class TabMapList extends React.Component<TabMapListProps, any> {
    handleSelectMapValue(mapValue: number): void;
    render(): React.JSX.Element;
}
export default TabMapList;
