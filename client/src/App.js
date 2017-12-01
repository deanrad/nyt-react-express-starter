import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const ShowScraped = (props) => {
  return (<div>TODO Scraped stuff goes here
    <Link to="/scrape">Do a scrape</Link>
     </div>)
}

const DoScrape = () => {
  return (<div>
    <Link to="/">Go Home!</Link>
    <button>Scrape it!</button>
    </div>)
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
    const authUrl = document.location.href.includes("localhost")
    ? "//localhost:3001/auth/google"
    : "/auth/google";

    return (
      <div className="App">
      <h3><a href={authUrl}>Login WIth Google</a></h3>
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
