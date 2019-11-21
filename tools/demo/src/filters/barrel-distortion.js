export default function() {
    const app = this;
    app.addFilter('AmoyBarrelDistortionFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            folder.add(this, 'barrelPower', 0, 2.);
        }
    });
}
