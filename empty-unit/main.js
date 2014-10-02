var scale = 1;
var margin = 40;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar(),
    new Euterpe.PluginAccidentals(),
    new Euterpe.PluginNoteText(),
    new Euterpe.PluginAboveBelow()
    /*
    new Euterpe.PluginTab(),
    new Euterpe.PluginAlignMultiline()
    new Euterpe.PluginPackMeasures({
        measuresPerLine: 4,
        totalWidth: width - 100
    })
    */
);

var root = new Euterpe.Score({
    items: [
        new Euterpe.Row({
            group: "1",
            groupType: "bracket",
            type: "measure",
            items: [
                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.TrebleClef({})
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.TimeSignature(4, 4, {})
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Bar({
                    rightType: "single"
                })
            ]
        }),

        new Euterpe.Row({
            group: "1",
            type: "tab",
            items: [
                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 3
                        }),

                        new Euterpe.Text({
                            text: "1",
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "1",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Bar({
                    rightType: "single"
                })
            ]
        }),

        new Euterpe.Row({
            group: "1",
            groupType: "bracket",
            type: "measure",
            items: [
                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.TrebleClef({})
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.TimeSignature(4, 4, {})
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Bar({
                    rightType: "single"
                })
            ]
        }),

        new Euterpe.Row({
            group: "2",
            type: "tab",
            items: [
                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 3
                        }),

                        new Euterpe.Text({
                            text: "1",
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "1",
                            location: 1
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
