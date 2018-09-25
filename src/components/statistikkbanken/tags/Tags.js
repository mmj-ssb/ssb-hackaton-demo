import React from 'react'
import axios from 'axios'
import { Button, Segment } from 'semantic-ui-react'

class Tags extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      datasetList: {}
    }
  }

  componentDidMount () {
    axios.get('http://data.ssb.no/api/v0/dataset/list.json?lang=no').then(response => {
      this.setState({
        datasetList: response.data,
        ready: true
      })
    }).catch(error => {
      console.log(error)
    })
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  render () {
    const {ready} = this.state

    return (
      <Segment basic>
        <Button disabled={!ready} color='pink' content='Sjekk state' onClick={this.handleCheckState} />
      </Segment>
    )
  }
}

export default Tags
