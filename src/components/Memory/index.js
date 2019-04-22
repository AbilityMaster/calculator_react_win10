import React, { Component } from 'react';
import MemoryBlock from '../MemoryBlock';


export default class Memory extends Component {




    render() {
        const { memoryValues } = this.props;
        const { isOpenMemoryWindow } = this.props;
        const { displayValue } = this.props;
        const { updateLocalStorage } = this.props;
        const { clearItemFromMemoryBoard } = this.props;
        
        let classProperties = "memory js-memory";

       const memoryElements = memoryValues.map((memory) =>
            <MemoryBlock clearItemFromMemoryBoard={clearItemFromMemoryBoard} updateLocalStorage={updateLocalStorage} displayValue={displayValue} key={memory.id} memory={memory} />
        );

        if (isOpenMemoryWindow) {
            classProperties += ` visibility`
        } else {
            classProperties = "memory js-memory";
        }
        
        return (
            <div className={classProperties}>
              {memoryElements}
            </div>
        )
    }
}