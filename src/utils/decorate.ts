// deal with selection text
function calcDecorateText(target: string, type: string, option: any = {}) {
  switch (type) {
    case 'h1':
      return `\n# ${target} \n`
    case 'h2':
      return `\n## ${target} \n`
    case 'h3':
      return `\n### ${target} \n`
    case 'h4':
      return `\n#### ${target} \n`
    case 'h5':
      return `\n##### ${target} \n`
    case 'h6':
      return `\n###### ${target} \n`
    case 'bold':
      return `**${target}**`
    case 'italic':
      return `*${target}*`
    case 'underline':
      return `++${target}++`
    case 'strikethrough':
      return `~~${target}~~`
    case 'unorder':
      return `\n- ${target}\n`
    case 'order':
      return `\n1. ${target}\n`
    case 'quote':
      return `\n> ${target}\n`
    case 'hr':
      return `\n---\n`
    case 'inlinecode':
      return `\`${target}\``
    case 'code':
      return `\n\`\`\`\n${target}\n\`\`\`\n`
    case 'table':
      // return `\n| ${this.target} |  |\n| -- | -- |\n|  |  |\n`
      return formatTableText(target, option)
    case 'image': 
      return `![${target}](${option.imageUrl || ''})`
    case 'link': 
      return `[${target}](${option.linkUrl || ''})`
    default:
      return `${target}`
  }
}
function formatTableText(target: string, option: any) {
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

export default calcDecorateText;