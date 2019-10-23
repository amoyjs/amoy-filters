
export default function() {
    const app = this;
    const nextPageTexture = this.resources.background.texture;

    app.addFilter('AmoyPageCurlFilter', {
        enabled: false,
        global: false,
        opened: false,
        args:[0, 0, 0, 0, nextPageTexture],
        oncreate(folder) {
            const filter = this;
            const domElement = document.querySelector("#container");
            let initWidth = domElement.offsetWidth;
            let initHeight = domElement.offsetHeight;
            
            folder.add(this, 'posx', 0, initWidth);
            folder.add(this, 'posy', 0, initHeight);

            folder.add(this, 'startPosx', 0, initWidth);
            folder.add(this, 'startPosy', 0, initHeight);
        }
    });
}
