export default function() {
    const app = this;
    app.addFilter('AmoyReflectionFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            const filter = this;
        }
    });
}
