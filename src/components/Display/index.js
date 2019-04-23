import React, { Component } from 'react';
import { STYLES } from '../../const';
import PropTypes from 'prop-types';

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
        const classNames = ['display'];

        if (displayFontSize === STYLES.SMALL) {
            classNames.push('display_small');

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
