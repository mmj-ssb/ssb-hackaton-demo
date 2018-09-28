import React from 'react'
import axios from 'axios'
import Article from '../components/artikkel/Article'
import TableResult from './TableResult'
import {Button, Input, Segment, Step, TextArea, Form, Divider, Grid, Image, Container} from 'semantic-ui-react';
import StatisticsResult from "./StatisticsResult";
import ssb_logo from '../logos/OTT-logo.png';

let Diffbot = require('diffbot').Diffbot
let diffBot = new Diffbot('12774256cd58c887d773094050451db8')

class Memphisto extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rootReady: false,
      ready: false,
      readyArticle: false,
      articleUrl: '',
      article: {},
      readyCountArray: false,
      textArray: [],
      countArray: [],
      matches: {},
      matchedWords: [],
      textBox: '',
      noMatches: false,
      readyRelevantStuff: true,
      relevantStuff: {},
      subject: '',
      subSubject: {},
      subjects: [],
      subjectString: '',
      factPageGuess: '',
      bestMatch: '',
      isArticlePage: true,
      isTablePage: false,
      isStatsPage: false
    }

    this.enableArticlePage = this.enableArticlePage.bind(this);
    this.enableTablePage = this.enableTablePage.bind(this);
    this.enableStatsPage = this.enableStatsPage.bind(this);
  }

  enableArticlePage() {
    this.setState({
      isArticlePage: true,
      isTablePage: false,
      isStatsPage: false,
    });
  }

  enableTablePage() {
    this.setState({
      isArticlePage: false,
      isTablePage: true,
      isStatsPage: false,
      active: true
    });
  }

  enableStatsPage() {
    this.setState({
      isArticlePage: false,
      isTablePage: false,
      isStatsPage: true,
      active: true
    });
  }

  componentDidMount() {
    axios.get(apiUrl).then(response => {
      this.setState({tables: response.data}, () => {
        this.setState({rootReady: true})
      })
    })
  }

  upperCaseFirst = (string) => {
    return string.toString().charAt(0).toUpperCase() + string.slice(1)
  }

  handleInputChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleMemphisto = (text) => {
    const array = text.split(' ')
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
                const matchedWords = this.state.matchedWords.slice()
                let matches = 0

                Object.keys(this.state.countArray).forEach(key => {
                  for(let imv = 0, lmv = this.state[stateMajorVariables].length; imv < lmv; imv++) {
                    if(key === this.state[stateMajorVariables][imv]){
                      matches++

                      matchedWords.push(key)

                      console.log('Fant match (majorVariable): \'' + key + '\' i tabell ' + tables[i])
                    }
                  }

                  for(let inv = 0, lnv = this.state[stateMinorVariables].length; inv < lnv; inv++) {
                    if(key === this.state[stateMinorVariables][inv]){
                      matches++

                      matchedWords.push(key)

                      console.log('Fant match (minorVariable): \'' + key + '\' i tabell ' + tables[i])
                    }
                  }
                })

                this.setState({
                  [stateMatches]: matches,
                  matchedWords: matchedWords
                }, () => {
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
                      if(sortedMatch[0][1] === 0){
                        this.setState({
                          noMatches: true,
                          readyRelevantStuff: true,
                          ready: true
                        })
                      } else {
                        this.setState({bestMatch: sortedMatch[0][0]}, () => {
                          this.setState({ready: true}, () => {
                            const url = apiUrl + '?query=' + this.state.bestMatch

                            axios.get(url).then(response => {
                              const path = response.data[0].path.split('/')
                              // const table = path[3]
                              const subSubject = path[2]
                              const subject = path[1]

                              this.setState({
                                relevantStuff: response.data,
                              }, () => {
                                const subjectUrl = apiUrl + '/' + subject + '/'
                                const subSubjectUrl = subjectUrl + subSubject + '/'

                                axios.get(subSubjectUrl).then(response => {
                                  this.setState({subSubject: response.data[0]}, () => {
                                    axios.get(subjectUrl).then(response => {
                                      this.setState({subjects: response.data}, () => {
                                        let string = ''
                                        let guess = ''

                                        for(let i = 0, l = this.state.tables.length; i < l; i++) {
                                          if(subject === this.state.tables[i].id){
                                            string = this.state.tables[i].text
                                          }
                                        }

                                        let tableSubject = string

                                        string = string.toLowerCase()
                                        string = string.replace(new RegExp('æ', 'g'), 'ae')
                                        string = string.replace(new RegExp('ø', 'g'), 'o')
                                        string = string.replace(new RegExp('å', 'g'), 'aa')
                                        string = string.replace(/\s/g, '-')

                                        for(let i = 0, l = this.state.matchedWords.length; i < l; i++) {
                                          for(let ii = 0, ll = factPages.length; ii < ll; ii++) {
                                            if(this.state.matchedWords[i].match(factPages[ii])){
                                              guess = factPageUrls[ii]

                                              console.log('Fant match til faktaside')
                                            }
                                          }
                                        }

                                        this.setState({
                                          subjectString: string,
                                          factPageGuess: guess,
                                          subject: tableSubject
                                        }, () => {
                                          this.setState({readyRelevantStuff: true})
                                        })
                                      })
                                    }).catch(error => {
                                      console.log(error)
                                    })
                                  })
                                }).catch(error => {
                                  console.log(error)
                                })
                              })
                            }).catch(error => {
                              console.log(error)
                            })
                          })
                        })
                      }
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
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  getArticleUrlFromTable = (url) => {
    this.setState({articleUrl: url}, () => {
      this.state.readyRelevantStuff = false
      this.enableTablePage()
      diffBot.article({uri: url}, (error, response) => {
        console.log("Response from DiffBot : ", response)
        if(response !== undefined)
          this.handleMemphisto(response.objects[0].text)
      })
    });
  }

  getArticleUrlFromTextBox = () => {
    this.setState({articleUrl: this.state.articleUrl}, () => {
      this.state.readyRelevantStuff = false
      this.enableTablePage()
      diffBot.article({uri: this.state.articleUrl}, (error, response) => {
        console.log("Response from DiffBot : ", response)
        if(response !== undefined)
          this.handleMemphisto(response.objects[0].text)
      })
    });
  }


  fromTextBox = () => {
    this.enableTablePage()
    this.handleMemphisto(this.state.textBox)
  }


  render() {
    const {rootReady, articleUrl, bestMatch, readyRelevantStuff, relevantStuff, isArticlePage, isStatsPage, isTablePage
    } = this.state
    console.log(this.state.matches)
    const articlePageComp = (<Article getArticleUrl={this.getArticleUrlFromTable}
                                      getSearchText={this.getSearchText}
                                      rootReady={this.state.rootReady} />);
    const tableResultPageComp = (<TableResult bestMatch={bestMatch}
                                              table={statbankUrl + bestMatch + '/'}
                                              subjects={this.state.subjects}
                                              subSubject={this.state.subSubject}
                                              factPageGuess={this.state.factPageGuess}
                                              relevant={relevantStuff} />)
    const statisticsResultPageComp = (<StatisticsResult subject={this.state.subject}
                                                        subjects={this.state.subjects}
                                                        subSubject={this.state.subSubject}
                                                        factPageGuess={this.state.factPageGuess}
                                                        relevant={relevantStuff} />)

    return (
      <Segment basic>
        <Step.Group size='large' widths={3}>
          <Step
            active={isArticlePage}
            icon='file alternate'
            link
            onClick={this.enableArticlePage}
            title='Tekst'
            description='Velg artikkel/tekst'
          />
          <Step
            active={isTablePage}
            icon='table'
            link
            onClick={this.enableTablePage}
            title='Tabell'
            description='Statistisk tabell'
          />
          <Step
            active={isStatsPage}
            icon='numbered list'
            link
            onClick={this.enableStatsPage}
            title='Statistikk'
            description='Statistiske emner'
          />
        </Step.Group>
        <Form hidden={this.state.isTablePage || this.state.isStatsPage}>
          <Divider horizontal>Artikkel</Divider>
          <Form.Field>
            <Input placeholder='Artikkel url' name='articleUrl' value={articleUrl}
                   onChange={this.handleInputChange} disabled={!rootReady}
                   action={{
                     icon: 'car',
                     color: 'teal',
                     onClick: this.getArticleUrlFromTextBox,
                     content: 'Kjør artikkel'
                   }}
            />
          </Form.Field>
          <Divider hidden />
          <Divider hidden />
          <Divider horizontal>Fritekst</Divider>
          <Form.Field>
            <TextArea placeholder='Lim inn tekst' name='textBox' value={this.state.textBox}
                      onChange={this.handleInputChange} readOnly={!rootReady} autoHeight />

            <Button color='teal' icon='car' content='Kjør tekst' onClick={this.fromTextBox} />

          </Form.Field>
          {/*<Button color='teal' icon='car' content='chk' onClick={this.handleCheckState} />*/}

          <Divider horizontal>Artikkelliste</Divider>
        </Form>
        <Segment loading={!readyRelevantStuff}>
          {this.state.isArticlePage ? articlePageComp : null}
          {this.state.isTablePage ? tableResultPageComp : null}
          {this.state.isStatsPage ? statisticsResultPageComp : null}
        </Segment>
      </Segment>
    )
  }
}

export default Memphisto

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

const statbankUrl = 'https://www.ssb.no/statbank/table/'

const statbankListUrl = 'https://www.ssb.no/statbank/list/'

const ssbUrl = 'https://www.ssb.no/'

const tables = [
  '05678',
  '08402',
  '07459',
  '11418',
  /*'09817',*/
  '03013',
  '11555',
  '03024',
  '11642',
  '12359'
]

const factPages = [
  'befolkningen',
  'likestilling',
  'innvandring',
  'bolig',
  'arbeid',
  'helse',
  'bil-og-transport',
  'utdanning',
  'norsk-okonomi',
  'internett-og-mobil',
  'norsk-naeringsliv',
  'jakt',
  'fiske',
  'religion',
  'stortingsvalg',
  'slik-brukes-skattepengene'
]

const factPageUrls = [
  'https://www.ssb.no/befolkning/faktaside/befolkningen',
  'https://www.ssb.no/befolkning/faktaside/likestilling',
  'https://www.ssb.no/innvandring-og-innvandrere/faktaside/innvandring',
  'https://www.ssb.no/bygg-bolig-og-eiendom/faktaside/bolig',
  'https://www.ssb.no/arbeid-og-lonn/faktaside/arbeid',
  'https://www.ssb.no/helse/faktaside/helse',
  'https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport',
  'https://www.ssb.no/utdanning/faktaside/utdanning',
  'https://www.ssb.no/nasjonalregnskap-og-konjunkturer/faktaside/norsk-okonomi',
  'https://www.ssb.no/teknologi-og-innovasjon/faktaside/internett-og-mobil',
  'https://www.ssb.no/nasjonalregnskap-og-konjunkturer/faktaside/norsk-naeringsliv',
  'https://www.ssb.no/jord-skog-jakt-og-fiskeri/faktaside/jakt',
  'https://www.ssb.no/jord-skog-jakt-og-fiskeri/faktaside/fiske',
  'https://www.ssb.no/kultur-og-fritid/faktaside/religion',
  'https://www.ssb.no/valg/faktaside/stortingsvalg',
  'https://www.ssb.no/offentlig-sektor/faktaside/slik-brukes-skattepengene'
]