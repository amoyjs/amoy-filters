export default function() {
    const app = this;
    const domElement = document.querySelector("#container");
    let initWidth = domElement.offsetWidth;
    let initHeight = domElement.offsetHeight;

    app.addFilter('AmoyFluidFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {

        }
    });
}
