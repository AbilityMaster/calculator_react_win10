import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Button extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        className: PropTypes.string,
        dataAttributes: PropTypes.object
    }

    static defaultProps = {
        onClick: () => {},
        className: '',
        dataAttributes: {}
    }

    render() {   
        const { dataAttributes, onClick, className } = this.props;

        return (
            <div
                onClick={onClick}
                className={className}
                { ...dataAttributes }
            >{this.props.children}</div>
        )
    }
}