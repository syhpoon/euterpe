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
        sideMargin: 5
    })
);

var root = new Euterpe.Score({
    title: 'Sample unit',
    titleMargin: 50,
    musicByMargin: 50,
    tuningMargin: 50,
    musicBy: 'Some dude',
    tuning: 'Guitar standard tuning',
    lineMargin: 10,
    items: [
        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    rightType: "single",
                    number: 1
                }),

                new Euterpe.TrebleClef({}),
                new Euterpe.TimeSignature({}),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "7",
                            tab_location: 5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 7
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "6.5",
                            tab_location: 5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 6.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "6",
                            tab_location: 5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "5.5",
                            tab_location: 5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 5.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "5",
                            tab_location: 5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "4.5",
                            tab_location: 4.5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 4.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "4",
                            tab_location: 4,
                            beamDirection: "up",
                            type: "quarter",
                            location: 4
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "3.5",
                            tab_location: 3.5,
                            beamDirection: "up",
                            type: "quarter",
                            location: 3.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "3",
                            tab_location: 3,
                            beamDirection: "up",
                            type: "quarter",
                            location: 3
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "2.5",
                            tab_location: 2,
                            beamDirection: "up",
                            type: "quarter",
                            location: 2.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "2",
                            tab_location: 2,
                            beamDirection: "down",
                            type: "quarter",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "1.5",
                            tab_location: 1.5,
                            type: "quarter",
                            beamDirection: "down",
                            location: 1.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "1",
                            tab_location: 1,
                            type: "quarter",
                            beamDirection: "down",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "0.5",
                            tab_location: 0.5,
                            type: "quarter",
                            beamDirection: "down",
                            location: 0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "0",
                            tab_location: 0,
                            type: "quarter",
                            beamDirection: "down",
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "0.5",
                            tab_location: 0,
                            type: "quarter",
                            beamDirection: "down",
                            location: -0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "1",
                            tab_location: 0,
                            type: "quarter",
                            beamDirection: "down",
                            location: -1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "1.5",
                            tab_location: 0,
                            type: "quarter",
                            beamDirection: "down",
                            location: -1.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "2",
                            tab_location: 0,
                            type: "quarter",
                            beamDirection: "down",
                            location: -2
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "single",
                    rightType: "double",
                    number: 2
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            tab_text: "3",
                            tab_location: 3,
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
                            tab_text: "4",
                            tab_location: 4,
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
                            tab_text: "1",
                            tab_location: 1,
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
                            tab_text: "0.5",
                            tab_location: 0,
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
                            tab_text: "1.5",
                            tab_location: 1.5,
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
                            tab_text: "0",
                            tab_location: 0,
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
                            tab_text: "0.5",
                            tab_location: 0,
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
                            tab_text: "3",
                            tab_location: 3,
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
                            tab_text: "1.5",
                            tab_location: 1.5,
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
                            tab_text: "0",
                            tab_location: 0,
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
                            tab_text: "0.5",
                            tab_location: 0,
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
                            tab_text: "3",
                            tab_location: 3,
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
                            tab_text: "0",
                            tab_location: 0,
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
                            tab_text: "1.5",
                            tab_location: 1.5,
                            beamDirection: "down",
                            type: "quarter",
                            location: 1.5,
                            bar: "end"
                        })
                    ]
                }),

                new Euterpe.Bar({
                    leftType: "double"
                })
            ]
        }),

        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    rightType: "double bold",
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
                            tab_location: 1
                        })
                    ]
                }),
                new Euterpe.Bar({
                    number: 4,
                    leftType: "double bold",
                    rightType: "repeat"
                }),

                new Euterpe.Column({
                    aboveItems: [
                        new Euterpe.Sharp({}),
                        new Euterpe.StringNumber({string: 1}),
                        new Euterpe.Text({text: "ZZZ"})
                    ],
                    belowItems: [
                        new Euterpe.Text({text: "ABC"}),
                        new Euterpe.Sharp({}),
                        new Euterpe.Text({text: "WTF"}),
                        new Euterpe.StringNumber({string: 1})
                    ],
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 0,
                            tab_text: "0",
                            tab_location: 1
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 5,
                            tab_text: "0",
                            tab_location: 3
                        })
                    ]
                }),
                new Euterpe.Column({
                    aboveItems: [
                        new Euterpe.Sharp({}),
                        new Euterpe.StringNumber({string: 4})
                    ],
                    belowItems: [
                        new Euterpe.Text({text: "ABC"}),
                        new Euterpe.Sharp({}),
                        new Euterpe.Text({text: "WTF111111111111111111111111"}),
                        new Euterpe.StringNumber({string: 1})
                    ],
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            location: 2,
                            tab_text: "0",
                            tab_location: 3
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "quarter",
                            location: 3,
                            tab_text: "0",
                            tab_location: 0
                        })
                    ]
                }),

                new Euterpe.Note({
                    beamDirection: "up",
                    type: "quarter",
                    location: 3
                }),

                new Euterpe.Bar({
                    leftType: "repeat"
                })
            ]
        }),

        new Euterpe.Row({
            type: "measure",
            items: [
                new Euterpe.Bar({
                    number: 5,
                    rightType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "long",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "double_whole",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "whole",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "half",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "quarter",
                            location: 2
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "eighth",
                            location: 3
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "sixteenth",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "thirty-second",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Rest({
                            type: "sixty-fourth",
                            location: 1
                        })
                    ]
                }),

                new Euterpe.Bar({
                    number: 6,
                    rightType: "single"
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Natural({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Flat({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: -1
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Natural({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Flat({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: -0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Natural({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Flat({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 0
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Natural({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Flat({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 0.5
                        })
                    ]
                }),

                new Euterpe.Column({
                    items: [
                        new Euterpe.Note({
                            leftItems: [
                                new Euterpe.Natural({}),
                                new Euterpe.Sharp({}),
                                new Euterpe.Flat({})
                            ],
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: 1
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
