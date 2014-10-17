var scale = 4;
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
    items: [
        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    number: 1,
                    rightType: "single"
                }),

                new Euterpe.TrebleClef({}),
                new Euterpe.TimeSignature(4, 4, {}),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Natural({}),
                                new Euterpe.Sharp({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 3
                        })
                    ]
                }),

                new Euterpe.Bar({
                    rightType: "single"
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 0, width, scale, 'canvas');

stage.draw();
