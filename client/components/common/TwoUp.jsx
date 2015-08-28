import React from "react";
import classNames from "classnames";

export default React.createClass({
  propTypes: {
    after: React.PropTypes.object.isRequired,
    annotations: React.PropTypes.array,
    before: React.PropTypes.object.isRequired,
    description: React.PropTypes.string,
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  },

  render() {
    const {before, after, annotations, title, description} = this.props;

    return (
      <div>
        <div className="push-bottom-xs">
          <h4>{title}</h4>
          {description ? <div>{description}</div> : null}
        </div>

        <div className="row">
          <div className="col-sm-6">
            <img className="two-up__image" src={before.url} />
          </div>
          <div className="col-sm-6">
            <img className="two-up__image" src={after.url} />
          </div>
        </div>
      </div>
    );
  }
});

const constrain = (value, min, max) => Math.min(Math.max(value, min), max);
