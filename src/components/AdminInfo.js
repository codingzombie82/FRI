import React, { Component } from 'react';
import Web3 from "web3";

import TutorialToken from "../contracts/ChangZakSo.json";
import ContractInfo from "../ABI/Token.json";
import PoolInstance from "../contracts/TokenStakePool.json";

// import getWeb3 from "../getWeb3";
export class AdminInfo extends Component {
  static displayName = AdminInfo.name;
  state = { rate: 0, tokenAmount: 0, web3: null, accounts: null, 
    showTeamApprove : false,
    poolContract: null, contract: null , text: "", address: "", isRuning : false, comment: '', 
    etherNetwork : '테스트넷',
    remainRewardPool : 0,
    beginRewardAmount : 0, totalStaked : 0, userCount : 0,
    isAdmin : false, ownerAddress : '', 
    isTeamPool: false, teamRequestAmount : 0, teamCurrentReward : 0
  };

  constructor(props) {
    super(props);

    this.InitUpdate = this.InitUpdate.bind(this);
    // this.RewardAmount = this.RewardAmount.bind(this);
    this.AddressChange = this.AddressChange.bind(this);
    this.rateChange = this.rateChange.bind(this);
    this.teamReward = this.teamReward.bind(this);
    this.teamApprove = this.teamApprove.bind(this);
    this.endPoolApprove = this.endPoolApprove.bind(this);
    this.endPool = this.endPool.bind(this);
  }

  //[           lifeCycle           ]
  componentDidMount() {
    console.log("componentDidMount");
    // if (!this.state.web3) { //web3가 연결이 안되어 있다면
    //   console.log("componentDidMount 1");
      //  this.setState(this.loadWeb3);
  
    // }else{ //web3가 연결되어 있다면
    //   this.setState( this.runTokenBalance);
    //   console.log("componentDidMount 2");
    // }
    this.setState(this.loadWeb3);
  }
  
  componentWillUnmount(){
    console.log("componentWillUnmount");
  }

  componentDidCatch(){
    console.log("componentDidCatch");
  }

  componentDidUpdate(){
    console.log("componentDidUpdate");
  }

  //[       Click Event           ]
  InitUpdate() {//= async () => {
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.initUpdate();
    }
  }

  AddressChange = (e) => {
    var value = e.target.value;
    this.setState({
      address: value
    });
  }

  rateChange = (e) => {
    var value = e.target.value;
    this.setState({
      rate: value
    });
  }
  
  teamReward(){
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.requestTeamReward();
    }
  }
  teamApprove(){
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.requestTeamApprove();
    }
  }
  
  // RewardAmount(){
  //   if (!this.state.web3) {
  //     this.loadWeb3();
  //   }else{ //web3가 연결되어 있다면
  //     this.getRewardAmount();
  //   }
  // }
  requestChangeRate(){
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.changePoolRate();
    }
  }

  endPool(){
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.requestEndPool();
    }
  }

  endPoolApprove(){
    if (!this.state.web3) {
      this.loadWeb3();
    }else{ //web3가 연결되어 있다면
      this.requestEndPoolApprove();
    }
  }
  
  
  //[    FUNCTION      ]
  async requestEndPool(){
      const result = await this.state.poolContract.methods.endPool().send({from: this.state.accounts[0]});
      this.setState(this.runTokenBalance);
  }
  
  async requestEndPoolApprove(){
    var totalSupply = await this.state.contract.methods.totalSupply().call(); 
    console.log('requestEndPoolApprove :'+ totalSupply);
    var apporveToken = 0;
    if(ContractInfo.TestNum === 0){
      const response = await this.state.contract.methods.approve(
        ContractInfo.TestNet.PoolContract, 
        totalSupply
      ).send({from: this.state.accounts[0]})
      apporveToken = await this.state.contract.methods.allowance(this.state.accounts[0], ContractInfo.TestNet.PoolContract).call();
      // this.setState({ApproveAmount : response});
      console.log(response);
    }else if(ContractInfo.TestNum === 1){
      const response = await this.state.contract.methods.approve(
        ContractInfo.Kovan.PoolContract, 
        totalSupply
      ).send({from: this.state.accounts[0]})
      console.log(response);
      // this.setState({ApproveAmount : response});
      apporveToken = await this.state.contract.methods.allowance(this.state.accounts[0], ContractInfo.Kovan.PoolContract).call();
    }else{
      const response = await this.state.contract.methods.approve(
        ContractInfo.Main.PoolContract, 
        totalSupply
      ).send({from: this.state.accounts[0]})
      console.log(response);
      apporveToken = await this.state.contract.methods.allowance(this.state.accounts[0], ContractInfo.Main.PoolContract).call();
      // this.setState({ApproveAmount : response});
    }
    console.log(apporveToken);
  }
  async requestTeamReward() {
    const result = await this.state.poolContract.methods.claimReward(this.state.accounts[0]).send({from: this.state.accounts[0]});
    this.setState(this.runTokenBalance);
  }

  async requestTeamApprove() {

    const tokenDecimals = this.state.web3.utils.toBN(ContractInfo.decimals);
    const tokenAmountToApprove = this.state.web3.utils.toBN(Math.ceil(this.state.teamRequestAmount));
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
 
  
  async changePoolRate(){
    var rate = this.state.rate;
    if(rate > 0){
      const result = await this.state.poolContract.methods.changeRewardRate(rate).send({from: this.state.accounts[0]});
      var _rate = await this.state.poolContract.methods.ratePool().call();
      this.setState({rate: _rate}, this.runTokenBalance);
    }
  }

  // async getRewardAmount(){
  //   var useraddress = this.state.address;
  //   if(useraddress != null && useraddress.length > 0 && this.state.poolContract != null){
  //     const result = await this.state.poolContract.methods.totalSharesAmount().call();
  //     var tokenBalance = this.state.web3.utils.fromWei(result, 'ether'); //parseFloat(tokensWei) / Math.pow(10, decimals);
  //     console.log("Token balance: " + tokenBalance);
  //   }
  // }

  async loadWeb3(){ 
    console.log("loadWeb3");
    if (window.ethereum) {
        console.log("2");
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
  
          this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runTokenBalance);
      }else if(ContractInfo.TestNum === 1){
        //Kovan
        const instance = new web3.eth.Contract(
        ContractInfo.Kovan.ABI, ContractInfo.Kovan.TokenContract);
        const pool = new web3.eth.Contract(
          ContractInfo.Kovan.PoolABI, ContractInfo.Kovan.PoolContract);

        this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runTokenBalance);
      }
      else{
        //MainNet
        const instance = new web3.eth.Contract(
        ContractInfo.Main.ABI, ContractInfo.Main.TokenContract);

        const pool = new web3.eth.Contract(
          ContractInfo.Main.PoolABI, ContractInfo.Main.PoolContract);

        this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runTokenBalance);
      }
    }   
  }


  runTokenBalance = async () => {
      const { contract, poolContract, accounts} = this.state;

      var address = "";
      if(ContractInfo.TestNum === 0){
        // TestNet
        address = ContractInfo.TestNet.PoolContract;
        this.state.etherNetwork = '테스트넷';
      }else if(ContractInfo.TestNum === 1){
        //Kovan
        address = ContractInfo.Kovan.PoolContract;      
        this.state.etherNetwork = 'Kovan';
      }
      else{
        //MainNet
        address = ContractInfo.Main.PoolContract;    
        this.state.etherNetwork = 'Main';   
      }
      //토큰 갯수 가져오기
      const response = await contract.methods.balanceOf(address).call();
      // const response = await contract.methods.balanceOf(ContractInfo.Kovan.PoolContract).call();
      var tokensWei = response;

      //토큰 Decimals 가져오기
      var decimals = await contract.methods.decimals().call(); 
      console.log("Token decimals: " + decimals);

      //Wei to TokenCount
      var tokenBalance = this.state.web3.utils.fromWei(tokensWei, 'ether'); //parseFloat(tokensWei) / Math.pow(10, decimals);
      console.log("Token balance: " + tokenBalance);

      var _isRunning = await poolContract.methods.IsRunningPool().call();
      var _rate  = await poolContract.methods.ratePool().call();

      console.log("_isRunning: " + _isRunning);

      var teamAddress = await poolContract.methods.teamPoolAddress().call();
      var _ownerAddress = await poolContract.methods.owner().call();
     
      //풀에 있는 남은 양
      var totalStakedWei = await poolContract.methods.totalStakedAmount().call(); 
      var _totalStaked = this.state.web3.utils.fromWei(totalStakedWei, 'ether');
      
      var _beginRewardAmountWei = await poolContract.methods.beginRewardAmount().call();
      var _beginRewardAmount = this.state.web3.utils.fromWei(_beginRewardAmountWei, 'ether');

      var _userCount = await poolContract.methods.contractListCount().call(); 

      var _remainRewardPoolWei = await poolContract.methods.remainRewardAmount().call();
      var _remainRewardPool =  this.state.web3.utils.fromWei(_remainRewardPoolWei, 'ether');
  
      console.log('teamAddress: '+ teamAddress);
      console.log('accounts[0]: '+ accounts[0]);

      if(teamAddress === accounts[0]){
        console.log('teampool');
        this.state.isTeamPool = true;
        //팀 리워드
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

        var apporveTokenBalance =  this.state.web3.utils.fromWei(approveTokenWei, 'ether');     
        var _rewardAmountWei = await poolContract.methods.rewardAmount(accounts[0]).call();
        var _rewardAmount =  this.state.web3.utils.fromWei(_rewardAmountWei, 'ether');
      

        console.log('_rewardAmount :'+ _rewardAmount);
        console.log('apporveTokenBalance :'+ apporveTokenBalance);
        if(tokenBalance < 0){
          _rewardAmount = 0;
          this.state.teamRequestAmount = 0;
          this.state.teamCurrentReward = 0;
        }else{
          if(apporveTokenBalance < _rewardAmount){

            this.state.teamRequestAmount = _rewardAmount;
          }
          this.state.teamCurrentReward = _rewardAmount;
        }
      }else if(_ownerAddress === accounts[0]){
        this.state.isAdmin = true;
      }else{
        console.log('teampool not');
        this.state.isTeamPool = false;
      }     
      this.setState({rate : _rate, text: tokenBalance, isRuning : _isRunning,
        userCount : _userCount, remainRewardPool : _remainRewardPool,
        ownerAddress : _ownerAddress, totalStaked: _totalStaked , beginRewardAmount : _beginRewardAmount });

  }

  async initUpdate(){
    var _isRunning = await this.state.poolContract.methods.IsRunningPool().call();
    if(!_isRunning){
      await this.state.poolContract.methods.initTotalReward().send({from: this.state.accounts[0]});
      this.setState({comment : '초기 실행했습니다.' }, this.runTokenBalance); 
    }else{
      this.setState({comment : '이미 초기화 실행상태입니다.' }, this.runTokenBalance); 
    }
  }

  render () {
    return (
        <div className="container">
          {this.state.isAdmin && ( <div className="row">
              <table className="table table-striped table-dark">
                  <thead>
                    <tr>
                    <th scope="col" colSpan="2">{ContractInfo.Name} Pool Info </th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">POOL STATE</th>
                      <th scope="row">{this.state.isRuning ? '동작중': '중단중'}</th>
                    </tr>
                    <tr>
                      <th scope="row">INIT</th>
                      <th scope="row">
                      {(!this.state.isRuning) && ( <button  className="btn btn-warning" onClick={() => this.InitUpdate()}>    
                        1. 만들어진 풀어 토큰 전송 <br/>
                        2. 전송이 되어졌다면 아래 버튼을 눌러 초기 값 세팅  <br/>                
                        3. 스테이킹풀에 있는 토큰 갯수 {this.state.text} <br/>
                        4. 무조건 초기 1회만 눌러야함
                      </button> )}
                      </th>
                    </tr>

                    <tr>
                      <th scope="row">네트워크상태</th>
                      <th scope="row">{this.state.etherNetwork}</th>
                    </tr>

                    <tr>
                      <th scope="row">Current Rate</th>
                      <th scope="row">
                        <input type="text"
                        placeholder="이자율" name="rate" value={this.state.rate} onChange={this.rateChange}/> %<br/>
                        <button  className="btn btn-warning" onClick={() => this.requestChangeRate() }> 이자율 변경</button>
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">풀종료</th>
                      <th scope="row">
                          <button  className="btn btn-warning" onClick={() => this.endPoolApprove() }> 풀종료 apporve</button>
                          &nbsp;
                          <button  className="btn btn-warning" onClick={() => this.endPool() }> 풀종료 endPool</button>
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">주인 주소</th>
                      <th scope="row">
                        {this.state.ownerAddress} 
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">Pool Contract</th>
                      <th scope="row">
                        {ContractInfo.Main.PoolContract} 
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">스테이킹 된 양</th>
                      <th scope="row">
                        {this.state.totalStaked}
                      </th>
                    </tr>

                    <tr>
                      <th scope="row">최초 이자양</th>
                      <th scope="row">
                        {this.state.beginRewardAmount}
                      </th>
                    </tr>

                    <tr>
                      <th scope="row">남은 이자양</th>
                      <th scope="row">
                        {this.state.remainRewardPool}
                      </th>
                    </tr>

                    <tr>
                      <th scope="row">참여자 수</th>
                      <th scope="row">                      
                        {this.state.userCount}
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">로그</th>
                      <th scope="row">
                      {this.state.comment}   
                      </th>
                    </tr> 
                  </tbody>             
                </table>
            </div> )}
            {this.state.isTeamPool && (
            <div className="row">
              <table className="table table-striped table-dark">
                  <thead>
                    <tr>
                    <th scope="col" colSpan="2">{ContractInfo.Name} Pool Team Info </th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">POOL STATE</th>
                      <th scope="row">{this.state.isRuning ? '동작중': '중단중'}</th>
                    </tr>                    
                    <tr>
                      <th scope="row">네트워크상태</th>
                      <th scope="row">{this.state.etherNetwork}</th>
                    </tr>
                    <tr>
                      <th scope="row">Pool Contract</th>
                      <th scope="row">
                        {ContractInfo.Main.PoolContract} 
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">스테이킹 된 양</th>
                      <th scope="row">
                        {this.state.totalStaked}
                      </th>
                    </tr>
                    
                    <tr>
                      <th scope="row">최초 이자양</th>
                      <th scope="row">
                        {this.state.beginRewardAmount}
                      </th>
                    </tr>

                    <tr>
                      <th scope="row">남은 이자양</th>
                      <th scope="row">
                        {this.state.remainRewardPool}
                      </th>
                    </tr>

                    <tr>
                      <th scope="row">참여자 수</th>
                      <th scope="row">                      
                        {this.state.userCount}
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">팀 리워드 이율</th>
                      <th scope="row">
                        5% 
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">팀 리워드 금액</th>
                      <th scope="row">
                      {this.state.teamCurrentReward}
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">팀 출금</th>
                      <th scope="row">
                          <button  className="btn btn-warning" onClick={() => this.teamApprove() }> 팀출금 1</button>
                          &nbsp;
                          <button  className="btn btn-warning" onClick={() => this.teamReward() }> 팀출금 2</button>
                      </th>
                    </tr>
                    <tr>
                      <th scope="row">로그</th>
                      <th scope="row">
                      {this.state.comment}   
                      </th>
                    </tr>                 
                  </tbody>             
                </table>
            </div>
          )}
        </div>
    );
  }
}
