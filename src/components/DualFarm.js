import React, { Component } from 'react';
import ContractInfo from "../ABI/Token.json";
import TutorialToken from "../contracts/ChangZakSo.json";
import Web3 from "web3";
import PoolInstance from "../contracts/TokenRewardPool.json";

import {CopyToClipboard} from 'react-copy-to-clipboard';
import title_logo from "../asset/logo2.png"
export class DualFarm extends Component {
  static displayName = DualFarm.name;
  state = { reaminRewardPer : 0, web3: null, accounts: null, 
    contract: null , poolContract: null, rewardRate : 0,  text: "Connect Wallet", copied: false};

  constructor(props) {
    super(props);
    this.MoveFarmToken = this.MoveFarmToken.bind(this);
    this.MoveFarmUniswapToken = this.MoveFarmUniswapToken.bind(this);
  }

  componentDidMount() {
    this.setState(this.loadWeb3);
  }
  
  MoveFarmToken() {
    let path = "FarmToken"; 
    this.props.history.push(path);
  }

  MoveFarmUniswapToken() {
    let path = "FarmUniswap"; 
    this.props.history.push(path);
  }

  onCopy = async () => {
    this.setState({copied: true});
    alert("Copied Contract Address!!");
  };

  async loadWeb3(){ 
    if (window.ethereum) {

        const web3 = new Web3(window.ethereum);
        // Request account access if needed
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();

      if(ContractInfo.TestNum === 0){
        // TestNet
        const instance = new web3.eth.Contract(
          TutorialToken.abi, ContractInfo.TestNet.TokenContract);
        const pool = new web3.eth.Contract(
            PoolInstance.abi, ContractInfo.TestNet.PoolContract);
  
          this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runContractInfo);
      }else if(ContractInfo.TestNum === 1){
        //Kovan
        const instance = new web3.eth.Contract(
        ContractInfo.Kovan.ABI, ContractInfo.Kovan.TokenContract);
        const pool = new web3.eth.Contract(
          ContractInfo.Kovan.PoolABI, ContractInfo.Kovan.PoolContract);

        this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runContractInfo);
      }
      else{
        //MainNet
        const instance = new web3.eth.Contract(
        ContractInfo.Main.ABI, ContractInfo.Main.TokenContract);

        const pool = new web3.eth.Contract(
          ContractInfo.Main.PoolABI, ContractInfo.Main.PoolContract);

        this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runContractInfo);
      }
    }   
  }

  async runContractInfo() {
    const { accounts, poolContract} = this.state;

    var beginReward = await poolContract.methods.beginRewardAmount().call(); 
    var remainReward = await poolContract.methods.remainRewardAmount().call(); 
    console.log("beginReward : "+beginReward );
    console.log("remainReward : "+remainReward );

    var _reaminRewardPer = Math.floor(100 - ((remainReward / beginReward) * 100));
    var _rewardRate = await poolContract.methods.ratePool().call(); 

    this.setState({
      text: accounts[0],
      rewardRate : _rewardRate,
      reaminRewardPer : _reaminRewardPer
    });
}

render() {
    return (
      <div className="container">  
        <br/>    
        <h2>Select a farm</h2>
        <h4>Earn {ContractInfo.Name} tokens by providing liquidity</h4> 
        <br/>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <div className="border border-light text-center p-5">              
              <img alt="" src={title_logo}></img>
              <br/><br/><br/>
              <h3>{ContractInfo.Symbol} Farm</h3> <br/>
              <p>Deposit {ContractInfo.Symbol}</p>
              <p>Earn {ContractInfo.Symbol}</p>
              <br/>
              <p className="text-danger">{this.state.rewardRate}% APY</p>
              <p>{this.state.reaminRewardPer}% of Rewards</p>
              {/* <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p> */}
              
              <button className="btn btn-warning" onClick={this.MoveFarmToken}>Select</button>
            </div>           
          </div>
          <div className="col-md-4">
            <div className="border border-light text-center p-5">              
              <img alt="" src={title_logo}></img>
              <br/><br/><h5 className="text-warning">UNISWAP</h5>
              <h4>{ContractInfo.LPTokenName} Farm</h4> <br/>
              <p>Deposit {ContractInfo.LPTokenName}</p>
              <p>Earn {ContractInfo.Symbol}</p>
              <br/>
              <p className="text-danger">{this.state.rewardRate}% APY</p>
              <p>{this.state.reaminRewardPer}% of Rewards</p>
              {/* <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p> */}
              <button className="btn btn-warning" onClick={this.MoveFarmUniswapToken}>Select</button>
             
            </div>           
          </div>           
          <div className="col-md-2"></div>
        </div>
        <br/><br/>
        <CopyToClipboard onCopy={this.onCopy} text={ContractInfo.Main.TokenContract}>
        <p className="text-truncate">{ContractInfo.Name} : <span>{ContractInfo.Main.TokenContract}</span></p>
        </CopyToClipboard>
      </div>
    );
  }
}
