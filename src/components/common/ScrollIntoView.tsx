import { Component, type ReactNode } from "react";
import Animations from "../../utils/animations";
import { cubicInOut } from "../../utils/easings";

type ScrollIntoViewProps = {
  children: ReactNode;
  isActive: boolean;
};

class ScrollIntoView extends Component<ScrollIntoViewProps> {
  containerEl: HTMLDivElement | null = null;

  componentDidUpdate(prevProps: ScrollIntoViewProps) {
    const { isActive } = this.props;

    if (prevProps.isActive || !isActive) {
      return;
    }

    if (!this.containerEl) return;
    const { top, height } = this.containerEl.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const outOfViewTop = top < 100;
    const outOfViewBottom = top + height > windowHeight - 100;

    if (outOfViewTop) {
      Animations.animate({
        name: "window",
        duration: 300,
        easing: cubicInOut,
        start: window.scrollY,
        end: window.scrollY + top - 100,
        onUpdate: scrollTop => {
          window.scrollTo(0, scrollTop);
        }
      });
    } else if (outOfViewBottom) {
      Animations.animate({
        name: "window",
        duration: 300,
        easing: cubicInOut,
        start: window.scrollY,
        end: window.scrollY + top + height - windowHeight + 100,
        onUpdate: scrollTop => {
          window.scrollTo(0, scrollTop);
        }
      });
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div
        ref={el => {
          this.containerEl = el;
        }}
      >
        {children}
      </div>
    );
  }
}

export default ScrollIntoView;
