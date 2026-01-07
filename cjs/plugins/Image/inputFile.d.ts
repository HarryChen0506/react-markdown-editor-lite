import * as React from 'react';
interface InputFileProps {
    accept: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare class InputFile extends React.Component<InputFileProps, any> {
    private timerId?;
    private locked;
    private input;
    constructor(props: any);
    click(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
export default InputFile;
