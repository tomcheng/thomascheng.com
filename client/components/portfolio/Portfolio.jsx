import React from 'react/addons';

import Piece from './Piece.jsx';
import pieces from 'data/portfolio.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        {pieces.map((piece) => (
          <Piece key={piece.slug} {...piece} />
        ))}
      </div>
    );
  }
});
