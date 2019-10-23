export default function() {
    const app = this;
    app.addFilter('AmoyMosaicFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            folder.add(this, 'tileSize', 32, 64);
        }
    });
}
