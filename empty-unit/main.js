var scale = 2;
var margin = 40;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar(),
    new Euterpe.PluginNoteText({rightMargin: 5}),
    new Euterpe.PluginAccidentals({rightMargin: 5}),
    new Euterpe.PluginAboveBelow(),
    new Euterpe.PluginTab(),
    new Euterpe.PluginAlignMultiline()
    /*
    new Euterpe.PluginPackMeasures({
        measuresPerLine: 4,
        totalWidth: width - 100
    })
    */
);

var root = new Euterpe.Score({
    leftMargin: margin,
    items: [
        new Euterpe.Measure({
            number: 1,
            items: [
                new Euterpe.TrebleClef({leftMargin: margin}),

                new Euterpe.TimeSignature(4, 4, {leftMargin: margin}),

                new Euterpe.VBox({
                    leftMargin: margin,
                    rightMargin: margin,
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 0.5,
                            tab_text: "0",
                            tab_location: 2
                        }),

                        new Euterpe.Note({
                            leftMargin: margin,
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 2,
                            tab_text: "2",
                            tab_location: 3
                        })
                    ]
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 0, width, scale, 'canvas');

stage.draw();
