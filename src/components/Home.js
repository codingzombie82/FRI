import React, { Component } from 'react';
import Web3 from "web3";

import TutorialToken from "../contracts/ChangZakSo.json";
import ContractInfo from "../ABI/Token.json";
import cookie from 'react-cookies';
import getPrice from "../getPrice";
import leaf from "../asset/images/resources/leaf.png";
import mainimage from "../asset/images/about/about-1-img-1.jpg";
import PoolInstance from "../contracts/TokenRewardPool.json";

export class Home extends Component {
  static displayName = Home.name;

  state = { web3: null, accounts: null, contract: null , text: "Connect Wallet",
   poolContract: null, remainPer: 0, progressStyle: '',
    isVisible : 'hidden'};

  constructor(props) {
    super(props);
    this.WalletConnectClick = this.WalletConnectClick.bind(this);
  }

  // componentDidMount() {
  //   this.setState(this.loadWeb3);
  // }
  
  componentDidMount() {
    this.setState(this.loadWeb3);
    if(!cookie.load('price')){
      this.useEffect();
    }else{
      this.setState({priceDalar : cookie.load('price')}); 
    }


  }

  useEffect = async () => {
    try {
      const value = await getPrice();
      this.setState({priceDalar : value});   
      cookie.save('price', value, {maxAge: 60});
      this.setState(this.loadWeb3);
    }catch (error) {
      console.log('useEffect e' + error);
    } 
  }

  WalletConnectClick() {//= async () => {
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.runContractConnect();
    }
  }

  async loadWeb3() {
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
  
          this.setState({web3, accounts, contract: instance , poolContract : pool, isVisible : 'visible'}, this.runContractConnect);
      }else if(ContractInfo.TestNum === 1){
        //Kovan
        const instance = new web3.eth.Contract(
        ContractInfo.Kovan.ABI, ContractInfo.Kovan.TokenContract);
        const pool = new web3.eth.Contract(
          ContractInfo.Kovan.PoolABI, ContractInfo.Kovan.PoolContract);

        this.setState({web3, accounts, contract: instance , poolContract : pool, isVisible : 'visible'}, this.runContractConnect);
      }
      else{
        //MainNet
        const instance = new web3.eth.Contract(
        ContractInfo.Main.ABI, ContractInfo.Main.TokenContract);

        const pool = new web3.eth.Contract(
          ContractInfo.Main.PoolABI, ContractInfo.Main.PoolContract);

        this.setState({web3, accounts, contract: instance , poolContract : pool, isVisible : 'visible'}, this.runContractConnect);
      }

    } 
  }


  runContractConnect = async () => {
      const { accounts , poolContract} = this.state;

      var totalStakedWei = await poolContract.methods.totalStakedAmount().call(); 
      var _totalStaked = this.state.web3.utils.fromWei(totalStakedWei, 'ether');
      
      var _beginRewardAmountWei = await poolContract.methods.beginRewardAmount().call();
      var _beginRewardAmount = this.state.web3.utils.fromWei(_beginRewardAmountWei, 'ether');

      var _remainRewardPoolWei = await poolContract.methods.remainRewardAmount().call();
      var _remainRewardPool =  this.state.web3.utils.fromWei(_remainRewardPoolWei, 'ether');

      console.log(_totalStaked);
      console.log(_beginRewardAmount);
      console.log(_remainRewardPool);

      var per = Math.floor(_remainRewardPool / _beginRewardAmount * 100);   
      this.state.filters = {width: per+'%' };

      if(accounts){
        this.setState({ text: accounts[0] , remainPer : Math.floor(per)});
      }
  }

  render () {
    return (
    <div>
        <section className="product-one">
            <div className="container">
            <div className="row">
                  <div className="col-xl-3 col-lg-3">

                  </div>
                  <div className="col-xl-6 col-lg-6 text-center">
                        <button  className="text-truncate connection-btn" onClick={() => this.WalletConnectClick()}> 
                              {this.state.text}</button>  
                    </div>
                    <div className="col-xl-3 col-lg-3">

                  </div>
                </div>
                <div className="row">

                    <div className="col-xl-6 col-lg-6">
                        <div className="growing_product">
                            <div className="block-title text-left">
                                <p>FARMING POOL</p>
                                <h3>Fri Token Farming</h3>
                                <div className="leaf">
                                    <img src={leaf} alt=""/>
                                </div>
                            </div>
                            <div className="growing_product_text">
                                <p>Stake FRI tokens to earn More FRI!!!</p>
                            </div>
                            <div className="progress-levels">
                                <div className="progress-box">
                                    <div className="inner count-box">
                                        <div className="text">Begin Mining Amount</div>                                        
                                        <div className="amount">{ContractInfo.beginMiningCount} FRI</div>
                                    </div>
                                </div>
                                <div className="progress-box" id="RemainShow" style={{visibility : this.state.isVisible}}>
                                    <div className="inner count-box">
                                        <div className="text">Total Remain Amount</div>
                                        <div className="bar">
                                            <div className="bar-innner">
                                                <div className="skill-percent">
                                                    <span className="count-text" data-speed="3000" data-stop="98">{this.state.remainPer}</span>
                                                    <span className="percent">%</span>
                                                </div>
                                                <div className="bar-fill" style={this.state.filters} data-percent="98" id="progress1"></div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>                               
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                        <div className="product_img">
                            <img src={mainimage} alt="Product One Img"/>
                        </div>
                    </div>
                </div>
               
            </div>
        </section>
    </div>
    );
  }
}
