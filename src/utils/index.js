export default {
    isDescendant: function(parent, child) {
        if (!parent || !child) {
            return false;
        }

        if (parent.nodeType !== 1) {
            return false;
        }

        return parent.contains(child);
    },
    format: function(format) {
        var args = Array.prototype.slice.call(arguments, 1);

        return format.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                ? args[number] 
                : match;
        });
    }
}