// deal with selection text

class Decorate {
  constructor(target) {
    this.target = target
  }
  name = 'selection decoration'
  target = ''
  type = ''
  option = {}
  result = ''
  getDecoratedText = (type, option = {}) => {
    this.type = type
    this.option = option
    return this.result = this.calcDecorateText(this.type, option)
  }
  calcDecorateText = (type, option = {}) => {
    switch (type) {
      case 'h1':
        return `\n# ${this.target} \n`
        break
      case 'h2':
        return `\n## ${this.target} \n`
        break
      case 'h3':
        return `\n### ${this.target} \n`
        break
      case 'h4':
        return `\n#### ${this.target} \n`
        break
      case 'h5':
        return `\n##### ${this.target} \n`
        break
      case 'h6':
        return `\n###### ${this.target} \n`
        break
      case 'bold':
        return `**${this.target}**`
        break
      case 'italic':
        return `*${this.target}*`
        break
      case 'underline':
        return `++${this.target}++`
        break
      case 'strikethrough':
        return `~~${this.target}~~`
        break
      case 'unorder':
        return `\n- ${this.target}\n`
        break 
      case 'order':
        return `\n1. ${this.target}\n`
        break  
      case 'quote':
        return `\n> ${this.target}\n`
        break   
      case 'hr':
        return `\n---\n`
        break  
      case 'inlinecode':
        return `\`${this.target}\``
        break  
      case 'code':
        return `\n\`\`\` javascript\n${this.target}\n\`\`\`\n`
        break  
      case 'table':
        // return `\n| ${this.target} |  |\n| -- | -- |\n|  |  |\n`
        return this.formatTableText(this.target, option)
        break  
      case 'image': 
        return `![${this.target}](${option.imageUrl || ''})`
        break   
      case 'link': 
        return `[${this.target}](${option.linkUrl || ''})`
        break       
      default:
        return `${this.target}`
    }
  }
  formatTableText = (target, option) => {
    const {row = 2, col = 2} = option
    let rowHeader = ['|']
    let rowData = ['|']
    let rowDivision = ['|']
    let colStr = ''
    let result = ''
    for (let i = 0; i <= col; i++) {
      rowHeader.push(' Head |')      
      rowDivision.push(' --- |')
      rowData.push(' Data |')
    }
    for (let j = 0; j <= row; j++) {
      colStr = colStr + '\n' + rowData.join('')
    }
    result = '\n' + rowHeader.join('') + '\n' + rowDivision.join('') + colStr + '\n'
    return result
  }
}

export default Decorate