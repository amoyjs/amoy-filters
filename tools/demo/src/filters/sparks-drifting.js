export default function() {
    const app = this;
    const domElement = document.querySelector("#container");
    let initWidth = domElement.offsetWidth;
    let initHeight = domElement.offsetHeight;

    app.addFilter('AmoySparksDriftingFilter', {
        enabled: false,
        global: false,
        opened: false,
        args:[initHeight, initWidth/3., 2.0],
        oncreate(folder) {
            const filter = this;
            folder.add(this, 'width', initWidth/3., initWidth);
            folder.add(this, 'strength', 2, 5);
            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });
        }
    });
}
