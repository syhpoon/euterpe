var scale = 3;
var margin = 20;
var width = 1300;

/*
Euterpe.plugins.add(new Euterpe.PluginNoteBar());
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
                }),
                new Euterpe.Note({
                    leftMargin: margin,
                    beamDirection: "up",
                    type: "half",
                    flags: 1,
                    location: 6
                }),
                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    beamDirection: "up",
                    type: "half",
                    flags: 1,
                    location: 7
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

Euterpe.render(root, 0, 130, scale, stage);

stage.draw();

initEditor(stage);
