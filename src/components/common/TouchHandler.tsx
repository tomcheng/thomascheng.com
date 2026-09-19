import React, { Component, type ReactNode } from "react";

export type DragEvent = {
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  direction: "left" | "right" | "up" | "down";
  x: number;
  y: number;
  preventDefault: () => void;
};

export type DragReleaseEvent = {
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
};

type TouchHandlerProps = {
  children: ReactNode;
  stopPropagation: boolean;
  onDrag: (evt: DragEvent) => void;
  onDragRelease: (evt: DragReleaseEvent) => void;
  onTap: () => void;
};

type TouchPoint = { x: number; y: number; time: number };
type LastPoint = TouchPoint & { velocityX: number; velocityY: number };

type TouchHandlerState = {
  start: TouchPoint | null;
  last: LastPoint | null;
  hasDragged: boolean;
  isTouched: boolean;
};

class TouchHandler extends Component<TouchHandlerProps, TouchHandlerState> {
  static defaultProps: Pick<
    TouchHandlerProps,
    "onDrag" | "onDragRelease" | "onTap" | "stopPropagation"
  > = {
    onDrag: () => {},
    onDragRelease: () => {},
    onTap: () => {},
    stopPropagation: false
  };

  state: TouchHandlerState = {
    start: null,
    last: null,
    hasDragged: false,
    isTouched: false
  };

  cancelIsTouched: ReturnType<typeof setTimeout> | undefined;

  getCurrentTime = () => new Date().getTime();

  handleTouchStart = (evt: React.TouchEvent<HTMLDivElement>) => {
    const x = evt.touches[0].clientX;
    const y = evt.touches[0].clientY;
    const time = this.getCurrentTime();

    if (this.props.stopPropagation) evt.stopPropagation();

    this.setState({
      start: { x, y, time },
      last: { x, y, time, velocityX: 0, velocityY: 0 },
      isTouched: true
    });

    if (this.cancelIsTouched) {
      clearTimeout(this.cancelIsTouched);
    }

    this.cancelIsTouched = setTimeout(() => {
      this.setState({ isTouched: false });
    }, 1000);
  };

  handleTouchMove = (evt: React.TouchEvent<HTMLDivElement>) => {
    const x = evt.touches[0].clientX;
    const y = evt.touches[0].clientY;
    const time = this.getCurrentTime();
    const { start, last, hasDragged } = this.state;
    if (!start || !last) return;

    const deltaX = x - start.x;
    const deltaY = y - start.y;
    const velocityX = (x - last.x) / (time - last.time);
    const velocityY = (y - last.y) / (time - last.time);

    let direction: DragEvent["direction"];

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? "right" : "left";
    } else {
      direction = deltaY > 0 ? "down" : "up";
    }

    this.props.onDrag({
      deltaX,
      deltaY,
      velocityX,
      velocityY,
      direction,
      x,
      y,
      preventDefault: evt.preventDefault.bind(evt)
    });

    if (!hasDragged) {
      if (Math.abs(deltaX) >= 2 || Math.abs(deltaY) >= 2) {
        this.setState({ hasDragged: true });
      }
    }

    this.setState({ last: { x, y, velocityX, velocityY, time } });
  };

  handleTouchEnd = () => {
    const { last, start, hasDragged } = this.state;
    if (!last || !start) return;

    const { velocityX, velocityY } = last;
    const deltaX = last.x - start.x;
    const deltaY = last.y - start.y;

    if (hasDragged) {
      this.props.onDragRelease({ deltaX, deltaY, velocityX, velocityY });
    } else {
      this.props.onTap();
    }

    this.setState({
      start: null,
      last: null,
      hasDragged: false
    });
  };

  handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.stopPropagation) {
      evt.stopPropagation();
    }
    if (!this.state.isTouched) {
      this.props.onTap();
    }
  };

  render() {
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export default TouchHandler;
