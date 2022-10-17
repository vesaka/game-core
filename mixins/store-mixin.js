export default {
    game_init() {

    },
    $save(key, value) {
        this.$store[key] = value;
    },
    $clear(key) {
        this.$store[key] = null;
    }
    
}


