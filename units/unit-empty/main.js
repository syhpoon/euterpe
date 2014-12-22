var scale = 1;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

var plugins = [
    new Euterpe.PluginAccidentals(),
    new Euterpe.PluginAboveBelow(),
    new Euterpe.PluginTab(),
    new Euterpe.PluginNoteText(),
    new Euterpe.PluginAlign({
        totalWidth: width - 100,
        nodeMargin: 20,
        sideMargin: 10
    }),
    new Euterpe.PluginNoteBar()
];

var root = new Euterpe.Score({
    title: 'Empty unit',
    musicBy:'None',
    tuning:'Guitar standard tuning',
    titleMargin:50,
    musicByMargin:50,
    tuningMargin:50,
    lineMargin:50,
    items: [
        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    number: 1,
                    rightType: "single"
                }),

                new Euterpe.TrebleClef({}),
                new Euterpe.TimeSignature(),

                new Euterpe.Bar({
                    rightType: "single"
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 0, width, scale, 'canvas', plugins);

stage.draw();
