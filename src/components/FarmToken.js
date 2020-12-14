import React, { Component } from 'react';
import ContractInfo from "../ABI/Token.json";
import TutorialToken from "../contracts/ChangZakSo.json";
import PoolInstance from "../contracts/TokenRewardPool.json";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
// import RangeSlider from 'react-bootstrap-range-slider';
import Web3 from "web3";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import title_logo from "../asset/logo2.png"
import ReactInterval from 'react-interval';
import '../asset/css/fri.css';
import leaf from "../asset/images/resources/leaf.png"

import detailImg from "../asset/images/shop/product-detai_img-1l.jpg"
export class FarmToken extends Component {
  static displayName = FarmToken.name;
  state = { userTokenBalance: 0, approveAmount: 0 , stakedAmount: 0, rewardAmount: 0,  teamRemainAmount : 0,
    rewardRate : 0,
    hideScroll : false,
    showStake : false, showApprove : false, showUnstake : false, showClaim : false,
    web3: null, accounts: null, contract: null, poolContract : null, 
    userStakeTime : 0,
    count:0,
    // stakingPercent : 100, 
    rewordSecond : 0,
    userRequestAmount : 0};

  constructor(props) {
    super(props);
    this.ApproveToken = this.ApproveToken.bind(this);
    this.StakingToken = this.StakingToken.bind(this);
    this.UnstakingToken = this.UnstakingToken.bind(this);
    this.ClaimReward = this.ClaimReward.bind(this);   
    this.StakeMax = this.StakeMax.bind(this);  

    
    // this.scrollChangeEvent = this.scrollChangeEvent.bind(this);
    // this.AmountChange = this.AmountChange.bind(this);
  }

  // scrollChangeEvent = (e) => {
  //   // this.state.stakingPercent =  e.target.value
  //   if(this.state.userTokenBalance > 0){
  //     var tag = e.target.value;
  //     var _userRequestAmount = (this.state.userTokenBalance * tag)/100;
  //     this.setState({stakingPercent : e.target.value , userRequestAmount : _userRequestAmount});
  //   }
  // }

  AmountChange = (e) => {
    var value = e.target.value;
    this.setState({
      userRequestAmount: value
    });
  }

  componentDidMount() {
    this.setState( this.loadWeb3);
  }

  UnstakingToken(){
    if (!this.state.web3) {//web3가 연결이 안되어 있다면
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.setState( this.RequestUnstaking);
    }
  }

  StakeMax(){
    this.setState({userRequestAmount : this.state.userTokenBalance});
  }



  StakingToken(){
    if (!this.state.web3) { //web3가 연결이 안되어 있다면
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.setState( this.RequestStaking);
    }
  }

  ClaimReward(){
    if (!this.state.web3) { //web3가 연결이 안되어 있다면
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.setState( this.RequestClaimReward);
    }
  }

  ApproveToken() {
    if (!this.state.web3) { //web3가 연결이 안되어 있다면
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.setState( this.RequestAprove);
    }
  }

  
  
  async RequestUnstaking(){
    if(this.state.poolContract){
        const result = await this.state.poolContract.methods.Unstake(this.state.accounts[0]).send({from: this.state.accounts[0]});
        this.setState(this.runContractInfo);
    }
  }
  async RequestClaimReward(){
    if(this.state.poolContract){
          const result = await this.state.poolContract.methods.claimReward(this.state.accounts[0]).send({from: this.state.accounts[0]});
          this.setState(this.runContractInfo);
    }
  }

  async RequestStaking(){
    if(this.state.poolContract){
        if(this.state.userRequestAmount > 0){
          console.log("this.state.userRequestAmount" + this.state.userRequestAmount);
          var stakingValue = this.state.web3.utils.toWei(this.state.userRequestAmount.toString(), 'ether');
          const result = await this.state.poolContract.methods.stake(this.state.accounts[0], stakingValue).send({from: this.state.accounts[0]});
          this.setState(this.runContractInfo);
        }
    }
  }

  async RequestAprove(){

    const tokenDecimals = this.state.web3.utils.toBN(ContractInfo.decimals);
    const tokenAmountToApprove = this.state.web3.utils.toBN(Math.ceil(this.state.userTokenBalance));
    const calculatedApproveValue = this.state.web3.utils.toHex(tokenAmountToApprove.mul(this.state.web3.utils.toBN(10).pow(tokenDecimals)));


    var apporveToken = 0;
    if(ContractInfo.TestNum === 0){
      const response = await this.state.contract.methods.approve(
        ContractInfo.TestNet.PoolContract, 
        calculatedApproveValue
      ).send({from: this.state.accounts[0]})
      apporveToken = await this.state.contract.methods.allowance(this.state.accounts[0], ContractInfo.TestNet.PoolContract).call();
      // this.setState({ApproveAmount : response});
      console.log(response);
    }else if(ContractInfo.TestNum === 1){
      const response = await this.state.contract.methods.approve(
        ContractInfo.Kovan.PoolContract, 
        calculatedApproveValue
      ).send({from: this.state.accounts[0]})
       console.log(response);
      // this.setState({ApproveAmount : response});
      apporveToken = await this.state.contract.methods.allowance(this.state.accounts[0], ContractInfo.Kovan.PoolContract).call();
    }else{
      const response = await this.state.contract.methods.approve(
        ContractInfo.Main.PoolContract, 
        calculatedApproveValue
      ).send({from: this.state.accounts[0]})
      console.log(response);
      apporveToken = await this.state.contract.methods.allowance(this.state.accounts[0], ContractInfo.Main.PoolContract).call();
      // this.setState({ApproveAmount : response});
    }

    var tokensWei = apporveToken;
    //Wei to TokenCount
    // var apporveTokenBalance = parseFloat(tokensWei) / Math.pow(10, ContractInfo.decimals);
    var apporveTokenBalance = this.state.web3.utils.fromWei(tokensWei, 'ether');

    this.setState({
      approveAmount: apporveTokenBalance
    },this.runContractInfo);
   

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

          this.setState({web3, accounts, contract: instance, poolContract : pool}, this.runContractInfo);

        }else if(ContractInfo.TestNum === 1){
          //Kovan
          const instance = new web3.eth.Contract(
          ContractInfo.Kovan.ABI, ContractInfo.Kovan.TokenContract);

          const pool = new web3.eth.Contract(
          ContractInfo.Kovan.PoolABI, ContractInfo.Kovan.PoolContract);

          this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runContractInfo);
        }else{
          //MainNet
          const instance = new web3.eth.Contract(
          ContractInfo.Main.ABI, ContractInfo.Main.TokenContract);

          const pool = new web3.eth.Contract(
            ContractInfo.Main.PoolABI, ContractInfo.Main.PoolContract);

          this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runContractInfo);
        }
    }   
  }

  async runContractInfo(){
    const { accounts, contract, web3, poolContract } = this.state;
    
    
    //현재 토큰 수량
    const response = await contract.methods.balanceOf(accounts[0]).call();
    var tokensWei1 = response;
    var _userTokenBalance =  web3.utils.fromWei(tokensWei1, 'ether'); //parseFloat(tokensWei1) / Math.pow(10, decimals);

    var approveToken = 0;
    if(ContractInfo.TestNum === 0){
      //Approve 가능한 토큰 갯수 가져오기
      approveToken = await contract.methods.allowance(accounts[0], ContractInfo.TestNet.PoolContract).call();     
    } else if (ContractInfo.TestNum === 1){
      approveToken = await contract.methods.allowance(accounts[0], ContractInfo.Kovan.PoolContract).call();
    } else{
      approveToken = await contract.methods.allowance(accounts[0], ContractInfo.Main.PoolContract).call();
    }


    var approveTokenWei = approveToken;
    var apporveTokenBalance =  web3.utils.fromWei(approveTokenWei, 'ether');

    var stakedAmount = await poolContract.methods.stakedAmount(accounts[0]).call();    
    var _stakingAmount = web3.utils.fromWei(stakedAmount, 'ether');
    var _userStakeTime = 0;
    var _rewordSecond = 0; 
    // var _rewordSecond = web3.utils.fromWei(rewordForSecond, 'ether');
    console.log("1111" );
    if(_stakingAmount > 0){
      console.log("2222" );
      var _rewordForSecond =  await poolContract.methods.rewordForSecond(accounts[0]).call(); 
      var stakeTime = await poolContract.methods.userStakeTime(accounts[0]).call(); 

      console.log("stakeTime 1: " + _rewordForSecond );
      if(stakeTime > 0){
        var _isRunning = await poolContract.methods.IsRunningPool().call();
        var _rewordForSecond = await poolContract.methods.rewordForSecond(accounts[0]).call(); 
        _rewordSecond = web3.utils.fromWei(_rewordForSecond, 'ether');
        var d = new Date(); 

        console.log("stakeTime" + stakeTime );

        _userStakeTime = (d.getTime() / 1000) - stakeTime ;
        if(!_isRunning){
          _userStakeTime = 0;
        }

        console.log("_userStakeTime" + _userStakeTime );
      }

    }
    var _rewardAmount = await poolContract.methods.rewardAmount(accounts[0]).call();

    var _rewardRate = await poolContract.methods.ratePool().call(); 

    console.log("_stakingAmount : "+_stakingAmount );
    console.log("_rewardAmount : "+_rewardAmount );
    console.log("_rewardRate : "+_rewardRate );
    console.log("_userStakeTime : "+_userStakeTime );
    // var rewordForSecond = await poolContract.methods.rewordForSecond(accounts[0]).call(); 
    // var _rewordSecond = web3.utils.fromWei(rewordForSecond, 'ether');

    var _isRunning = await poolContract.methods.IsRunningPool().call();
    var _userRewardAmountWei = await poolContract.methods.userReward(accounts[0]).call();
    // var _userRewardAmount =  web3.utils.fromWei(_userRewardAmountWei, 'ether');


//////FOR UI
    var _showUnstake = false;
    var _showClaim = false;
    var _showApprove = false;
    var _showStake = false;
  
    var _userRequestAmount = 0;
    console.log('1');
      //유저가 토큰을 가지고 있다면
      if(_userTokenBalance > 0){
        console.log('2');
        //스테이킹을 하고 있다면
        if(_stakingAmount > 0){
          console.log('3');
          //리워드 갯수를 보유한다면
          _showClaim = true;
          _showUnstake = true;

        }else{//스테이킹을 하지 않고 있다면
          //리워드 갯수를 보유한다면
          console.log('4');
          if(_rewardAmount > 0){
            _showClaim = true;
            console.log('5');
          }else{ //리워드 갯수가 없다면
            _showClaim = false;
            console.log('6');
          }
          _showUnstake = false;
          console.log('7');
        }
        console.log('apporveTokenBalance :' + apporveTokenBalance);
        console.log('_userTokenBalance :' + _userTokenBalance);
        console.log('_isRunning : '+ _isRunning);
        console.log('_stakingAmount : '+_stakingAmount);
        if(Math.abs(apporveTokenBalance) >= Math.abs(_userTokenBalance)){
          _showApprove = false;
          if(_isRunning){
            if(_stakingAmount > 0){
              _showStake = false;
              console.log('88');
            }else{
              _showStake = true;
              console.log('99');
            }
          }else{
            _showStake = false;
          }
        
        }else{
          //approve 할 양
          _userRequestAmount  = _userTokenBalance;
          if(_isRunning){
            if(_stakingAmount > 0){
             
              _showApprove = false;
              console.log('10');
            }else{
              _showApprove = true;
              console.log('11');
            }
          }else{
            _showApprove = false;
          }
          
        }
      }else{ //유저가 토큰이 없다면
        //스테이킹을 하고 있다면
        if(_stakingAmount > 0){
          //리워드 갯수를 보유한다면
          if(_rewardAmount > 0){
            _showClaim = true;
            console.log('8');
          }
          _showUnstake = true;
        }else{//스테이킹을 하지 않고 있다면
          //리워드 갯수를 보유한다면
          if(_rewardAmount > 0){
            _showClaim = true;
            console.log('9');
          }else{ //리워드 갯수가 없다면
            _showClaim = false;
            console.log('10');
          }
          _showUnstake = false;
        }
        _showApprove = false;
        _showStake = false;
        console.log('11');
      } 

  

    this.setState({
      userTokenBalance: _userTokenBalance,
      approveAmount: apporveTokenBalance,
      stakedAmount : _stakingAmount,
      showClaim : _showClaim,
      showUnstake : _showUnstake,
      showStake : _showStake,
      showApprove : _showApprove,
      rewardRate : _rewardRate,
      userStakeTime : _userStakeTime,
      // stakingPercent : 100 ,
      rewordSecond : _rewordSecond, 
      userRequestAmount : _userRequestAmount
    });

  }

  // <br/>    
  // <h3>Every time you stake and unstake {ContractInfo.Name} tokens</h3> 
  // <h3>the contract will automagically harvest {ContractInfo.Name} rewards for you!</h3>
  // <br/>
  
  // <div className="row">
  //   <div className="col-md-3"></div>
  //   <div className="col-md-6">
  //     <div className="border border-light text-center p-5">              
  //       <img alt="" src={title_logo}></img>
  //       <h1>{ContractInfo.Symbol} Farm</h1> <br/>
  //       <p>Deposit {ContractInfo.Symbol}</p>
  //       <p>Earn {ContractInfo.Symbol}</p>
  //       <br/>
  //       <p>Your {ContractInfo.Symbol} Amount : {this.state.userTokenBalance}</p>
  //       <p>Staked Amount : {this.state.stakedAmount}</p>
  //       <p className="text-danger">{this.state.rewardRate}% APY</p>
  //       {/* {this.state.showUnstake ? <p>Expected {this.state.expectedReward} of Rewards</p> : ''} */}
  //       {/* <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p> */}

  //       {this.state.showApprove && (<button className="btn btn-warning" onClick={this.ApproveToken}>Approve</button>)}

  //       {/* {this.state.showStake && !this.state.hideScroll && ( <RangeSlider  value={this.state.stakingPercent} max={100} min={0} 
  //        step={10} tooltip='on' onChange={this.scrollChangeEvent}/>)} */}

  //       {/* {this.state.showStake && (<p>VOLUME : {this.state.userRequestAmount} / {this.state.stakingPercent}%</p> )} */}

  //       {this.state.showStake && (<button className="btn btn-success" onClick={this.StakeMax}>Max</button> )}
  //       {this.state.showStake && (<input type="text"
  //                 placeholder="Amount" name="address" value={this.state.userRequestAmount} onChange={this.AmountChange}/>)}
  //       {this.state.showStake && (<br/>)}
  //       {this.state.showStake && (<br/>)}

  //       <ReactInterval timeout={1000} enabled={true}
  //       callback={() => this.setState({count: this.state.count + 1})} />

  //       {(this.state.showUnstake && this.state.userStakeTime > 0) && (<p>Your Reward : { ((this.state.userStakeTime + this.state.count) * this.state.rewordSecond).toFixed(8)}</p>)}
  //       {this.state.showStake && (<button className="btn btn-warning" onClick={this.StakingToken}>Stake</button>)}
  //       {this.state.showUnstake && (" ")}
  //       {this.state.showUnstake && (<button className="btn btn-warning" onClick={this.UnstakingToken}>Unstake</button>)}
  //       {this.state.showUnstake && (" ")}
  //       {(this.state.showUnstake || this.state.showClaim )&& (<button className="btn btn-warning" onClick={this.ClaimReward}>ClaimReward</button>)}
        
  //     </div>           
  //   </div>                 
  //   <div className="col-md-3"></div>
  // </div>
  // <br/><br/>
  // <CopyToClipboard onCopy={this.onCopy} text={ContractInfo.Main.TokenContract}>
  // <p className="text-truncate">{ContractInfo.Name} : <span>{ContractInfo.Main.TokenContract}</span></p>
  // </CopyToClipboard>
  // <CopyToClipboard onCopy={this.onCopy} text={ContractInfo.Main.PoolContract}>
  // <p className="text-truncate">Pool : <span>{ContractInfo.Main.PoolContract}</span></p>
  // </CopyToClipboard>

  render() {
    return (
      <div>
        <section className="service_four service_page">
        <div className="container">
            {/* <div className="service_four_top"></div> */}
            <div className="block-title text-center">
                <p>FRI FARM</p>
                <h5>Every time you stake and unstake {ContractInfo.NickName}
the contract will automagically harvest {ContractInfo.NickName} rewards for you!</h5>
                <div className="leaf">
                    <img src={leaf} alt=""/>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-3">                    
                </div>
                <div className="col-xl-6 col-lg-6">
                    <div className="service_four_single wow fadeInLeft" data-wow-delay="600ms">
                        <h1>{ContractInfo.Symbol} Farm</h1>
                        <div className="service_four_icon">
                            {/* <span className="icon-harvest"></span> */}
                            <img alt="" src={title_logo}  onClick={this.MoveFarmToken}></img>
                        </div>
                        <br/>
                        <div className="service_four_deatils">
                            <h3><a href="#" className="service_four_title_middle">Deposit {ContractInfo.Symbol}</a>
                            </h3>
                            <h3><a href="#" className="service_four_title_middle">Earn {ContractInfo.Symbol}</a>
                            </h3>
                              <br/>
                              <h3 className="service_four_sub_title">Your {ContractInfo.Symbol} Amount : </h3> 
                              <h3 className="service_four_sub_title_small">{this.state.userTokenBalance}</h3>
                              <br/>
                              <h3 className="service_four_sub_title">Staked Amount : </h3> 
                              <h3 className="service_four_sub_title_small">{this.state.stakedAmount}</h3><br/>
                              <h3 className="service_four_API">{this.state.rewardRate}% APY</h3>
                             
                              {this.state.showApprove && (<button className="thm-btn" onClick={this.ApproveToken}>Approve</button>)}

                              {/* {this.state.showStake && !this.state.hideScroll && ( <RangeSlider  value={this.state.stakingPercent} max={100} min={0} 
                              step={10} tooltip='on' onChange={this.scrollChangeEvent}/>)} */}

                              {/* {this.state.showStake && (<p>VOLUME : {this.state.userRequestAmount} / {this.state.stakingPercent}%</p> )} */}

                              {this.state.showStake && (<button className="btn btn-success" onClick={this.StakeMax}>Max</button> )}
                              {this.state.showStake && (<input type="text" className="farm_input_margin"
                                        placeholder="Amount" name="address" value={this.state.userRequestAmount} onChange={this.AmountChange}/>)}
                              {this.state.showStake && (<br/>)}
                              {this.state.showStake && (<br/>)}

                              <ReactInterval timeout={1000} enabled={true}
                              callback={() => this.setState({count: this.state.count + 1})} />

                              {(this.state.showUnstake && this.state.userStakeTime > 0) && (<p>Your Reward : { ((this.state.userStakeTime + this.state.count) * this.state.rewordSecond).toFixed(8)}</p>)}
                              {this.state.showStake && (<button className="thm-btn" onClick={this.StakingToken}>Stake</button>)}
                              {this.state.showUnstake && (" ")}
                              {this.state.showUnstake && (<button className="thm-btn" onClick={this.UnstakingToken}>Unstake</button>)}
                              {this.state.showUnstake && (" ")}
                              {(this.state.showUnstake || this.state.showClaim )&& (<button className="thm-btn" onClick={this.ClaimReward}>ClaimReward</button>)}
                      
                            <br/><br/>
                        </div>                        
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3">
                    
                </div>
            </div>
            <br/>
            <div className="row">
              <div className="col-xl-3 col-lg-3">
                    
              </div>
              <div className="col-xl-6 col-lg-6">
                <CopyToClipboard onCopy={this.onCopy} text={ContractInfo.Main.TokenContract}>
                <p className="text-truncate">{ContractInfo.Name} Token : <span>{ContractInfo.Main.TokenContract}</span></p>
                </CopyToClipboard>
                <CopyToClipboard onCopy={this.onCopy} text={ContractInfo.Main.PoolContract}>
                <p className="text-truncate">Pool : <span>{ContractInfo.Main.PoolContract}</span></p>
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
