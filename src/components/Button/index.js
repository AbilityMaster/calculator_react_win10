import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class Button extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        classes: PropTypes.string,
    }

    static defaultProps = {
        onClick: () => {},
        classes: ''
    }

    render() {   
        const { dataAttributes, onClick, classes } = this.props;

        return (
            <div
                onClick={onClick}
                className={classes}
                data-type={dataAttributes}
            >{this.props.children}</div>
        )
    }
}