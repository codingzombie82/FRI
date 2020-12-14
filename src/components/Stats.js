import React, {Component} from 'react';
import ContractInfo from "../ABI/Token.json";
import TutorialToken from "../contracts/ChangZakSo.json";
import Web3 from "web3";
import PoolInstance from "../contracts/TokenRewardPool.json";
import getPrice from "../getPrice";
import cookie from 'react-cookies'
import '../asset/css/fri.css';
export class Stats extends Component {
  static displayName = Stats.name;

  state = { 
    priceDalar : 0,
    userStakeAmount: 0, totalPoolAmount: 0, 
    userStakingToTotal : 0,
    rewardSecond : 0.0, rewardHour : 0.0, rewardWeek : 0.0, rewardDay : 0.0,
    web3: null, accounts: null, contract: null , text: "Connect Wallet", copied: false};


  constructor(props) {
    super(props);
     this.state = { userStakeAmount: 0};
     this.AdminInfo = this.AdminInfo.bind(this);
  }

  AdminInfo() {
    let path = "AdminInfo"; 
    this.props.history.push(path);
  }

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

          this.setState({web3, accounts, contract: instance, poolContract : pool}, this.runBalance);
        }else if(ContractInfo.TestNum === 1){
          //Kovan
          const instance = new web3.eth.Contract(
          ContractInfo.Kovan.ABI, ContractInfo.Kovan.TokenContract);

          const pool = new web3.eth.Contract(
          ContractInfo.Kovan.PoolABI, ContractInfo.Kovan.PoolContract);

          this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runBalance);
        }else{
          //MainNet
          const instance = new web3.eth.Contract(
          ContractInfo.Main.ABI, ContractInfo.Main.TokenContract);

          const pool = new web3.eth.Contract(
            ContractInfo.Main.PoolABI, ContractInfo.Main.PoolContract);

          this.setState({web3, accounts, contract: instance , poolContract : pool}, this.runBalance);
        }
    }   
  }
  // /html/body/div[1]/div/div[1]/section/article/div[2]/div[1]/span
  runBalance = async () => {
    const { web3, accounts, poolContract} = this.state;

    //풀에 있는 남은 양
    var totalStaked = await poolContract.methods.totalStakedAmount().call(); 
    var _totalStaked = web3.utils.fromWei(totalStaked, 'ether');

    //사용자 스테이킹 양
    var getStakingAmount = await poolContract.methods.stakedAmount(accounts[0]).call(); 
    var _userStakeAmount = web3.utils.fromWei(getStakingAmount, 'ether');


    var getRewordForSecond = await poolContract.methods.rewordForSecond(accounts[0]).call(); 
    var _rewordSecond = web3.utils.fromWei(getRewordForSecond, 'ether');

    // var getRewordForDay = await poolContract.methods.getRewordForDay(accounts[0]).call(); 
    var _rewordDay = _rewordSecond * 60 * 60 * 24;// web3.utils.fromWei(getRewordForDay, 'ether');

    // var getRewordForHour = await poolContract.methods.getRewordForHour(accounts[0]).call(); 
    var _rewordHour = _rewordSecond * 60 * 60;//web3.utils.fromWei(getRewordForHour, 'ether');

    // var getRewordForWeek = await poolContract.methods.getRewordForWeek(accounts[0]).call(); 
    var _rewordWeek = _rewordSecond * 60 * 60 * 24 * 7;//web3.utils.fromWei(getRewordForWeek, 'ether');

    var rewardRate = await poolContract.methods.ratePool().call(); 
   
    // var _priceDalar = this.getPriceFun();

    var _userStakingToTotal = 0;

    if(_userStakeAmount > 0 && _totalStaked > 0){
      _userStakingToTotal =  Math.floor(( _userStakeAmount / _totalStaked ) * 100) ;
    }
     

    this.setState({
      text: accounts[0],
      // priceDalar : _priceDalar,
      userStakeAmount: _userStakeAmount,
      totalPoolAmount : _totalStaked,
      rewardSecond : _rewordSecond, 
      rewardHour : _rewordHour, 
      rewardDay : _rewordDay,
      rewardWeek : _rewordWeek,
      APY : rewardRate,
      userStakingToTotal : _userStakingToTotal
    });
  }



  // async getPriceFun(object) {
  //   console.log('getPriceFun');
  //   var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
  //   var x = new XMLHttpRequest();
  //   var options = {
  //     method: 'GET',
  //     url: 'https://api.foblgate.com/public/common/closePriceHistory/?pairName=ETH.KRW&cnt=14&skipIdx=1',
  //   }
  //   x.open(options.method, cors_api_url + options.url);

  //    x.onload = x.onerror = function () {  
  //     // var price = 0;
  //     if(x.readyState === 4 && x.status === 200){
  //       var jsonResponse = JSON.parse(x.response);
  //       console.log('getPrice asdf' + parseFloat(jsonResponse.data.closePriceHistory[0].closePrice));
  //       var price = parseFloat(jsonResponse.data.closePriceHistory[0].closePrice);
  //       console.log('getPrice asdf' + price);
  //       object.state.priceDalar = price;
  //     }  
  //   };   
  //   x.send();
  // }

  render() {
    return (

      <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
    
        <div className="col-md-6">
          <br/>
          <h4>{ContractInfo.Name} Token staking pool</h4>
          <br/>
          <div>
          <table className="table table-striped table-white table_boarder_class">
            <thead>
              <tr>
                <th scope="col">PRICES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1 {ContractInfo.Symbol} = $ {this.state.priceDalar}</th>
              </tr>
              <tr>
                <th scope="row">1 {ContractInfo.Symbol} = $ {this.state.priceDalar}</th>
              </tr>
            </tbody>
          </table>
          <table className="table table-striped table-white table_boarder_class">
            <thead>
              <tr>
               <th scope="col" colSpan="2">STAKING</th>
             </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">There are total</th>
                <th scope="row">{this.state.totalPoolAmount} {ContractInfo.Symbol} staked in {ContractInfo.Symbol} staking pool = $ {Math.floor(this.state.totalPoolAmount * this.state.priceDalar)}</th>
              </tr>
              <tr>
                <th scope="row">You are staking </th>
                <th scope="row">{this.state.userStakeAmount}  {ContractInfo.Symbol} ({this.state.userStakingToTotal}% of the pool) = $ {Math.floor(this.state.userStakeAmount * this.state.priceDalar)} </th>
              </tr>
            </tbody>             
          </table>
          <table className="table table-striped table-white table_boarder_class">
            <thead>
              <tr>
               <th scope="col" colSpan="2">{ContractInfo.NickName}  REWARDS<a onClick={this.AdminInfo}>.</a></th>
             </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Claimable rewards</th>
                <th scope="row">{this.state.rewardSecond} {ContractInfo.Symbol} = $ {this.state.priceDalar * this.state.rewardSecond}</th>
              </tr>
              <tr>
                <th scope="row">Hourly estimate</th>
                <th scope="row">{this.state.rewardHour} {ContractInfo.Symbol} = $ {this.state.priceDalar * this.state.rewardHour}</th>
              </tr>
              <tr>
                <th scope="row">Daily estimate</th>
                <th scope="row">{this.state.rewardDay} {ContractInfo.Symbol} = ${this.state.priceDalar * this.state.rewardDay}</th>
              </tr>
              <tr>
                <th scope="row">Weekly estimate</th>
                <th scope="row">{this.state.rewardWeek} {ContractInfo.Symbol} = ${this.state.priceDalar * this.state.rewardWeek}</th>
              </tr>
              <tr>
                <th scope="row">Hourly ROI in USD</th>
                <th scope="row">
                  {this.state.userStakeAmount > 0 ? ((this.state.rewardHour / this.state.userStakeAmount)*100).toFixed(8) : 0 } %
                </th>
              </tr>
              <tr>
                <th scope="row">Daily ROI in USD</th>
                <th scope="row">
                  {this.state.userStakeAmount > 0 ? ((this.state.rewardDay / this.state.userStakeAmount)*100).toFixed(8) : 0 } %
                </th>
              </tr>
              <tr>
                <th scope="row">Weekly ROI in USD</th>
                <th scope="row">
                  {this.state.userStakeAmount > 0 ? ((this.state.rewardWeek / this.state.userStakeAmount)*100).toFixed(8) : 0} %
                </th>
              </tr>
              <tr>
                <th scope="row">APY (unstable)</th>
                <th scope="row">
                  {this.state.userStakeAmount > 0 ? this.state.APY : 0} %
                </th>
              </tr>
            </tbody>             
          </table>
          </div>
        </div>         
        <div className="col-md-3"></div>
      </div>    
    </div>     
    );
  }
}
