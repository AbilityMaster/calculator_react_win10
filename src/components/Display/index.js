import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Display extends Component {
    constructor() {
        super();
        this.$display = React.createRef();
    }

    static propTypes = {
        value: PropTypes.string,
        styleDisplay: PropTypes.string
    };

    static defaultProps = {
        value: ''
    };

    render() {
        const { value } = this.props;
        const { styleDisplay } = this.props;

        return <div ref={this.$display} style={{ 'display': styleDisplay }} className="display js-display">{value}</div>;
    }
}
