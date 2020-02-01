// TableList
import * as React from 'react';

interface InputFileProps {
  accept: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

class InputFile extends React.Component<InputFileProps, any> {
  private timerId?: number;
  private locked: boolean;
  private input: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.timerId = undefined;
    this.locked = false;
    this.input = React.createRef();
  }

  click() {
    if (this.locked || !this.input.current) {
      return;
    }
    this.locked = true;
    this.input.current.value = '';
    this.input.current.click();
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
    this.timerId = window.setTimeout(() => {
      this.locked = false;
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }, 200);
  }

  componentWillUnmount() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
  }

  render() {
    return (
      <input
        type="file"
        ref={this.input}
        accept={this.props.accept}
        style={{
          position: 'absolute',
          zIndex: -1,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          opacity: 0,
        }}
        onChange={this.props.onChange}
      />
    );
  }
}
export default InputFile;
