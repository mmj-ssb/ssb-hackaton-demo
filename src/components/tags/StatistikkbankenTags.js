import React from 'react'
import axios from 'axios'
import { Button } from 'semantic-ui-react'

class StatistikkbankenTags extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      datasetList: {}
    }
  }

  componentDidMount () {
    axios.get('http://data.ssb.no/api/v0/dataset/list.json?lang=no').then(response => {
      this.setState({datasetList: response.data, ready: true})
    }).catch(error => {
      console.log(error)
    })
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  render () {
    const {ready} = this.state

    return(
      <div>
        {ready && <div>Klart</div>}

        <Button color='pink' content='Sjekk state' onClick={this.handleCheckState} />
      </div>
    )
  }
}

export default StatistikkbankenTags
