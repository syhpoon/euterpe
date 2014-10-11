var scale = 1;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar(),
    new Euterpe.PluginAccidentals(),
    new Euterpe.PluginNoteText(),
    new Euterpe.PluginAboveBelow(),
    new Euterpe.PluginTab(),
    new Euterpe.PluginAlign({
        totalWidth: width - 100,
        nodeMargin: 20,
        sideMargin: 10
    })
);

var root = new Euterpe.Score({
    lineMargin: 50,
    items: [
        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    number: 10,
                    leftType: "single"
                }),

                //new Euterpe.TrebleClef({}),
                new Euterpe.TimeSignature(4, 4, {}),

                new Euterpe.Column({
                    leftMargin: 3,
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "single"
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 0, width, scale, 'canvas');

stage.draw();
