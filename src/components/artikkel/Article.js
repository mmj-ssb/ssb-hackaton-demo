import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Button, Grid, Image, Divider, Input, Segment, Form, TextArea } from 'semantic-ui-react'

const CONST_ARTICLE_LIST = [
  "https://www.vg.no/nyheter/innenriks/i/jqB1z/stortingspolitikerne-gir-seg-selv-21-674-kroner-ekstra-i-loenn",
  "https://e24.no/jobb/derfor-oeker-sivilingenioerenes-loenn-mer-enn-siviloekonomenes/22668391",
  "https://e24.no/kommentarer/likestilling/kommentar-kvinner-vil-fortsette-aa-vaere-loennstapere/23943801",
  "https://www.dinside.no/okonomi/sjekk-om-du-tjener-nok/69399318",
  "https://www.nettavisen.no/na24/her-er-gjennomsnitts-lnnen-i-300-yrker/3423411726.html",
  "https://www.tu.no/artikler/staten-henger-langt-etter-pa-startlonn-frykter-lav-rekruttering-kan-true-digitaliseringsprosjekt/414437",
  "https://www.lofotposten.no/naringsliv/jobb/okonomi/her-er-norges-200-best-betalte-yrker/s/5-29-374976",
  "https://www.aftenposten.no/karriere/-Velger-du-utdanning-etter-inntekt-Her-er-yrkene-med-hoyest-lonn-11497b.html",
  "https://www.digi.no/artikler/sa-mye-tjener-it-ansatte/320713",
  "https://www.nettavisen.no/na24/dette-er-den-nye-norske-lnnen/3423308467.html",
  "https://www.an.no/nyheter/norge/folketall/oppsiktsvekkende-tall-om-norges-befolkning/s/5-4-705385",
  "https://www.nettavisen.no/nyheter/befolkningen-i-norge-mer-enn-doblet-pa-118-ar-men-hvor-mange-flere-barn-har-det-blitt/3423419009.html",
  "https://www.nrk.no/sognogfjordane/svakaste-veksten-pa-13-ar-_-mindre-innvandring-og-faerre-fodslar-1.13930811",
  "https://kommunal-rapport.no/okonomi/2018/02/199-kommuner-mister-innbyggere",
  "https://www.aftenposten.no/osloby/i/xnrwn/Den-kraftige-befolkningsveksten-i-Oslo-har-stanset-opp",
  "https://www.aftenposten.no/familieogoppvekst/Navnestatistikk-Dette-er-de-mest-populare-navnene-na-11523b.html",
  "https://www.ba.no/2017-navnene/politikk/oslo/njastad-skremmende-at-muhammed-er-mest-populart-i-oslo/s/5-8-729955",
  "https://www.aftenbladet.no/familieogoppvekst/Pa-jakt-etter-et-sjeldent-navn-11568b.html",
  "https://www.nrk.no/kultur/historiske-navn-som-edevart_-bolette-og-bredine-lever-videre-i-_det-skjulte_-1.14009427",
  "https://www.abcnyheter.no/helse-og-livsstil/livet/2017/11/17/195347712/dette-jentenavnet-er-verdens-mest-populaere",
  "https://www.aftenbladet.no/familieogoppvekst/Noen-navn-klarer-ikke-foreldre-la-vare-a-bruke-selv-om-det-er-pa-topplistene-William-kan-vare-et-slikt-et-9768b.html",
  "https://www.dagbladet.no/kultur/skam-navn-topper-navnelista/66901476",
  "https://www.aftenposten.no/osloby/i/2OQKr/Se-hvilke-barnenavn-som-er-mest-populare-i-din-bydel"
]

class Article extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: '',
      selectedArticle: '',
      loading: false,
      articleOpen: false,
      articleUrl: '',
      textBox: ''
    }

    this.getStatisticsTable = this.getStatisticsTable.bind(this)
  }

  handleInputChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSearch = () => {
    this.setState({
      selectedArticle: this.state.articleUrl,
      loading: false
    }, () => {
      this.props.getArticleUrl(this.state.selectedArticle)
    })
  }

  fromTextBox = () => {
    this.props.getSearchText(this.state.textBox)
  }

  showArticle = () => {
    this.setState({articleOpen: true})
  }

  closeArticle = () => {
    this.setState({open: false})
  }

  componentWillMount() {
    this.setState(prevState => ({
      articles: [...prevState.articles, CONST_ARTICLE_LIST],
    }))
  }

  selectArticle(e, state, column, rowInfo, instance) {
    this.setState({
      loading: true
    })

    this.setState({
      selectedArticle: rowInfo.original,
      loading: false
    }, () => {
      this.props.getArticleUrl(this.state.selectedArticle)
    })
  }

  getStatisticsTable() {
    this.props.getArticleUrl(this.state.selectedArticle)
  }

  render() {
    const articles = this.state.articles[0]
    const {articleUrl} = this.state
    const {rootReady} = this.props
    const columns = [{
      Header: 'Article Link',
      accessor: ''
    },
      {
        Header: 'Article Url',
        Cell: row => (
          <div
            style={{}}
          >
            <div
              style={{
                borderRadius: '2px'
              }}
            />
          </div>
        )
      }]

    return (
      <div>
        <Grid columns='one' divided>
          <Grid.Row>
            <Grid.Column>
              <ReactTable
                data={articles}
                columns={columns}
                noDataText='No data!'
                filterable
                defaultPageSize={30}
                previousText='Forrige'
                nextText='Neste'
                loadingText='Laster...'
                pageText='Side '
                ofText='av'
                rowsText='rader'
                className='-striped -highlight'
                style={{height: '400px'}}
                showPaginationTop
                showPaginationBottom
                getTdProps={(state, rowInfo, column, instance) => {
                  return {
                    style: {
                      cursor: 'pointer'
                    },
                    onClick: e => {
                      if(articles.length > 0){
                        this.selectArticle(e, state, column, rowInfo, instance)
                      }
                    }
                  }
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Divider horizontal>Or</Divider>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>Legge inn tekst</label>
                  <Input placeholder='tekst' name='articleUrl' value={articleUrl}
                         onChange={this.handleInputChange} disabled={!rootReady}
                         action={{
                           icon: 'car',
                           color: 'teal',
                           onClick: this.handleSearch,
                           content: 'Kjør'
                         }}
                  />

                  <TextArea placeholder='Lim inn tekst' name='textBox' value={this.state.textBox}
                            onChange={this.handleInputChange} readOnly={!rootReady} autoHeight />

                  <Button color='teal' icon='car' content='Kjør tekst' onClick={this.fromTextBox} />

                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>

    )
  }
}

export default Article
