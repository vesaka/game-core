const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default {
    game_init() {
        this.onResize();
        window.addEventListener('resize', this.onResize.bind(this));
        
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
    },
    onResize() {
        const {camera, canvas, renderer, width, height} = this;
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        canvas.style.width = `${sizes.width}px`;
        canvas.style.height = `${sizes.height}px`;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        this.$emit('window_resize', camera.aspect);
    }
}
