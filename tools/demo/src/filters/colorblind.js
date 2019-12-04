export default function() {
    const app = this;
    app.addFilter('AmoyColorblindFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {
            folder.add(this, 'blindType', 1, 8, 1);
        }
    });
}
