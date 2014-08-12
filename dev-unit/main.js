var scale = 1;
var margin = 40;
var width = 1300;

Euterpe.global.loglevel = Euterpe.const.LOG_DEBUG;

Euterpe.plugins.add(
    new Euterpe.PluginNoteBar(),
    new Euterpe.PluginNoteText({rightMargin: 5}),
    new Euterpe.PluginAccidentals({rightMargin: 5}),
    new Euterpe.PluginAboveBelow(),
    new Euterpe.PluginPackMeasures({
        measuresPerLine: 4,
        totalWidth: width - 100
    })
);

var root = new Euterpe.Score({
    leftMargin: margin,
    items: [
        new Euterpe.Measure({
            number: 1,
            items: [
                new Euterpe.TrebleClef({leftMargin: margin}),

                new Euterpe.TimeSignature(4, 4, {leftMargin: margin}),

                new Euterpe.Note({
                    leftMargin: margin,
                    bar: "begin",
                    beamDirection: "up",
                    type: "quarter",
                    flags: 1,
                    location: 0.5
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    bar: "end",
                    beamDirection: "up",
                    type: "quarter",
                    flags: 1,
                    location: 0
                })
            ]
        }),

        new Euterpe.Measure({
            number: 2,
            leftBarType: "none",
            items: [
                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "up",
                            location: 0.5
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    text: "2",
                    beamDirection: "up",
                    type: "quarter",
                    flags: 1,
                    bar: "begin",
                    location: 2.5
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    beamDirection: "up",
                    type: "quarter",
                    flags: 1,
                    bar: "end",
                    location: 2
                }),

                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            bar: "begin",
                            type: "quarter",
                            beamDirection: "up",
                            flags: 1,
                            location: 1.5
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    bar: "end",
                    type: "quarter",
                    beamDirection: "up",
                    flags: 1,
                    location: 2.5
                }),


                new Euterpe.Note({
                    leftMargin: margin,
                    type: "quarter",
                    beamDirection: "up",
                    bar: "begin",
                    flags: 1,
                    location: 0.5
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    type: "quarter",
                    flags: 1,
                    bar: "end",
                    beamDirection: "up",
                    location: 0
                })
            ]
        }),

        new Euterpe.Measure({
            number: 3,
            leftBarType: "none",
            items: [
                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "up",
                            location: 0.5
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 7.5
                        })
                    ]
                }),

                new Euterpe.Note({
                    bar: "begin",
                    flags: 1,
                    leftMargin: margin,
                    beamDirection: "up",
                    type: "quarter",
                    location: 2
                }),
                new Euterpe.Note({
                    bar: "end",
                    flags: 1,
                    leftMargin: margin,
                    beamDirection: "up",
                    type: "quarter",
                    location: 1.5
                }),

                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            text: "4",
                            bar: "begin",
                            type: "quarter",
                            beamDirection: "up",
                            flags: 1,
                            location: 1
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 7.5
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    bar: "end",
                    type: "quarter",
                    beamDirection: "up",
                    flags: 1,
                    location: 2
                }),

                new Euterpe.Note({
                    bar: "begin",
                    flags: 1,
                    leftMargin: margin,
                    beamDirection: "up",
                    type: "quarter",
                    location: 0.5
                }),
                new Euterpe.Note({
                    rightMargin: margin,
                    bar: "end",
                    flags: 1,
                    leftMargin: margin,
                    beamDirection: "up",
                    type: "quarter",
                    location: 0
                })

            ]
        }),

        new Euterpe.Measure({
            number: 4,
            leftBarType: "none",
            items: [
                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "up",
                            location: 0.5
                        }),
                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 7.5
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    type: "quarter",
                    beamDirection: "up",
                    bar: "begin",
                    location: 2
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    type: "quarter",
                    beamDirection: "up",
                    bar: "end",
                    location: 1.5
                }),

                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            text: "4",
                            type: "quarter",
                            beamDirection: "up",
                            location: 1
                        }),

                        new Euterpe.Note({
                            beamDirection: "down",
                            type: "half",
                            location: 7.5
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    beamDirection: "up",
                    bar: "begin",
                    type: "quarter",
                    location: 0.5
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    beamDirection: "up",
                    bar: "end",
                    type: "quarter",
                    location: 0
                })

            ]
        }),

        new Euterpe.Measure({
            number: 5,
            leftBarType: "none",
            items: [
                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "up",
                            dots: 1,
                            location: 0.5
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    type: "half",
                    beamDirection: "down",
                    location: 6
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    text: "3",
                    bar: "begin",
                    type: "quarter",
                    beamDirection: "up",
                    location: -1
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    text: "4",
                    sharp: 1,
                    bar: "end",
                    type: "quarter",
                    beamDirection: "up",
                    location: -1
                })
            ]
        }),

        new Euterpe.Measure({
            number: 6,
            leftBarType: "none",
            items: [
                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            text: "3",
                            type: "quarter",
                            beamDirection: "up",
                            location: -1
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Note({
                    bar: "begin",
                    leftMargin: margin,
                    type: "quarter",
                    flags: 1,
                    beamDirection: "up",
                    location: 0.5
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    text: "1",
                    bar: "end",
                    type: "quarter",
                    flags: 1,
                    beamDirection: "up",
                    location: 0
                }),

                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            text: "3",
                            bar: "begin",
                            type: "quarter",
                            beamDirection: "up",
                            location: -1
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 6
                        })
                    ]
                }),

                new Euterpe.Note({
                    bar: "end",
                    leftMargin: margin,
                    type: "quarter",
                    flags: 1,
                    beamDirection: "up",
                    location: 0.5
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    text: "1",
                    bar: "begin",
                    type: "quarter",
                    beamDirection: "up",
                    location: -1
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    text: "2",
                    sharp: 1,
                    bar: "end",
                    type: "quarter",
                    beamDirection: "up",
                    location: -1
                })
            ]
        }),

        new Euterpe.Measure({
            number: 7,
            leftBarType: "none",
            items: [
                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            text: "1",
                            type: "quarter",
                            beamDirection: "up",
                            location: -1
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 4.5
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    text: "3",
                    bar: "begin",
                    type: "quarter",
                    flags: 1,
                    beamDirection: "up",
                    location: 1,
                    above: [
                        new Euterpe.StringNumber({string: 3})
                    ]
                }),

                new Euterpe.Note({
                    bar: "end",
                    type: "quarter",
                    flags: 1,
                    leftMargin: margin,
                    beamDirection: "up",
                    location: 0.5
                }),

                new Euterpe.VBox({
                    leftMargin: margin,
                    items: [
                        new Euterpe.Note({
                            text: "2",
                            bar: "begin",
                            type: "quarter",
                            beamDirection: "up",
                            location: 0,
                            above: [
                                new Euterpe.StringNumber({string: 2})
                            ]
                        }),

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: 4.5
                        })
                    ]
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    text: "1",
                    bar: "end",
                    type: "quarter",
                    flags: 1,
                    beamDirection: "up",
                    location: -1
                }),

                new Euterpe.Note({
                    text: "4",
                    leftMargin: margin,
                    bar: "begin",
                    type: "quarter",
                    beamDirection: "up",
                    location: -0.5,
                    above: [new Euterpe.StringNumber({string: 2})]
                }),

                new Euterpe.Note({
                    text: "2",
                    rightMargin: margin,
                    leftMargin: margin,
                    bar: "end",
                    type: "quarter",
                    beamDirection: "up",
                    location: 0,
                    above: [new Euterpe.StringNumber({string: 2})]
                })
            ]
        })
    ]
});

var stage = Euterpe.render(root, 0, 170, width, scale, 'canvas');

stage.draw();
