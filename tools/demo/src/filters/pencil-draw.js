export default function() {
    const app = this;
    app.addFilter('AmoyPencilDrawFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            folder.add(this, 'colorThreshold', 0, .5);
        }
    });
}
