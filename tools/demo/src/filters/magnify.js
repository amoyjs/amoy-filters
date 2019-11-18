export default function() {
    const app = this;
    app.addFilter('AmoyMagnifyFilter', {
        enabled: false,
        global: false,
        opened: false,
        params:[200,100, 2., 50],
        oncreate(folder) {
            const domElement = document.querySelector("#container");
            let initWidth = domElement.offsetWidth;
            let initHeight = domElement.offsetHeight;
            this.uniforms.uMagnification =  1.2;
            this.uniforms.uLensRadius =  90.;
            
            folder.add(this, 'posx', 100, initWidth);
            folder.add(this, 'posy', 100, initHeight);
        }
    });
}
