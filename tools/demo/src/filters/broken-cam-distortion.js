export default function() {
    const app = this;
    app.addFilter('AmoyBrokenCamDistortionFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            const filter = this;

            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });
        }
    });
}
