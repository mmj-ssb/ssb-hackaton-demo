import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Grid, Divider } from 'semantic-ui-react'

const CONST_ARTICLE_LIST = [
  {title: "Stortingspolitikerne gir seg selv 21.674 kroner ekstra i lønn",
    url:"https://www.vg.no/nyheter/innenriks/i/jqB1z/stortingspolitikerne-gir-seg-selv-21-674-kroner-ekstra-i-loenn",
    publishedOn:"Thu, 15 Jun 2017 18:17:00 GMT"
  },
  {title: "Derfor øker sivilingeniørenes lønn mer enn siviløkonomenes",
    url:"https://e24.no/jobb/derfor-oeker-sivilingenioerenes-loenn-mer-enn-siviloekonomenes/22668391",
    publishedOn:"Thu, 12 Dec 2013 00:00:00 GMT"
  },
  {title: "Kvinner vil fortsette å være lønnstapere",
    url:"https://e24.no/kommentarer/likestilling/kommentar-kvinner-vil-fortsette-aa-vaere-loennstapere/23943801",
    publishedOn:"Wed, 08 Mar 2017 00:00:00 GMT"
  },
  {title: "Sjekk om du tjener nok",
    url:"https://www.dinside.no/okonomi/sjekk-om-du-tjener-nok/69399318",
    publishedOn:"Thu, 01 Feb 2018 00:00:00 GMT"
  },
  {title: "Her er gjennomsnitts-lønnen i 300 yrker",
    url:"https://www.nettavisen.no/na24/her-er-gjennomsnitts-lnnen-i-300-yrker/3423411726.html",
    publishedOn:"Thu, 01 Feb 2018 08:20:12 GMT"
  },
  {title: "Staten henger langt etter på startlønn: Frykter lav rekruttering kan true digitaliseringsprosjekter",
    url:"https://www.tu.no/artikler/staten-henger-langt-etter-pa-startlonn-frykter-lav-rekruttering-kan-true-digitaliseringsprosjekt/414437",
    publishedOn:"Mon, 18 Dec 2017 05:18:00 GMT"
  },
  {title: "Her er Norges 200 best betalte yrker",
    url:"https://www.lofotposten.no/naringsliv/jobb/okonomi/her-er-norges-200-best-betalte-yrker/s/5-29-374976",
    publishedOn:"Wed, 25 Apr 2018 19:00:00 GMT"
  },
  {title: "Velger du utdanning etter inntekt? Her er yrkene med høyest lønn",
    url:"https://www.aftenposten.no/karriere/-Velger-du-utdanning-etter-inntekt-Her-er-yrkene-med-hoyest-lonn-11497b.html",
    publishedOn:"Thu, 1 Mar 2018 19:00:00 GMT"
  },
  {title: "Så mye tjener IT-ansatte",
    url:"https://www.digi.no/artikler/sa-mye-tjener-it-ansatte/320713",
    publishedOn:"Thu, 28 Jan 2018 19:00:00 GMT"
  },
  {title: "Dette er den nye norske lønnen",
    url:"https://www.nettavisen.no/na24/dette-er-den-nye-norske-lnnen/3423308467.html",
    publishedOn:"Thu, 28 Jan 2018 19:00:00 GMT"
  },
  {title: "Oppsiktsvekkende tall om Norges befolkning",
    url:"https://www.an.no/nyheter/norge/folketall/oppsiktsvekkende-tall-om-norges-befolkning/s/5-4-705385",
    publishedOn:"Thu, 25 Feb 2018 19:00:00 GMT"
  },
  {title: "Befolkningen i Norge mer enn doblet på 118 år, men hvor mange flere barn har det blitt?",
    url:"https://www.nettavisen.no/nyheter/befolkningen-i-norge-mer-enn-doblet-pa-118-ar-men-hvor-mange-flere-barn-har-det-blitt/3423419009.html",
    publishedOn:"Thu, 25 Feb 2018 19:00:00 GMT"
  }
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
      selectedArticle: rowInfo.original.url,
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
      Header: 'Tittel',
      accessor: 'title'
    },
      {
        Header: 'Url',
        accessor: 'url'
      },
      {
        Header: 'Utgitt',
        accessor: 'publishedOn'
      }
      ]

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
        </Grid>

      </div>

    )
  }
}

export default Article
