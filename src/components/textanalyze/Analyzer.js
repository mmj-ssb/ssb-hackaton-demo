import React from 'react'
import { Button, Form, TextArea, Divider } from 'semantic-ui-react'

class Analyzer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialText: 'Klipp inn tekst',
      textArray: '',
      countArray: ''
    }
  }

  handleMakeButtonClick = () => {
    let array = this.state.initialText.split(' ')
    let trimmedArray = []

    array.forEach(function(word){
      //let pattern = /([^\s\w]|_)+/ig
      let pattern = /([^[a-zA-Z-æøåÆØÅ]+$)+/ig
      word = word.replace(pattern, '').toLowerCase()
      trimmedArray.push(word)
    })

    this.setState({
      textArray : trimmedArray
    })
  }

  handleCountButtonClick = () => {
    let array = this.state.textArray

    let counts = []
    array.forEach(function(x) { counts[x] = (counts[x] || 0)+1 })

    this.setState({
      countArray : counts
    })

    console.log(counts)
  }

  handleTextAreaChange = (e) => {
    this.setState({initialText: e.target.value})
  }

  render () {
    return (
      <Form>
        <TextArea placeholder='Initiell tekst' onChange={this.handleTextAreaChange} value={this.state.initialText}/>
        <Divider></Divider>
        <Button content='Lag array' onClick={this.handleMakeButtonClick} />
        <Divider></Divider>
        <TextArea placeholder='Array' value={this.state.textArray}/>
        <Divider></Divider>
        <Button content='Tell forekomster' onClick={this.handleCountButtonClick} />
        <Divider></Divider>
      </Form>
    )
  }

}

export default Analyzer
