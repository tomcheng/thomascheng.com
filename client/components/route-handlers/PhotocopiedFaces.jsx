import React from 'react';

export default React.createClass({
  render() {
    return (
      <div>
        <div className="push-bottom-sm">
          These images were produced by rolling and smearing my face along the glass as the photocopied was scanning.
        </div>
        {faces.map((face, i) => (
          <img
            key={i}
            className="push-bottom-sm"
            style={{ width: "100%" }}
            src={require("images/photocopied-faces/" + face)} />
        ))}
      </div>
    );
  }
});

const faces = [
  'pcface1.jpg',
  'pcface2.jpg',
  'pcface3.jpg',
  'pcface4.jpg',
  'pcface5.jpg',
  'pcface6.jpg',
  'pcface7.jpg'
];
