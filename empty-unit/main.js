var scale = 1.5;
var margin = 40;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar(),
    new Euterpe.PluginAccidentals(),
    new Euterpe.PluginNoteText(),
    new Euterpe.PluginAboveBelow(),
    new Euterpe.PluginAlign({
        totalWidth: width - 100,
        nodeMargin: 20
    })
    /*
    new Euterpe.PluginTab(),
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

                new Euterpe.TrebleClef({}),
                new Euterpe.TimeSignature(4, 4, {}),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 0.5
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            text: "2",
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 2.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 1.5
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 2.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 0.5
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 7.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 1.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            text: "4",
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 1
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 7.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "begin",
                            beamDirection: "up",
                            type: "quarter",
                            location: 0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            bar: "end",
                            beamDirection: "up",
                            type: "quarter",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "single"
                })
            ]
        }),

        new Euterpe.Row({
            group: "1",
            groupType: "bracket",
            type: "tab",
            items: [
                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "1",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 0
                        }),

                        new Euterpe.Text({
                            text: "0",
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "2",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "1",
                            location: 1
                        }),

                        new Euterpe.Text({
                            text: "0",
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "2",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "1",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 0
                        }),

                        new Euterpe.Text({
                            text: "0",
                            location: 5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 1
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

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "3",
                            location: 1
                        }),

                        new Euterpe.Text({
                            text: "0",
                            location: 5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "0",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Text({
                            text: "1",
                            location: 0
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
