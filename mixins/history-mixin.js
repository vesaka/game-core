export default {
        data() {
            return {
                history: []
            };
        },
        addEntry(entry) {
            this.history.push(entry)
        },
        clearAll() {
            this.history = [];
        },
        clearLast(n = 1) {
            this.history.splice(0, -n);
        },
        clearFirst(n = 1) {
            this.history.splice(0, n);
        },
        lastEntry() {
            return this.history[this.history.length - 1];
        }
}