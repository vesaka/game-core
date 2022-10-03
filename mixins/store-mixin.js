export default {
    game_init() {

    },
    $save(key, value) {
        this.$store.commit('model', {key, value});
    },
    $clear(key) {
        this.$store.commit('model', {key, value: null});
    }
    
}


