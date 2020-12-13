import React, { Component } from 'react';
import Web3 from "web3";

import TutorialToken from "../contracts/ChangZakSo.json";
import ContractInfo from "../ABI/Token.json";
export class Home extends Component {
  static displayName = Home.name;

  state = { web3: null, accounts: null, contract: null , text: "Connect Wallet"};

  constructor(props) {
    super(props);
    this.WalletConnectClick = this.WalletConnectClick.bind(this);
  }

  componentDidMount() {
    this.setState(this.loadWeb3);
  }
  
  WalletConnectClick() {//= async () => {
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.runContractConnect();
    }
  }

  async loadWeb3() {
      console.log("loadWeb3");

      if (window.ethereum) {
        console.log("loadWeb3 aaa");
      }else if (window.web3) {
        console.log("loadWeb3 bbb");
      }else{
        console.log("loadWeb3 ccc");
      }

      if (window.ethereum) {
          console.log("loadWeb3 1");
          const web3 = new Web3(window.ethereum);
          // Request account access if needed
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();

          if(ContractInfo.TestNum === 0){
              // TestNet
            const instance = new web3.eth.Contract(
              TutorialToken.abi, ContractInfo.TestNet.TokenContract);
            this.setState({web3, accounts, contract: instance }, this.runContractConnect);
          }else if(ContractInfo.TestNum === 1){
            //Kovan
            const instance = new web3.eth.Contract(
            ContractInfo.Kovan.ABI, ContractInfo.Kovan.TokenContract);
            this.setState({web3, accounts, contract: instance }, this.runContractConnect);
          }else{
            //MainNet
            const instance = new web3.eth.Contract(
            ContractInfo.Main.ABI, ContractInfo.Main.TokenContract);
            this.setState({web3, accounts, contract: instance }, this.runContractConnect);
          }
      }   
  }


  runContractConnect = async () => {
      const { accounts } = this.state;
      if(accounts){
        this.setState({ text: accounts[0] });
      }
  }


  render () {
    return (
        <div className="container">
          <div className="vcenter">
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-8">
                  <h1 className="cover-heading">{ContractInfo.SiteHomeTitle}</h1>
                  <p className="lead">{ContractInfo.SiteHomeTitle}{ContractInfo.SiteHomeTitle}{ContractInfo.SiteHomeTitle}
                  {ContractInfo.SiteHomeTitle}{ContractInfo.SiteHomeTitle}{ContractInfo.SiteHomeTitle}</p>
                  <br/>
                  <p>
                    <button  className="btn btn-warning" onClick={() => this.WalletConnectClick()}>                      
                      {this.state.text}
                    </button>
                  </p>            
              </div>
              <div className="col-md-2"></div>
            </div>
          </div>
        </div>
    );
  }
}
