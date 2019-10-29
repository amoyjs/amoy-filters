export default function() {
    const app = this;
    app.addFilter('AmoyPixelVibrationFilter', {
        enabled: false,
        global: false,
        opened: false,
        fishOnly: true,
        oncreate(folder) {
            folder.add(this, 'intensity', 3, 6);
            folder.add(this, 'blursize', 2, 6);
            folder.add(this, 'threshold', 0, 1);
        }
    });
}
