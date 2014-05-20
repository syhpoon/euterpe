var stage = new Kinetic.Stage({
    container: 'canvas',
    width: 1300,
    height: 500
});

var scale = 7.5;
var layer = new Kinetic.Layer();
var measure = new Euterpe.Measure({x: 50,
    y: 50,
    scale: scale,
    leftBarType: "double bold",
    rightBarType: "double bold",
    measureLength: 150
});
var note1 = new Euterpe.Note({
        beamDirection: 'up',
        scale: scale,
        x: measure.line2.x() + measure.leftBarWidth + 20 * scale,
        y: measure.line2.y(),
        type: "half"
    });
var note2 = new Euterpe.Note({
    beamDirection: 'up',
    scale: scale,
    x: measure.line4.x() + 60 * scale,
    y: measure.line4.y(),
    type: "quarter",
    flags: 1
});

var note3 = new Euterpe.Note({
    scale: scale,
    x: measure.line1.x() + 100 * scale,
    y: measure.line1.y(),
    type: "whole"
});

var time = new Euterpe.TimeSignature({
    x: 55.6 * scale,
    y: 9.6 * scale,
    scale: scale,
    numerator: "4"
});

//var clef = new Euterpe.TrebleClef({y: measure.line2.y(), x: 20});

layer.add(measure.group);
layer.add(time.group);
//layer.add(note1.group);
//layer.add(note2.group);
//layer.add(note3.group);

note1.group.moveToBottom();
note2.group.moveToBottom();
note3.group.moveToBottom();

stage.add(layer);

initEditor(stage);




