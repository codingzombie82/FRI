import React, { Component } from 'react';
// import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
// import { Link } from 'react-router-dom';
import ContractInfo from "../ABI/Token.json";


export class Footer extends Component {
  static displayName = Footer.name;

      // <div className="footer">
      // <div className="inner">
      //   <p><a href={ContractInfo.HttpsCompanySite}>{ContractInfo.CompanySite}</a></p>
      // </div>
      // </div>
  render () {
    return (
      <div className="side-menu__block">
      <div className="side-menu__block-overlay custom-cursor__overlay">
          <div className="cursor"></div>
          <div className="cursor-follower"></div>
      </div>
      <div className="side-menu__block-inner ">
          <div className="side-menu__top justify-content-end">
              <a href="#" className="side-menu__toggler side-menu__close-btn"><img
                      src="assets/images/shapes/close-1-1.png" alt=""/></a>
          </div>

          <nav className="mobile-nav__container">
          </nav>

          <div className="side-menu__sep"></div>

          <div className="side-menu__content">
              <div className="side-menu__social">
                  <a href="#"><i className="fab fa-facebook-square"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-pinterest-p"></i></a>
              </div>
          </div>
      </div>
  </div>
    );
  }
}
