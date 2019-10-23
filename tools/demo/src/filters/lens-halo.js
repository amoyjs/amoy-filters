export default function() {
    const app = this;
    app.addFilter('AmoyLensHaloFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            const filter = this;
            const domElement = document.querySelector("#container");
            let initWidth = domElement.offsetWidth;
            let initHeight = domElement.offsetHeight;
            
            folder.add(this, 'posx', 0, initWidth);
            folder.add(this, 'posy', 0, initHeight);

            app.events.on('animate', function() {
                filter.uniforms.uTime += 0.01;
            });
        }
    });
}
