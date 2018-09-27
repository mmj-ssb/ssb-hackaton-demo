import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

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
  "https://www.nettavisen.no/na24/dette-er-den-nye-norske-lnnen/3423308467.html"
]

class Article extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: '',
      selectedArticle: '',
      loading: false,
      articleOpen: false
    }

    this.getStatisticsTable = this.getStatisticsTable.bind(this)
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
    /*this.showArticle(true)*/
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

  getStatisticsTable()
  {
    this.props.getArticleUrl(this.state.selectedArticle)
  }

  render() {
   const articles = this.state.articles[0]

    const columns = [{
      Header: 'Article Link',
      accessor: ''
    }]

    return (
      <div>
        <ReactTable
          data={articles}
          columns={columns}
          noDataText='No data!'
          filterable
          defaultPageSize={10}
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
       {/* <Divider horizontal>Article Content</Divider>
        <Segment loading={loading}><a>{this.state.selectedArticle}</a>
        </Segment>
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content="Get Table(s)"
          onClick={this.getStatisticsTable}
        />*/}
        {/* <ArticleModal open={this.state.articleOpen}
                      selectedArticle={this.state.selectedArticle}
                      getStatistics={this.getStatisticsTable}/>*/}
      </div>

    )
  }
}

export default Article
