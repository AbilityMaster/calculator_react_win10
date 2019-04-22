import React, { Component } from 'react';
import MemoryBlock from '../MemoryBlock';
import PropTypes from 'prop-types';

export default class Memory extends Component {
    static propTypes = {
        clearItemFromMemoryBoard: PropTypes.func,
        updateLocalStorage: PropTypes.func,
        displayValue: PropTypes.string,
        isOpenMemoryWindow: PropTypes.bool,
        memoryValues: PropTypes.array
    }

    static defailtProps = {
        clearItemFromMemoryBoard: () => {},
        updateLocalStorage: () => {},
        displayValue: '',
        isOpenMemoryWindow: false,
        memoryValues: []
    }

    render() {
        const { memoryValues } = this.props;
        const { isOpenMemoryWindow } = this.props;
        const { displayValue } = this.props;
        const { updateLocalStorage } = this.props;
        const { clearItemFromMemoryBoard } = this.props;

        let classProperties = "memory";

        const memoryElements = memoryValues.map((memory) =>
            <MemoryBlock
                clearItemFromMemoryBoard={clearItemFromMemoryBoard}
                updateLocalStorage={updateLocalStorage}
                displayValue={displayValue}
                key={memory.id}
                memory={memory}
            />
        );

        if (isOpenMemoryWindow) {
            //
            classProperties += ` visibility`
        } else {
            classProperties = "memory";
        }

        return (
            <div className={classProperties}>
                {memoryElements}
            </div>
        )
    }
}