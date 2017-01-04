class SelectionManager {
    getNextNode(node) {
        let next = node.firstChild;
        if (next) {
            return next;
        }

        while (node) {
            if ((next = node.nextSibling)) {
                return next;
            }
            node = node.parentNode;
        }
    }

    getNodesInRange(range) {
        let start = range.startContainer;
        let end = range.endContainer;
        let ancestor = range.commonAncestorContainer;
        const nodes = [];
        let node;

        for (node = start.parentNode; node; node = node.parentNode) {
            nodes.push(node);
            if (node == ancestor) {
                break;
            }
        }

        nodes.reverse();

        for (node = start; node; node = this.getNextNode(node)) {
            nodes.push(node);
            if (node == end) {
                break;
            }
        }

        return nodes;
    }

    getNodeIndex(node) {
        let i = 0;
        while ((node = node.previousSibling)) {
            i++;
        }
        return i;
    }

    isCharacterDataNode(node) {
        const type = node.nodeType;
        return type == 3 || type == 4 || type == 8;
    }

    insertAfter(node, precedingNode) {
        const nextNode = precedingNode.nextSibling;
        const parent = precedingNode.parentNode;

        if (nextNode) {
            parent.insertBefore(node, nextNode);
        } else {
            parent.appendChild(node);
        }
        return node;
    }

    splitDataNode(node, index) {
        const newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        this.insertAfter(newNode, node);
        return newNode;
    }

    splitRangeBoundaries(range) {
        let startContainer = range.startContainer;
        let startOffset = range.startOffset;
        let endContainer = range.endContainer;
        let endOffset = range.endOffset;

        const startEndSame = (startContainer === endContainer);

        if (this.isCharacterDataNode(endContainer) &&
            endOffset > 0 &&
            endOffset < endContainer.length) {
            this.splitDataNode(endContainer, endOffset);
        }

        if (this.isCharacterDataNode(startContainer) &&
            startOffset > 0 &&
            startOffset < startContainer.length) {
            startContainer = this.splitDataNode(startContainer, startOffset);
            if (startEndSame) {
                endOffset -= startOffset;
                endContainer = startContainer;
            } else if (endContainer == startContainer.parentNode &&
                       endOffset >= this.getNodeIndex(startContainer)) {
                endOffset++;
            }
            startOffset = 0;
        }

        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
    }

    getTextNodesInRange(range) {
        const textNodes = [];
        const nodes = this.getNodesInRange(range);
        for (let i = 0, node; node = nodes[i++]; ) {
            if (node.nodeType == 3) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }

    surroundRangeContents(range, templateElement) {
        this.splitRangeBoundaries(range);
        const textNodes = this.getTextNodesInRange(range);
        if (textNodes.length == 0) {
            return;
        }

        for (let i = 0, node, el; node = textNodes[i++];) {
            if (node.nodeType == 3) {
                el = templateElement.cloneNode(false);
                node.parentNode.insertBefore(el, node);
                el.appendChild(node);
            }
        }

        range.setStart(textNodes[0], 0);
        const lastTextNode = textNodes[textNodes.length - 1];
        range.setEnd(lastTextNode, lastTextNode.length);
    }

    highlight(range, className) {
        const templateElement = document.createElement("span");
        templateElement.className = className;

        this.surroundRangeContents(range, templateElement);    
    }

    exportSelection(container) {
        let range = window.getSelection().getRangeAt(0);
        let preSelectionRange = range.cloneRange();

        preSelectionRange.selectNodeContents(container);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        
        const start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
    }

    importSelection(container, selection) {
        let charIndex = 0;
        const range = document.createRange();

        range.setStart(container, 0);
        range.collapse(true);

        const nodeStack = [container];
        let node;
        let foundStart = false;
        let stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                const nextCharIndex = charIndex + node.length;

                if (!foundStart &&
                    selection.start >= charIndex &&
                    selection.start <= nextCharIndex) {
                    range.setStart(node, selection.start - charIndex);
                    foundStart = true;
                }

                if (foundStart && 
                    selection.end >= charIndex && 
                    selection.end <= nextCharIndex) {
                    range.setEnd(node, selection.end - charIndex);
                    stop = true;
                }

                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i-- > 0) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        return range;
    }
}

export default SelectionManager;