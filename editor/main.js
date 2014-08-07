var scale = 3;
var margin = 20;
var width = 1300;

Euterpe.plugins.add(new Euterpe.PluginNoteBar());
Euterpe.plugins.add(new Euterpe.PluginAboveBelow());
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

var stage = new Kinetic.Stage({
    container: 'canvas',
    width: width,
    height: 700
});

Euterpe.render(root, 0, 250, scale, stage);

stage.draw();

initEditor(stage);
