import React from 'react';

export default React.createClass({
  render() {
    return (
      <div>
        <h2 ref="title">404. Not found.</h2>
        <p><a href="/">Go to home page</a></p>
      </div>
    );
  }
});
