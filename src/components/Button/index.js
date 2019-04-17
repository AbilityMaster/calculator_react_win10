import React, { Component } from 'react';

export default class Button extends Component {
    render() {
        const { style } = this.props.btnSettings;
        let { dataAttribute } = this.props.btnSettings;
        
        if (dataAttribute === 'number' || dataAttribute === 'operation') {
            dataAttribute = this.props.children;
        }

        return (
                <div className={ style } data-type = { dataAttribute }>{ this.props.children }</div>
        )
    }
}