import React from "react";

export const DEFAULT_TOOLTIP = {
    title: "Press 'V' to View, Others to Edit",
    content: (
        <React.Fragment>
            Press <span className="bg-white text-dark px-1 rounded fw-bold mx-1">V</span> to View, Others to Edit
        </React.Fragment>
    )
};

export const getTooltipTitle = (tooltip) => {
    return (tooltip && typeof tooltip === 'object') ? (tooltip.title || "") : (tooltip || "");
};

class ChipTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tooltipPosition: "top" };
        this.tooltipRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.show) {
            window.addEventListener('scroll', this.handleScroll, true);
            this.handleScroll();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.show !== prevProps.show) {
            if (this.props.show) {
                window.addEventListener('scroll', this.handleScroll, true);
                this.handleScroll();
            } else {
                window.removeEventListener('scroll', this.handleScroll, true);
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, true);
    }

    handleScroll = () => {
        const { show, containerRef } = this.props;
        if (show && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            let threshold = 50;
            if (this.tooltipRef.current) threshold = this.tooltipRef.current.offsetHeight + 10;
            const position = rect.top < threshold ? "bottom" : "top";
            if (position !== this.state.tooltipPosition) this.setState({ tooltipPosition: position });
        }
    };

    render() {
        const { tooltip, show } = this.props;
        const { tooltipPosition } = this.state;
        if (!show || !tooltip) return null;
        const content = tooltip && typeof tooltip === 'object' ? (tooltip.content || tooltip) : tooltip;
        return (
            <div className="position-relative w-100">
                <div ref={this.tooltipRef} className="position-absolute bg-dark text-white px-2 py-1 rounded small shadow" style={{ ...(tooltipPosition === "top" ? { bottom: "15px" } : { top: "15px" }), zIndex: 1050, minWidth: "210px", transform: "translateX(-50%)" }}>{content}</div>
            </div>
        );
    }
}

export default ChipTooltip;
