import React, { Component } from 'react';
// import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
// import { Link } from 'react-router-dom';
import ContractInfo from "../ABI/Token.json";

export class Footer extends Component {
  static displayName = Footer.name;


  render () {
    return (
      <div className="footer">
      <div className="inner">
        <p><a href={ContractInfo.HttpsCompanySite}>{ContractInfo.CompanySite}</a></p>
      </div>
      </div>
    );
  }
}
