import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class Button extends Component {
    static propTypes = {
        isOpenMemoryWindow: PropTypes.bool,
        isDisabledMemoryButtons: PropTypes.bool,
        isDisabledMemoryButtonsAll: PropTypes.bool,
        btnSettings: PropTypes.object,
        isDisabled: PropTypes.bool
    }

    static defaultProps = {
        isOpenMemoryWindow: false,
        isDisabledMemoryButtons: false,
        btnSettings: {},
        isDisabled: false,
        isDisabledMemoryButtonsAll: false
    }
    
    get classNames() {
        const { isDisabled, isDisabledMemoryButtons, isOpenMemoryWindow, isDisabledMemoryButtonsAll } = this.props;
        const { classes } = this.props;
        const classNames = [classes];
        
        if (isDisabledMemoryButtonsAll) { 
            classNames.push('calculator__memory-button_disabled');
        }
        
        if (isDisabledMemoryButtons) {
            classNames.push('calculator__memory-button_disabled');
        }

        if (isDisabled) {
            classNames.push('calculator__button_disabled');
        }

        if (isOpenMemoryWindow) {
            classNames.push('calculator__memory-button_disabled');
        }

        return classNames.join(' ');
    }
    
    render() {   
        const { dataAttributes } = this.props;
        const { onClick } = this.props;

        return (
            <div
                onClick={onClick}
                className={this.classNames}
                data-type={dataAttributes}
            >{this.props.children}</div>
        )
    }
}