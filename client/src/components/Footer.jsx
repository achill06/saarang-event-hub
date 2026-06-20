import logo from '../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
      
        <div className="footer-brand">
          <img className="logo-img" src={logo} alt="Saarang" />
          <div className="logo-text">Saarang<sub>IIT Madras</sub></div>
          <p className="footer-desc">India's second oldest cultural festival, bringing together art, music, dance, and literature since 1974.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-lbl">Festival</span>
            <a href="#">About Us</a>
            <a href="#">Schedule</a>
            <a href="#">Proshows</a>
            <a href="#">Sponsors</a>
          </div>
          <div className="footer-col">
            <span className="footer-lbl">Support</span>
            <a href="#">FAQs</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span className="footer-copy">&copy; 2027 Saarang, IIT Madras. All rights reserved.</span>
        <div className="footer-socials">
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">X / Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;