import React from 'react'
import { Segment, List } from 'semantic-ui-react'

class StatisticsResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {relevant, subjects, subSubject, factPageGuess} = this.props
    let relevantStuff = relevant
    return (
      <Segment basic>
        {Object.keys(relevantStuff).map((item, index) => {
          let stuff = relevantStuff[index].path.split('/').pop()

          return (
            <List key='liste'>
              <List.Item key='relevant?'>
                <a href={ssbUrl + stuff} target='_blank'>Relevant?</a>
              </List.Item>

              <List.Item key='relatert'>
                <a href={statbankListUrl + stuff} target='_blank'>Relaterte tabeller</a>
              </List.Item>

              <List.Item key='underemne'>
                Underemne: {subSubject.text}
              </List.Item>

              <List.Item key='tilhørende emner'>
                Tilhørende emner:
                <List.List>
                  {Object.keys(subjects).map((item, index) => {
                    return (
                      <List.Item key={index}>
                        {subjects[index].text}
                      </List.Item>
                    )
                  })}
                </List.List>
              </List.Item>

              <List.Item key='faktaside'>
                <a href={factPageGuess} target='_blank'>Faktaside?</a>
                {factPageGuess === '' ? <span style={{color: '#db2828'}}> - Fant ingen dessverre...</span> :
                  <span style={{color: '#21ba45'}}> - Fant en!</span>}
              </List.Item>
            </List>
          )
        })
        }
      </Segment>
    )
  }
}

export default StatisticsResult

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

const statbankUrl = 'https://www.ssb.no/statbank/table/'

const statbankListUrl = 'https://www.ssb.no/statbank/list/'

const ssbUrl = 'https://www.ssb.no/'