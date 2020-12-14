import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import { TopLogo } from './TopLogo';
import ContractInfo from "../ABI/Token.json";
// import '../asset/css/style.css';
import '../asset/css/animate.min.css';
import '../asset/css/bootstrap.min.css';
// import '../asset/css/owl.carousel.min.css';
import '../asset/css/owl.theme.default.min.css';
import '../asset/css/magnific-popup.css';
// import '../asset/css/fontawesome-all.min.css';
import '../asset/css/swiper.min.css';
import '../asset/css/bootstrap-select.min.css';
// import '../asset/css/jquery.mCustomScrollbar.min.css';
import '../asset/css/bootstrap-datepicker.min.css';
// import '../asset/css/vegas.min.css';
import '../asset/css/nouislider.min.css';
import '../asset/css/nouislider.pips.css';
import '../asset/css/agrikol_iconl.css';
import '../asset/css/style.css';
import '../asset/css/responsive.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div className="page-wrapper">
         <div className="site-header__header-one-wrap">
          <TopLogo />
          <NavMenu />
        </div>
        <Container>
          {this.props.children}
        </Container>
        <div className="site-footer_bottom">
            <div className="container">
                <p></p>
                <div className="site-footer_bottom_copyright">
                    <p><a href={ContractInfo.HttpsCompanySite}>{ContractInfo.CompanySite}</a></p>
                </div>
                <div className="site-footer_bottom_menu">
                    <ul className="list-unstyled">
                        {/* <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Use</a></li> */}
                    </ul>
                </div>
            </div>
        </div>
        <a href="#" data-target="html" className="scroll-to-target scroll-to-top"><i className="fa fa-angle-up"></i></a>
        <Footer />
      </div>
    );
  }
}
