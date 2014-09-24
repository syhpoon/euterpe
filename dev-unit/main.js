var scale = 2;
var margin = 40;
var width = 1300;

//Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar()
    /*
     new Euterpe.PluginNoteText({rightMargin: 5}),
     new Euterpe.PluginAccidentals({rightMargin: 5}),
     new Euterpe.PluginAboveBelow(),
     new Euterpe.PluginTab(),
     new Euterpe.PluginAlignMultiline()
     new Euterpe.PluginPackMeasures({
     measuresPerLine: 4,
     totalWidth: width - 100
     })
     */
);

var root = new Euterpe.Score({
    lineMargin: 5,
    items: [
        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    leftType: "single",
                    number: 1
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
                            beamDirection: "up",
                            type: "quarter",
                            location: 7
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 6.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 5.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 4.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 3.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 3
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 2.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: 1.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: 0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: -0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: -1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: -1.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "down",
                            location: -2
                        })
                    ]
                }),

                new Euterpe.Bar({
                    rightType: "single",
                    leftType: "double",
                    number: 2
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 3,
                            bar: "begin"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 4,
                            bar: "end"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 1,
                            bar: "begin"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: -0.5,
                            bar: "end"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 1.5,
                            bar: "begin"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 0,
                            bar: "cont"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: -0.5,
                            bar: "cont"
                        })
                    ]
                }),
                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 3,
                            bar: "end"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 1.5,
                            bar: "begin"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 0,
                            bar: "cont"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: -0.5,
                            bar: "cont"
                        })
                    ]
                }),
                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 3,
                            bar: "end"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 0,
                            bar: "begin"
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 1.5,
                            bar: "end"
                        })
                    ]
                }),

                new Euterpe.Bar({
                    rightType: "double"
                })
            ]
        }),

        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    leftType: "double bold",
                    number: 3
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Flat({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Text({
                                    text: "ABCZZZZZZZZZZZZZZ"
                                })
                            ],
                            rightItems: [
                                new Euterpe.Flat({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Text({
                                    text: "ABCZZZZZZZZZZZZZZ"
                                })
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: -1,
                            location: 0,
                            tab_text: "0",
                            tab_location: 2
                        }),
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Sharp({}),
                                new Euterpe.Text({
                                    text: "12345"
                                }),
                                new Euterpe.Flat({})
                            ],
                            rightItems: [
                                new Euterpe.Sharp({}),
                                new Euterpe.Text({
                                    text: "12345"
                                }),
                                new Euterpe.Flat({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: -1,
                            location: 2,
                            tab_text: "0",
                            tab_location: 2
                        })
                    ]
                }),
                new Euterpe.Bar({
                    rightType: "double bold"
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 0, width, scale, 'canvas');

stage.draw();
