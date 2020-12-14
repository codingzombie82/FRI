import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import ContractInfo from "../ABI/Token.json";
import './NavMenu.css';
import title_logo from "../asset/title_logo.png"


export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }
 
  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
//     <header className="main-nav__header-one">
// <Navbar className="header-navigation stricky">  
//  <div className="container clearfix">
//  <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//  <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//      <div className="main-nav__left main_topbar_max_width" >
//          <a href="#" className="side-menu__toggler">
//              <i className="fa fa-bars"></i>
//          </a>
//      </div>
//      <div className="main-nav__main-navigation">
//          <ul className=" main-nav__navigation-box">
//              <NavItem >
//                <NavLink tag={Link}  to="/">Home</NavLink>
//              </NavItem>
//              <NavItem>
//                <NavLink tag={Link}  to="/farm">Farm</NavLink>
//              </NavItem>
//              <NavItem>
//                <NavLink tag={Link}  to="/Stats">Stats</NavLink>
//              </NavItem>

//          </ul>
//      </div>

//      <div className="main-nav__right">
         
//      </div>
//  </Collapse>
//  </div>
//  </Navbar>
// </header> 
  }

  render () {
    return (          
    <header  className="main-nav__header-one">
    <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
    <Container>
    
      <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
      <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
        <ul className="navbar-nav flex-grow">
          <NavItem>
            <NavLink tag={Link} className="text-muted" to="/">Home</NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink tag={Link} className="text-primary" to="/counter">Counter</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} className="text-primary" to="/fetch-data">Fetch data</NavLink>
          </NavItem> */}
          <NavItem>
            {ContractInfo.Dual === 0 ? 
            <NavLink tag={Link} className="text-muted" to="/farm">Farm</NavLink> 
            : <NavLink tag={Link} className="text-muted" to="/dualfarm">Farm</NavLink>}                  
          </NavItem>
          <NavItem>
          {ContractInfo.Dual === 0 ? 
            <NavLink tag={Link} className="text-muted" to="/Stats">Stats</NavLink> 
            : <NavLink tag={Link} className="text-muted" to="/dualstats">Stats</NavLink>}    
          </NavItem>
          {/* <NavItem>
            <NavLink tag={Link} className="text-muted" to="/AdminInfo">AdminInfo</NavLink>                
          </NavItem> */}
        </ul>
      </Collapse>
    </Container>
  </Navbar>
</header>
    );
  }
}
