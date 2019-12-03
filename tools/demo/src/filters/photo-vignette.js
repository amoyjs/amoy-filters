export default function() {
    const app = this;
    app.addFilter('AmoyVignetteFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {

        }
    });
}