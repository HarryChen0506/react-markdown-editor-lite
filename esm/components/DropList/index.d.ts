import * as React from 'react';
interface DropListProps {
    show: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}
declare class DropList extends React.Component<DropListProps, any> {
    constructor(props: any);
    handleClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    render(): React.JSX.Element;
}
export default DropList;
