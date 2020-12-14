import React, { Component } from 'react';
import ContractInfo from "../ABI/Token.json";
import TutorialToken from "../contracts/ChangZakSo.json";
import Web3 from "web3";
import PoolInstance from "../contracts/TokenRewardPool.json";

import {CopyToClipboard} from 'react-copy-to-clipboard';
import title_logo from "../asset/logo2.png";

import '../asset/css/fri.css';
import leaf from "../asset/images/resources/leaf.png"

export class Farm extends Component {
  static displayName = Farm.name;
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
      <div>
        <section className="service_four service_page">
        <div className="container">
            {/* <div className="service_four_top"></div> */}
            <div className="block-title text-center">
                <p>Select a farm</p>
                <h3>{ContractInfo.NickName} Farm</h3>
                <div className="leaf">
                    <img src={leaf} alt=""/>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-4 col-lg-4">
                    
                </div>
                <div className="col-xl-4 col-lg-4">
                    <div className="service_four_single wow fadeInLeft" data-wow-delay="600ms">
                        <div className="service_four_icon">
                            {/* <span className="icon-harvest"></span> */}
                            <img alt="" src={title_logo}  onClick={this.MoveFarmToken}></img>
                        </div>
                        <br/>
                        <div className="service_four_deatils">
                            <h3><a href="#" className="service_four_title">Deposit {ContractInfo.Symbol}</a>
                            </h3>
                            <h3><a href="#" className="service_four_title">Earn {ContractInfo.Symbol}</a>
                            </h3>
                            {ContractInfo.Name} Tokens by providing liquidity.
                              <br/> <br/>
                              <h3><a href="#" className="service_four_API">{this.state.rewardRate}% APY</a></h3>
                            <h3><a href="#" className="service_four_title">{this.state.reaminRewardPer}% of Rewards</a>
                            </h3><br/>
                              <button className="thm-btn" onClick={this.MoveFarmToken}>Select</button>
                              <br/>
                            <br/>
                        </div>                        
                    </div>
                </div>
                <div className="col-xl-4 col-lg-4">
                    
                </div>
            </div>
            <br/>
            <div className="row">
              <div className="col-xl-3 col-lg-3">
                    
              </div>
              <div className="col-xl-6 col-lg-6">

              <CopyToClipboard onCopy={this.onCopy} text={ContractInfo.Main.TokenContract}>
                <p className="text-truncate text-center">{ContractInfo.Symbol} Token : <span>{ContractInfo.Main.TokenContract}</span></p>
              </CopyToClipboard> 
              </div>
              <div className="col-xl-3 col-lg-3">              
              </div>         
            </div>
        </div>
        </section>
      </div>
    );
  }
}
