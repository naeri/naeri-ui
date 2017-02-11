function getNextNode(node) {
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

function getNodesInRange(range) {
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

    for (node = start; node; node = getNextNode(node)) {
        nodes.push(node);
        if (node == end) {
            break;
        }
    }

    return nodes;
}

function getNodeIndex(node) {
    let i = 0;
    while ((node = node.previousSibling)) {
        i++;
    }
    return i;
}

function isCharacterDataNode(node) {
    const type = node.nodeType;
    return type == 3 || type == 4 || type == 8;
}

function insertAfter(node, precedingNode) {
    const nextNode = precedingNode.nextSibling;
    const parent = precedingNode.parentNode;

    if (nextNode) {
        parent.insertBefore(node, nextNode);
    } else {
        parent.appendChild(node);
    }
    return node;
}

function splitDataNode(node, index) {
    const newNode = node.cloneNode(false);
    newNode.deleteData(0, index);
    node.deleteData(index, node.length - index);
    insertAfter(newNode, node);
    return newNode;
}

function splitRangeBoundaries(range) {
    let startContainer = range.startContainer;
    let startOffset = range.startOffset;
    let endContainer = range.endContainer;
    let endOffset = range.endOffset;

    const startEndSame = (startContainer === endContainer);

    if (isCharacterDataNode(endContainer) &&
        endOffset > 0 &&
        endOffset < endContainer.length) {
        splitDataNode(endContainer, endOffset);
    }

    if (isCharacterDataNode(startContainer) &&
        startOffset > 0 &&
        startOffset < startContainer.length) {
        startContainer = splitDataNode(startContainer, startOffset);
        if (startEndSame) {
            endOffset -= startOffset;
            endContainer = startContainer;
        } else if (endContainer == startContainer.parentNode &&
                    endOffset >= getNodeIndex(startContainer)) {
            endOffset++;
        }
        startOffset = 0;
    }

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
}

function getTextNodesInRange(range) {
    const textNodes = [];
    const nodes = getNodesInRange(range);
    for (let i = 0, node; node = nodes[i++]; ) {
        if (node.nodeType == 3) {
            textNodes.push(node);
        }
    }
    return textNodes;
}

function surroundRangeContents(range, templateElement) {
    splitRangeBoundaries(range);
    const textNodes = getTextNodesInRange(range);
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

function dehighlight(container, className) {
    const elements = container.getElementsByClassName(className);

    for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        const parent = element.parentNode;

        element.childNodes.forEach((child) => {
            parent.insertBefore(child, element);
        });

        parent.removeChild(element);
        parent.normalize();
    }
}

function highlight(range, className, backgroundColor) {
    if (range.collapsed) {
        return;
    }

    const templateElement = document.createElement("span");
    templateElement.className = className;
    templateElement.style.backgroundColor = backgroundColor;

    surroundRangeContents(range, templateElement);    
}

function exportSelection(container) {
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

function importSelection(container, selection) {
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
                selection.start < nextCharIndex) {
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

function selectionContainsContent(selection) {
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
        return false;
    }

    if (selection.toString().trim() === '') {
        return false;
    }

    return true;
}

export { 
    importSelection, 
    exportSelection, 
    highlight, 
    dehighlight,
    selectionContainsContent 
};