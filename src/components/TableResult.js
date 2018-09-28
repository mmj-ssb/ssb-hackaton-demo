import React from 'react'
import { Segment } from 'semantic-ui-react'

class TableResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {bestMatch, table, relevant} = this.props

    if (bestMatch){
      console.log("Result table: ", table)
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