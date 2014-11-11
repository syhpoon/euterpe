var scale = 1;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
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
);

var root = new Euterpe.Score({
    title: 'Por Una Cabeza',
    musicBy:'Carlos Gardel and Alfredo Le Pera',
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


                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            flags: 1,
                            location: 7.5,
                            bar: 'begin',
                            bar_id: 'b1'
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            flags: 1,
                            location: 4,
                            bar: 'cont',
                            bar_id: 'b1',
                            dots: 1,
                            text: '1',
                            leftItems: [
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Sharp({})]
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            flags: 1,
                            location: 5.5,
                            bar: 'end',
                            bar_id: 'b1'
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
