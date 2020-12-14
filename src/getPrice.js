// import Web3 from "web3";
import ContractInfo from "./ABI/Token.json";
const getPrice = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // window.addEventListener("load", async () => {
      var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
      var x = new XMLHttpRequest();
      var options = {
        method: 'GET',
        url: ContractInfo.Price,
      }
      x.open(options.method, cors_api_url + options.url);
  
       x.onload = x.onerror = function () {  
        // var price = 0;
        if(x.readyState === 4 && x.status === 200){
          var jsonResponse = JSON.parse(x.response);
          var price = parseFloat(jsonResponse.data.closePriceHistory[0].closePrice);
          console.log('getPrice 1');
          resolve(price);
        }else{
          console.log('getPrice 2');

          reject(0);
        }  
      };   
      x.send();
    // });
  });


export default getPrice;
