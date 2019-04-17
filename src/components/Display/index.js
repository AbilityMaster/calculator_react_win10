import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Display extends Component {
    static propTypes = {
        value: PropTypes.string
    };
    
    static defaultProps = {
        value: ''
    };

    render() {
        const { value } = this.props;

        return <div className="display js-display">{value}</div>;
    }
}
