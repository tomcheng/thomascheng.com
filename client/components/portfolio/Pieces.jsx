import React from 'react/addons';

import Piece from './Piece.jsx';

export default React.createClass({
  propTypes: {
    pieces: React.PropTypes.array.isRequired
  },

  render() {
    const {pieces} = this.props;

    return (
      <div className="container">
        {pieces.map((piece) => (
          <Piece
            key={piece.slug}
            {...piece} />
        ))}
      </div>
    );
  }
});
