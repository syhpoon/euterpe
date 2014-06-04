var scale = 2;

var root = new Euterpe.Score({
    items: [
        new Euterpe.Measure({
            number: 1,
            items: [
                new Euterpe.TrebleClef(),

                new Euterpe.TimeSignature({
                    numerator: "4",
                    denominator: "4"
                }),

                null,

                new Euterpe.NoteGroup({
                    items: [
                        new Euterpe.Note({
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
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: {
                                "Euterpe.Measure": {
                                    line: 1
                                }
                            }
                        }),

                        "default"
                    ]
                })
            ]
        }),

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
                                    line: 5
                                }
                            }
                        })
                    ]
                }),

                null,

                new Euterpe.NoteGroup({
                    items: [
                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
                            location: {
                                "Euterpe.Measure": {
                                    line: 3.5
                                }
                            }
                        }),

                        new Euterpe.Note({
                            beamDirection: "up",
                            type: "quarter",
                            flags: 1,
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
                                    line: 5
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
    ]
});

var stage = new Kinetic.Stage({
    container: 'canvas',
    width: 1300,
    height: 600
});

var layer = new Kinetic.Layer();

stage.add(layer);

root.pack(100, 170, scale, layer);

stage.draw();

initEditor(stage);
