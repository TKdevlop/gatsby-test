import React, { Component } from "react";
import ChannelTable from "./ChannelTable";

import Appbar from "./Appbar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Appbar />
        <ChannelTable />
      </div>
    );
  }
}

export default App;
