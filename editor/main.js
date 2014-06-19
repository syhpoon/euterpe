var scale = 2;
var margin = 10 * scale;

Euterpe.plugins.add(new Euterpe.PluginNoteBar());

var root = new Euterpe.Score({
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
                    location: {
                        "Euterpe.Measure": {
                            line: 1.5
                        }
                    }
                }),

                new Euterpe.Note({
                    leftMargin: margin,
                    rightMargin: margin,
                    bar: "end",
                    beamDirection: "up",
                    type: "quarter",
                    flags: 1,
                    location: {
                        "Euterpe.Measure": {
                            line: 1
                        }
                    }
                })
            ]
        }),

        /*
        null,
        new Euterpe.Measure({
            number: 2,
            leftBarType: "none",
            items: [
                new Euterpe.VAlignLeft({
                    items: [
                        null,
                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "up",
                            location: {
                                "Euterpe.Measure": {
                                    line: 1.5
                                }
                            }
                        }),

                        null,
                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: {
                                "Euterpe.Measure": {
                                    line: 7
                                }
                            }
                        })
                    ]
                }),

                null,

                new Euterpe.NoteGroup({
                    items: [
                        new Euterpe.HBox({
                            items: [
                                null,

                                new Euterpe.Note({
                                    beamDirection: "up",
                                    type: "quarter",
                                    flags: 1,
                                    bar: "begin",
                                    location: {
                                        "Euterpe.Measure": {
                                            line: 3.5
                                        }
                                    }
                                }),

                                5,
                                new Euterpe.Text({
                                    text: "2"
                                })
                            ]
                        }),

                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            bar: "end",
                            location: {
                                "Euterpe.Measure": {
                                    line: 3
                                }
                            }
                        })
                    ]
                }),

                new Euterpe.VAlignLeft({
                    items: [
                        new Euterpe.NoteGroup({
                            items: [
                                null,

                                new Euterpe.Note({
                                    type: "quarter",
                                    beamDirection: "up",
                                    flags: 1,
                                    location: {
                                        "Euterpe.Measure": {
                                            line: 2.5
                                        }
                                    }
                                }),

                                new Euterpe.Note({
                                    type: "quarter",
                                    flags: 1,
                                    beamDirection: "up",
                                    location: {
                                        "Euterpe.Measure": {
                                            line: 3.5
                                        }
                                    }
                                })
                            ]
                        }),

                        null,

                        new Euterpe.Note({
                            type: "half",
                            beamDirection: "down",
                            location: {
                                "Euterpe.Measure": {
                                    line: 7
                                }
                            }
                        }),
                    ]
                }),

                new Euterpe.NoteGroup({
                    items: [
                        null,

                        new Euterpe.Note({
                            type: "quarter",
                            beamDirection: "up",
                            flags: 1,
                            location: {
                                "Euterpe.Measure": {
                                    line: 1.5
                                }
                            }
                        }),

                        new Euterpe.Note({
                            type: "quarter",
                            flags: 1,
                            beamDirection: "up",
                            location: {
                                "Euterpe.Measure": {
                                    line: 1
                                }
                            }
                        })
                    ]
                }),

                "default"
            ]
        })
        */
    ]
});

var stage = new Kinetic.Stage({
    container: 'canvas',
    width: 1300,
    height: 600
});

var layer = new Kinetic.Layer();

stage.add(layer);

root.prepare(100, 170, scale, layer);

stage.draw();

initEditor(stage);
