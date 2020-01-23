class Decorate {
  constructor(target: string) {
    this.target = target;
  }
  name = 'selection decoration';
  target = '';
  type = '';
  option = {};
  result = '';
  getDecoratedText(type: string, option = {}) {
    this.type = type;
    this.option = option;
    return (this.result = this.calcDecorateText(this.type, option));
  }
  calcDecorateText(type: string, option: any = {}): string {
    switch (type) {
      case 'h1':
        return `\n# ${this.target} \n`;
      case 'h2':
        return `\n## ${this.target} \n`;
      case 'h3':
        return `\n### ${this.target} \n`;
      case 'h4':
        return `\n#### ${this.target} \n`;
      case 'h5':
        return `\n##### ${this.target} \n`;
      case 'h6':
        return `\n###### ${this.target} \n`;
      case 'bold':
        return `**${this.target}**`;
      case 'italic':
        return `*${this.target}*`;
      case 'underline':
        return `++${this.target}++`;
      case 'strikethrough':
        return `~~${this.target}~~`;
      case 'unordered':
        return `\n- ${this.target}\n`;
      case 'order':
        return `\n1. ${this.target}\n`;
      case 'quote':
        return `\n> ${this.target}\n`;
      case 'hr':
        return '\n---\n';
      case 'inlinecode':
        return `\`${this.target}\``;
      case 'code':
        return `\n\`\`\`\n${this.target}\n\`\`\`\n`;
      case 'table':
        // return `\n| ${this.target} |  |\n| -- | -- |\n|  |  |\n`
        return this.formatTableText(this.target, option);
      case 'image':
        return `![${option.target}](${option.imageUrl || ''})`;
      case 'link':
        return `[${this.target}](${option.linkUrl || ''})`;
    }
    return `${this.target}`;
  }
  formatTableText(target: string, option: any) {
    const { row = 2, col = 2 } = option;
    const rowHeader = ['|'];
    const rowData = ['|'];
    const rowDivision = ['|'];
    let colStr = '';
    for (let i = 0; i <= col; i++) {
      rowHeader.push(' Head |');
      rowDivision.push(' --- |');
      rowData.push(' Data |');
    }
    for (let j = 0; j <= row; j++) {
      colStr += '\n' + rowData.join('');
    }
    return `\n${rowHeader.join('')}\n${rowDivision.join('')}${colStr}\n`;
  }
}

export default Decorate;
