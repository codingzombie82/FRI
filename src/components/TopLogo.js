import React, { Component } from 'react';
// import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
// import { Link } from 'react-router-dom';
import ContractInfo from "../ABI/Token.json";

import '../asset/css/fri.css';
import logo from '../asset/images/resources/logo1.png';
export class TopLogo extends Component {
  static displayName = TopLogo.name;

  render () {
    return (

            <div className="topbar-one">
                <div className="topbar_bg top_bg"></div>
                <div className="container">
                    <div className="topbar-one__left">
                    </div>
                    <div className="topbar-one__middle">
                        <a href="/" className="main-nav__logo">
                            <img src={logo} className="main-logo" alt="Awesome Image" />
                        </a>
                    </div>
                    <div className="topbar-one__right">                       
                    </div>
                </div>
            </div>
    );
  }
}
