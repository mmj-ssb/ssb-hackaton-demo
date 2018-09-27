import React from 'react'
import { Segment, List } from 'semantic-ui-react'

class TableResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {bestMatch, table, relevant, subjects, subSubject, factPageGuess} = this.props
    let relevantStuff = relevant
    if (bestMatch){
      return (
        <Segment basic>
          <iframe style={{width: '100%', height: 700}} src={table}></iframe>
        </Segment>
      )
    } else {
      return (
        <Segment basic>
          <iframe style={{width: '100%', height: 700}} src=""></iframe>
        </Segment>
      )
    }
  }
}

export default TableResult

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

const statbankUrl = 'https://www.ssb.no/statbank/table/'

const statbankListUrl = 'https://www.ssb.no/statbank/list/'

const ssbUrl = 'https://www.ssb.no/'