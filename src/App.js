import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Canzoni from "./Canzoni";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Canzoni} />
        </Switch>
      </Router>
    );
  }
}

export default App;
