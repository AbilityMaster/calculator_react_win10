import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MAX_WIDTH_DISPLAY } from '../../const';

export default class HistoryDisplay extends Component {
    static propTypes = {
        displayHistoryValue: PropTypes.string
    }

    static defaultProps = {
        displayHistoryValue: ''
    }

    constructor() {
        super();
        this.$smallDisplay = React.createRef();
    }

    componentDidUpdate() {
        if (this.$smallDisplay.current && this.$smallDisplay.current.scrollWidth > 300) {
            const width = this.$smallDisplay.current.scrollWidth;

            this.$smallDisplay.current.scrollTo(width, 0);
        }
    }

    btnMoveLeft = () => {
        const width = this.$smallDisplay.current.scrollWidth;

        this.$smallDisplay.current.scrollTo(0, width);
    }

    btnMoveRight = () => {
        const width = this.$smallDisplay.current.scrollWidth;

        this.$smallDisplay.current.scrollTo(width, 0);
    }

    renderLeftButton = () => {
        if (this.$smallDisplay.current && this.$smallDisplay.current.scrollWidth > MAX_WIDTH_DISPLAY) {
            return (
                <div
                    onClick={this.btnMoveLeft}
                    ref={this.$buttonMoveLeft}
                    className="calculator__history-button calculator__history-button_move-left visibility"
                />
            )
        }
        return null;
    }

    renderRightButton = () => {
        if (this.$smallDisplay.current && this.$smallDisplay.current.scrollWidth > MAX_WIDTH_DISPLAY) {
            return (
                <div
                    onClick={this.btnMoveRight}
                    ref={this.$buttonMoveLeft}
                    className="calculator__history-button calculator__history-button_move-right visibility" />
            )
        }
        return null;
    }

    render() {
        const { displayHistoryValue } = this.props;

        return (
            <div className="calculator__history">
                {this.renderLeftButton()}
                <div ref={this.$smallDisplay} className="calculator__history-display">{displayHistoryValue}</div>
                {this.renderRightButton()}
            </div>
        )
    }
}