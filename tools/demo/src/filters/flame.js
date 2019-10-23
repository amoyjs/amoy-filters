export default function() {
    const app = this;
    const domElement = document.querySelector("#container");
    let initWidth = domElement.offsetWidth;
    let initHeight = domElement.offsetHeight;

    app.addFilter('AmoyFlameFilter', {
        enabled: false,
        global: false,
        opened: false,
        args:[initWidth/2., initHeight/2., 1.0],
        oncreate(folder) {
            const filter = this;
            folder.add(this, 'posx', 0., initWidth);
            folder.add(this, 'posy', 0., initHeight);
            folder.add(this, 'strength', 1, 5);
            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });
        }
    });
}
