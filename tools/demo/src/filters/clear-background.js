export default function() {
    const app = this;
    app.addFilter('AmoyClearBackgroundFilter', {
        enabled: false,
        global: false,
        opened: false,
        fishOnly:true,
        oncreate(folder) {
            const filter = this;
            var palette = {
                _color :[filter.color.r, filter.color.g, filter.color.b],
                set color(data){
                    this._color = [ data[0], data[1], data[2] ];
                    filter.color = {r:data[0]/255., g:data[1]/255., b:data[2]/255.};
                },
                get color(){
                    return this._color;
                }, // RGB array
            };
            folder.addColor(palette, 'color');

        }
    });
}
