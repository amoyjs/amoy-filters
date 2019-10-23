export default function() {
    const app = this;
    app.addFilter('AmoyRainfallFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            const filter = this;

            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });

            folder.add(this, 'rainR', 2, 10);
        }
    });
}
