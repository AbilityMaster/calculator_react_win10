import React, { Component } from 'react';
import { MAX_WIDTH_DISPLAY } from '../../const';
import PropTypes from 'prop-types';

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
            let width = this.$smallDisplay.current.scrollWidth;
            this.$smallDisplay.current.scrollTo(width, 0);
        }
    }

    btnMoveLeft = () => {
        let width = this.$smallDisplay.current.scrollWidth;
        this.$smallDisplay.current.scrollTo(0, width);
    }

    btnMoveRight = () => {
        let width = this.$smallDisplay.current.scrollWidth;
        this.$smallDisplay.current.scrollTo(width, 0);
    }

    renderLeftButton = () => {
        if (this.$smallDisplay.current && this.$smallDisplay.current.scrollWidth > MAX_WIDTH_DISPLAY) {
            return (
                <div
                    onClick={this.btnMoveLeft}
                    ref={this.$buttonMoveLeft}
                    className="small-display__button small-display__button_left visibility"
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
                    className="small-display__button small-display__button_right visibility" />
            )
        }
        return null;
    }

    render() {
        const { displayHistoryValue } = this.props;

        return (
            <div className="group-small-display js-group-small-display">
                {this.renderLeftButton()}
                <div ref={this.$smallDisplay} className="small-display">{displayHistoryValue}</div>
                {this.renderRightButton()}
            </div>
        )
    }
}