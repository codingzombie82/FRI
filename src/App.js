import React, { Component } from "react";
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
// import { FetchData } from './components/FetchData';
// import { Counter } from './components/Counter';
import { DualFarm  } from './components/DualFarm';
import { Farm } from './components/Farm';

import { FarmToken } from './components/FarmToken';
import { Stats } from './components/Stats';
import { DualStats } from './components/DualStats';

import { FarmUniswap } from './components/FarmUniswap';
import { AdminInfo } from './components/AdminInfo';
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./getWeb3";


import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        {/* <Route path='/counter' component={Counter} /> */}
        {/* <Route path='/fetch-data' component={FetchData} /> */}
        <Route path='/farm' component={Farm} />
        <Route path='/Stats' component={Stats} />
        <Route path='/farmToken' component={FarmToken} />
        <Route path='/farmUniswap' component={FarmUniswap} />
        <Route path='/dualFarm' component={DualFarm} />       
        <Route path='/dualstats' component={DualStats} />      
        <Route path='/AdminInfo' component={AdminInfo} />
      </Layout>
    );
  }
}

export default App;
