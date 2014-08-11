var scale = 3;
var margin = 20;
var width = 1300;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar(),
    new Euterpe.PluginNoteText({rightMargin: 5}),
    new Euterpe.PluginAboveBelow()
);
/*
Euterpe.plugins.add(new Euterpe.PluginPackMeasures({
    measuresPerLine: 1,
    totalWidth: width - 100
}));
*/

var root = new Euterpe.Score({
    leftMargin: margin,
    items: [
        new Euterpe.Measure({
            number: 1,
            items: [
                new Euterpe.TrebleClef({leftMargin: margin}),
                new Euterpe.TimeSignature(4, 4, {
                    leftMargin: margin
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 250, width, scale, 'canvas');

stage.draw();

initEditor(stage);
