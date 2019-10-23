export default function() {
    const app = this;
    app.addFilter('AmoyLight2dFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            const domElement = document.querySelector("#container");
            let initWidth = domElement.offsetWidth;
            let initHeight = domElement.offsetHeight;
            
            folder.add(this, 'posx', 0, initWidth);
            folder.add(this, 'posy', 0, initHeight);
        }
    });
}
