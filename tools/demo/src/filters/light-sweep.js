export default function() {
    const app = this;
    app.addFilter('AmoyLightSweepFilter', {
        enabled: false,
        global: false,
        opened: false,
        fishOnly: true,
        oncreate(folder) {
            const filter = this;
            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });
        }
    });
}
