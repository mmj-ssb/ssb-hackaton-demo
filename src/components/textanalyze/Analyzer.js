import React from 'react'
import { Button, Form, TextArea, Divider } from 'semantic-ui-react'

class Analyzer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialText: 'Lim inn tekst',
      textArray: '',
      countArray: ''
    }
  }

  countWordInText = (text) => {
    let trimmedArray = this.trimArray(text.split(' '))
    let counts = this.countSimularElement(trimmedArray)
    console.log(counts)
    return counts
  }

  trimArray = (array) => {
    let trimmedArray = []
    array.forEach(function (word) {
      let pattern = /([^[a-zA-Z-æøåÆØÅ])+/ig
      word = word.replace(pattern, '').toLowerCase()
      trimmedArray.push(word)
    })
    return trimmedArray
  }

  countSimularElement = (array) => {
    let counts = []
    array.forEach(function (x) { counts[x] = (counts[x] || 0) + 1 })
    return counts
  }

  handleMakeButtonClick = () => {
    let trimmedArray = this.trimArray(this.state.initialText.split(' '))

    this.setState({
      textArray: trimmedArray
    })
  }

  handleCountButtonClick = () => {
    let counts = this.countSimularElement(this.state.textArray)

    this.setState({
      countArray: counts
    })

    console.log(counts)
  }

  handleTextAreaChange = (e) => {
    this.setState({initialText: e.target.value})
  }

  render () {
    return (
      <Form>
        <TextArea placeholder='Initiell tekst' onChange={this.handleTextAreaChange} value={this.state.initialText}
                  style={{minHeight: 500}}/>
        <Divider></Divider>
        <Button content='Lag array' onClick={this.handleMakeButtonClick}/>
        <Divider></Divider>
        <TextArea placeholder='Array' value={this.state.textArray.toString()} style={{minHeight: 500}}/>
        <Divider></Divider>
        <Button content='Tell forekomster' onClick={this.handleCountButtonClick}/>
        <Divider></Divider>
      </Form>
    )
  }

}

export default Analyzer
