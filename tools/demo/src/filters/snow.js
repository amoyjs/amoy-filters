export default function() {
    const app = this;
    app.addFilter('AmoySnowFilter', {
        enabled: false,
        global: false,
        opened: false,
        args:[false, 0],
        oncreate(folder) {
            const filter = this;
            const domElement = document.querySelector("#container");

            folder.add(this, 'blizard');

            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });
        }
    });
}
