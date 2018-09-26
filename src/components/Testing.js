import React from 'react'
import axios from 'axios'
import { Button, Container, Divider, Header, Input, List, Segment } from 'semantic-ui-react'

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

let Diffbot = require('diffbot').Diffbot

let diffBot = new Diffbot('12774256cd58c887d773094050451db8');

class Testing extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      readyVariables: false,
      errorVariables: '',
      table: '',
      tableTitle: '',
      variables: [],
      variablesMajor: [],
      variablesMinor: [],
      readyArticle: false,
      articleUrl: '',
      article: {},
      readyCountArray: false,
      textArray: [],
      countArray: [],
      foundMatches: 0
    }
  }

  upperCaseFirst = (string) => {
    return string.toString().charAt(0).toUpperCase() + string.slice(1)
  }

  handleInputChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleExtractVariables = () => {
    if (this.state.table.length === 5) {
      const url = apiUrl + this.state.table

      axios.get(url).then(response => {
        this.setState({
          variables: response.data.variables,
          tableTitle: response.data.title
        }, () => {
          const majorVariables = []
          const minorVariables = []

          for (let i = 0, l = this.state.variables.length; i < l; i++) {
            const text = this.state.variables[i].text

            majorVariables.push(text.toLowerCase())

            for (let ii = 0, ll = this.state.variables[i].valueTexts.length; ii < ll; ii++) {
              const valueText = this.state.variables[i].valueTexts[ii]

              minorVariables.push(valueText.toLowerCase())
            }
          }

          this.setState({
            readyVariables: true,
            errorVariables: '',
            variablesMajor: majorVariables,
            variablesMinor: minorVariables
          })
        })
      }).catch(error => {
        console.log(error)

        const errorMessage = error.message + ' (sjekk console)'

        this.setState({errorVariables: errorMessage})
      })
    } else {
      this.setState({
        errorVariables: 'Godtar bare 5 siffer'
      })
    }
  }

  handleExtractArticleText = () => {
    diffBot.article({uri: this.state.articleUrl}, (error, response) => {
      this.setState({
        article: response.objects[0],
        readyArticle: true
      })
    })
  }

  handleTextSplit = () => {
    const array = this.state.article.text.split(' ')
    const trimmedArray = []

    array.forEach(function(word){
      let pattern = /([^[a-zA-Z-æøåÆØÅ]+$)+/ig
      word = word.replace(pattern, '').toLowerCase()
      trimmedArray.push(word)
    })

    this.setState({textArray: trimmedArray}, () => {
      const textArray = this.state.textArray
      const countArray = []

      textArray.forEach(function(x) { countArray[x] = (countArray[x] || 0)+1 })

      this.setState({
        countArray: countArray,
        readyCountArray: true,
        foundMatches: 0
      }, () => {
        let matches = 0

        Object.keys(this.state.countArray).forEach(key => {
          for (let i = 0, l = this.state.variablesMajor.length; i < l; i++) {
            if (key === this.state.variablesMajor[i]) {
              matches++

              console.log('Fant match: ' + key)
            }
          }

          for (let i = 0, l = this.state.variablesMinor.length; i < l; i++) {
            if (key === this.state.variablesMinor[i]) {
              matches++

              console.log('Fant match: ' + key)
            }
          }
        })

        this.setState({foundMatches: matches})
      })
    })
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  render () {
    const {readyVariables, errorVariables, table, tableTitle, variables, readyArticle, articleUrl, article} = this.state

    return (
      <Segment basic>
        <Input label='Tabellnummer' placeholder='Tabellnummer' name='table' value={table}
               onChange={this.handleInputChange}
               action={{
                 icon: 'arrow alternate circle down',
                 color: 'teal',
                 onClick: this.handleExtractVariables,
                 content: 'Hent variabler'
               }}
        />

        <Divider fitted hidden />

        {errorVariables && <span style={{color: '#db2828'}}>{errorVariables}</span>}

        <Divider hidden />

        {readyVariables &&
        <Container>
          <Header as='h4' content={tableTitle} />

          <List>
            {Object.keys(variables).map((item, index) => {
              let text = ''

              return (
                <List.Item key={index}>
                  <List.Header>{this.upperCaseFirst(variables[index].text)}</List.Header>

                  {Object.keys(variables[index].valueTexts).map((innerItem, innerIndex) => {
                    text = text + ', ' + variables[index].valueTexts[innerIndex]

                    return null
                  })}

                  {text.slice(1)}
                </List.Item>
              )
            })}
          </List>
        </Container>
        }

        <Divider hidden />

        <Input label='Artikkel' placeholder='Artikkel url' name='articleUrl' value={articleUrl}
               onChange={this.handleInputChange}
               action={{
                 icon: 'arrow alternate circle down',
                 color: 'teal',
                 onClick: this.handleExtractArticleText,
                 content: 'Hent artikkel'
               }}
        />

        <Divider hidden />

        {readyArticle &&
        <Container>
          <Header as='h4' content={article.title} />

          <Divider fitted hidden />

          {article.text}
        </Container>
        }

        <Divider hidden />

        {readyVariables && readyArticle &&
        <Button primary content='Match tabell med artikkel' onClick={this.handleTextSplit} />
        }

        <Divider hidden />

        <Button color='pink' content='Sjekk state' onClick={this.handleCheckState} />
      </Segment>
    )
  }
}

export default Testing
