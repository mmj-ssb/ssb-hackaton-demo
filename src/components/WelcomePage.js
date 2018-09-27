import React from 'react'
import { Button, Grid, Image } from 'semantic-ui-react'
import ssb_logo from '../../src/logos/ord_til_tall.png'

let centerAlign = {
  textAlign: 'center'
}

class WelcomePage extends React.Component {
  handleClick = () => {
    this.props.history.push('/Memphisto')
  }

  render () {
    return (
      <div className='ui container'>
        <Grid columns={1} centered>
          <Grid.Row verticalAlign='top'>
            <Grid.Column>
              <div className='ui container'>

              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row verticalAlign='top'>
            <Grid.Column>
              <div className='ui container'>
                <Image src={ssb_logo} size='small' onClick={this.handleClick} centered style={{cursor: 'pointer'}} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className='ui container' style={centerAlign}>
          <Button primary onClick={this.handleClick} size='huge'>Gå framover</Button>
        </div>
      </div>
    )
  }
}

export default WelcomePage