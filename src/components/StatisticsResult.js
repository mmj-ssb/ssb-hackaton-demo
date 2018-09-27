import React from 'react'
import { Segment, List, Image, Grid, Label } from 'semantic-ui-react'

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
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Segment color='green' style={{ "font-weight": 'bold'}}>
                    <a href={ssbUrl + stuff} target='_blank'>For å få relevant informasjon for artikkelen klikk
                      her</a>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Segment color='green' style={{ "font-weight": 'bold'}}>
                    <a href={statbankListUrl + stuff} target='_blank'>Relaterte tabeller</a>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Segment color='green' style={{ "font-weight": 'bold'}}>
                    Underemne: <Segment color='' style={{ "font-weight": 'normal'}}>{subSubject.text}</Segment>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Segment color='green' style={{ "font-weight": 'bold'}}>
                    Tilhørende emner:
                    <Segment color='' style={{ "font-weight": 'normal'}}>{Object.keys(subjects).map((item, index) => {
                      return (
                        <Grid>
                          <Grid.Row columns={3}>
                            <Label as='a' image>
                              {subjects[index].text}
                            </Label>
                          </Grid.Row>
                        </Grid>
                      )
                    })}</Segment>
                    </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Segment>
                    <a href={factPageGuess} target='_blank'>Faktaside?</a>
                    {factPageGuess === '' ? <span style={{color: '#db2828'}}> - Fant ingen dessverre...</span> :
                      <span style={{color: '#21ba45'}}> - Fant en!</span>}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )
        })
        }
      </Segment>
    )
  }
}

export default StatisticsResult

const statbankListUrl = 'https://www.ssb.no/statbank/list/'

const ssbUrl = 'https://www.ssb.no/'