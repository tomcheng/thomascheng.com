import React from 'react';
import classNames from 'classnames';

const topOffset = 20;

export default React.createClass({
  getInitialState() {
    return {
      atTop: true
    }
  },

  componentDidMount() {
    document.addEventListener("scroll", this._onScroll);
  },

  componentWillUnmount() {
    document.removeEventListner("scroll", this._onScroll)
  },

  _onScroll() {
    const scrollTop = document.getElementsByTagName('body')[0].scrollTop

    this.setState({
      atTop: scrollTop < topOffset
    });
  },

  render() {
    const svgTag = '<svg class="header__logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" xml:space="preserve"><g><path d="M39.5 33.2h-9.9v-7.6H22c-2.6 0-3.9 1.1-3.9 3.4 0 1.7 0.8 3.1 2.5 4.4h-14C4.7 30.5 3.8 27.1 3.8 23c0-4.4 1.3-8.1 3.9-11.1 2.6-3 6.2-4.5 10.8-4.5h11.1V0l20.1 25.6H39.5V33.2z"/><path d="M10.6 2.4c0 1.3-1.3 1.5-1.6 1.5 -0.3 0-0.6-0.2-0.6-0.6C8.3 2.6 8.3 1.6 7.3 1.6c-0.7 0-1.7 0.7-2.7 2.1 -1.1 1.6-2.1 4.2-2.1 6.6C2.4 12 3 12.5 3.8 12.5c1.1 0 2.2-0.8 3.5-2 0.3 0 0.5 0.2 0.4 0.5 -1.3 1.6-3.3 3-5.3 3 -1.3 0-2.4-0.9-2.4-3.4 0-2.1 1.3-5.7 4.1-8.3 1.3-1.2 2.7-1.9 4.2-1.9C9.8 0.5 10.6 1.4 10.6 2.4z"/></g></svg>';
    const headerClasses = classNames({
      "header": true,
      "header--scrolled": !this.state.atTop
    });

    return (
      <div>
        <div className={headerClasses}>
          <div className="container">
            <div className="header__inner">
              <div dangerouslySetInnerHTML={{__html: svgTag}} />
              <div className="header__content">
                <div className="header__name">Thomas Cheng</div>
                <div className="header__position">UI/UX Designer &amp; Front-End Developer</div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-spacer" />
      </div>
    );
  }
});
