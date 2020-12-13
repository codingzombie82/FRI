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
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand className="text-white" tag={Link} to="/"><img alt={ContractInfo.Name} src={title_logo}/></NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-light" to="/">Home</NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink tag={Link} className="text-primary" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-primary" to="/fetch-data">Fetch data</NavLink>
                </NavItem> */}
                <NavItem>
                  {ContractInfo.Dual === 0 ? 
                  <NavLink tag={Link} className="text-light" to="/farm">Farm</NavLink> 
                  : <NavLink tag={Link} className="text-light" to="/dualfarm">Farm</NavLink>}                  
                </NavItem>
                <NavItem>
                {ContractInfo.Dual === 0 ? 
                  <NavLink tag={Link} className="text-light" to="/Stats">Stats</NavLink> 
                  : <NavLink tag={Link} className="text-light" to="/dualstats">Stats</NavLink>}    
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
