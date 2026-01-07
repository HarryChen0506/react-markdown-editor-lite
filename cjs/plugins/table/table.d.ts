import * as React from 'react';
interface TableListProps {
    maxRow?: number;
    maxCol?: number;
    visibility: boolean;
    onSetTable?: (table: {
        row: number;
        col: number;
    }) => void;
}
interface TableListState {
    maxRow: number;
    maxCol: number;
    list: number[][];
}
declare class TableList extends React.Component<TableListProps, TableListState> {
    config: {
        padding: number;
        width: number;
        height: number;
    };
    constructor(props: any);
    formatTableModel(maxRow?: number, maxCol?: number): any[][];
    calcWrapStyle(): {
        width: string;
        height: string;
    };
    calcItemStyle(row?: number, col?: number): {
        top: string;
        left: string;
    };
    private getList;
    handleHover(i: number, j: number): void;
    handleSetTable(i: number, j: number): void;
    componentDidUpdate(prevProps: TableListProps): void;
    render(): React.JSX.Element;
}
export default TableList;
