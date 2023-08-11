import React from "react";
import PropTypes from "prop-types";

class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo(0, navbarHeight);
        }
    }

    render() {
        return this.props.children;
    }
}

export default ScrollToTop;

ScrollToTop.propTypes = {
    location: PropTypes.object,
    children: PropTypes.any
};
