import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { STYLES } from '../../const';

export default class Display extends Component {
    static propTypes = {
        value: PropTypes.string,
        displayFontSize: PropTypes.string
    };

    static defaultProps = {
        value: '',
        displayFontSize: 'normal'
    };

    get classes() {
        const { displayFontSize } = this.props;
        const classNames = ['calculator__display'];

        if (displayFontSize === STYLES.SMALL) {
            classNames.push('calculator__display_small');

            return classNames.join(' ');
        }

        return classNames.join(' ');
    }
    
    render() {        
        const { value } = this.props;

        return ( 
            <div 
                className={this.classes}
            >
                {value}
            </div> 
        );
    }
}
