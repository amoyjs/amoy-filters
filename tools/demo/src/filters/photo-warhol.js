export default function() {
    const app = this;
    app.addFilter('AmoyWarholFilter', {
        enabled: false,
        global: false,
        opened: false,
        oncreate(folder) {

        }
    });
}