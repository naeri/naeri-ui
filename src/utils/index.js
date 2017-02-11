function isDescendant(parent, child) {
    if (!parent || !child) {
        return false;
    }

    if (parent.nodeType !== 1) {
        return false;
    }

    return parent.contains(child);
}

function format(format) {
    const args = Array.prototype.slice.call(arguments, 1);

    return format.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number] 
            : match;
    });
}

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export {
    isDescendant,
    format,
    hexToRgb
}