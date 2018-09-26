import React from 'react'
import axios from 'axios'
import { Button, Divider, Input, Segment, Step, Icon } from 'semantic-ui-react'
import Article from '../components/artikkel/Article'
let Diffbot = require('diffbot').Diffbot
let diffBot = new Diffbot('12774256cd58c887d773094050451db8')

class Memphisto extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      readyArticle: false,
      articleUrl: '',
      article: {},
      readyCountArray: false,
      textArray: [],
      countArray: [],
      matches: {},
      bestMatch: '',
      isArticlePage: true,
      isTablePage: false,
      isStatsPage: false
    }

    this.enableArticlePage  = this.enableArticlePage.bind(this);
    this.enableTablePage  = this.enableTablePage.bind(this);
    this.enableStatsPage  = this.enableStatsPage.bind(this);
  }

  enableArticlePage() {
    this.setState({
      isArticlePage : true,
      isTablePage: false,
      isStatsPage: false
    });
  }

  enableTablePage() {
    this.setState({
      isArticlePage : false,
      isTablePage: true,
      isStatsPage: false
    });
  }

  enableStatsPage() {
    this.setState({
      isArticlePage : false,
      isTablePage: false,
      isStatsPage: true
    });
  }

  upperCaseFirst = (string) => {
    return string.toString().charAt(0).toUpperCase() + string.slice(1)
  }

  handleInputChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleMemphisto = () => {
    console.log("Inside Memphisto!!!!")
    diffBot.article({uri: this.state.articleUrl}, (error, response) => {
      this.setState({
        article: response.objects[0],
        readyArticle: true
      }, () => {
        const array = this.state.article.text.split(' ')
        const trimmedArray = []

        array.forEach(function(word) {
          let pattern = /([^[a-zA-Z-æøåÆØÅ])+/ig
          word = word.replace(pattern, '').toLowerCase()
          trimmedArray.push(word)
        })

        this.setState({textArray: trimmedArray}, () => {
          const textArray = this.state.textArray
          const countArray = []

          textArray.forEach(function(x) {
            countArray[x] = (countArray[x] || 0) + 1
          })

          this.setState({
            countArray: countArray,
            readyCountArray: true
          }, () => {
            for(let i = 0, l = tables.length; i < l; i++) {
              const url = apiUrl + tables[i]
              const stateName = tables[i] + 'Variables'

              axios.get(url).then(response => {
                this.setState({
                  [stateName]: response.data.variables
                }, () => {
                  const majorVariables = []
                  const minorVariables = []
                  const ready = 'ready' + this.upperCaseFirst(stateName)
                  const stateMajorVariables = 'majorVariables' + tables[i]
                  const stateMinorVariables = 'minorVariables' + tables[i]

                  for(let ii = 0, ll = this.state[stateName].length; ii < ll; ii++) {
                    const text = this.state[stateName][ii].text

                    majorVariables.push(text.toLowerCase())

                    for(let iii = 0, lll = this.state[stateName][ii].valueTexts.length; iii < lll; iii++) {
                      const valueText = this.state[stateName][ii].valueTexts[iii]

                      minorVariables.push(valueText.toLowerCase())
                    }
                  }

                  this.setState({
                    [ready]: true,
                    [stateMajorVariables]: majorVariables,
                    [stateMinorVariables]: minorVariables
                  }, () => {
                    const stateMatches = 'matches' + tables[i]
                    let matches = 0

                    Object.keys(this.state.countArray).forEach(key => {
                      for(let imv = 0, lmv = this.state[stateMajorVariables].length; imv < lmv; imv++) {
                        if(key === this.state[stateMajorVariables][imv]){
                          matches++

                          console.log('Fant match (majorVariable): \'' + key + '\' i tabell ' + tables[i])
                        }
                      }

                      for(let inv = 0, lnv = this.state[stateMinorVariables].length; inv < lnv; inv++) {
                        if(key === this.state[stateMinorVariables][inv]){
                          matches++

                          console.log('Fant match (minorVariable): \'' + key + '\' i tabell ' + tables[i])
                        }
                      }
                    })

                    this.setState({[stateMatches]: matches}, () => {
                      if(i === l - 1){
                        this.setState({
                          matches: {
                            ...this.state.matches,
                            [tables[i]]: matches
                          }
                        }, () => {
                          const sortedMatch = []

                          for(let tableId in this.state.matches) {
                            sortedMatch.push([tableId, this.state.matches[tableId]])
                          }

                          sortedMatch.sort((a, b) => {
                            return b[1] - a[1]
                          })

                          this.setState({bestMatch: sortedMatch[0][0]}, () => {
                            this.setState({ready: true})
                          })
                        })
                      } else {
                        this.setState({
                          matches: {
                            ...this.state.matches,
                            [tables[i]]: matches
                          }
                        })
                      }
                    })
                  })
                })
              }).catch(error => {
                console.log(error)
              })
            }
          })
        })
      })
    })
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  getArticleUrl = (url) => {
    this.setState({articleUrl: url}, () => {
      this.enableTablePage()
      this.handleMemphisto()
    });
  }

  render() {
    const {ready, readyArticle, articleUrl, bestMatch, active} = this.state
    const articlePageComp = (<Article getArticleUrl={this.getArticleUrl}></Article>);

    return (
      <Segment basic>
        <Input placeholder='Artikkel url' name='articleUrl' value={articleUrl}
               onChange={this.handleInputChange}
               action={{
                 icon: 'car',
                 color: 'teal',
                 onClick: this.handleMemphisto,
                 content: 'Kjør'
               }}
        />

        <Divider hidden />

        {readyArticle &&
        <Segment basic loading={!ready}>
          <a href={statbankUrl + bestMatch + '/'} target='_blank'>Klikk meg!</a>
        </Segment>
        }

        <Button color='pink' content='Sjekk state' onClick={this.handleCheckState} />
        <Step.Group size='large' widths={3}>
          <Step
            active={active === 'Article'}
            icon='file alternate'
            link
            onClick={this.enableArticlePage}
            title='Article'
            description='Choose Article'
          />
          <Step
            active={active === 'Table'}
            icon='table'
            link
            onClick={this.enableTablePage}
            title='Table'
            description='Select table layout'
          />
          <Step
            active={active === 'Statistics'}
            icon='numbered list'
            link
            onClick={this.enableStatsPage}
            title='Statistics'
            description='View Statistics'
          />
        </Step.Group>
        <div>
          { this.state.isArticlePage ? articlePageComp : null }
        </div>
      </Segment>
    )
  }
}

export default Memphisto

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

const statbankUrl = 'https://www.ssb.no/statbank/table/'

const tables = [
  '05678',
  '08402',
  '07459',
  '11418',
  '10501',
  '03013',
  '11555',
  '03024',
  '11642',
  '12359'
]