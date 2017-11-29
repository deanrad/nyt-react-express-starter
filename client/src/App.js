import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const ShowScraped = (props) => {
  return (<div>TODO Scraped stuff goes here </div>)
}

const DoScrape = () => {
  return (<button>Scrape it!</button>)
}

class App extends Component {
  componentDidMount() {
    axios.get('/api/saved').then(response => {
      console.log(response.data)
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Scraper Homework Spike</h2>
        </div>

        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={ShowScraped} />
              <Route exact path="/scrape" component={DoScrape} />
            </Switch>
          </div>
        </Router>

      </div>
    );
  }
}

export default App;
