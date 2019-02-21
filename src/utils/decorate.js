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
  getDecoratedText = (type, option) => {
    this.type = type
    this.option = option
    return this.result = this.calcDecorateText(this.type, option)
  }
  calcDecorateText = (type) => {
    switch (type) {
      case 'h1':
        return `\n # ${this.target} \n`
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
      case 'image': 
        return `![${this.target}](https://octodex.github.com/images/minion.png)`
        break       
      default:
        return `${this.target}`
    }
  }
}

export default Decorate