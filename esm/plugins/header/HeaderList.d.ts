import * as React from 'react';
interface HeaderListProps {
    onSelectHeader?: (header: string) => void;
}
declare class HeaderList extends React.Component<HeaderListProps, any> {
    handleHeader(header: string): void;
    render(): React.JSX.Element;
}
export default HeaderList;
