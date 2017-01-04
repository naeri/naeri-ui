export default {
    isDescendant: function(parent, child) {
        if (!parent || !child) {
            return false;
        }

        if (parent.nodeType !== 1) {
            return false;
        }

        return parent.contains(child);
    }
}