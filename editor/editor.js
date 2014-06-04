function initEditor(stage) {
    var currentMousePos = { x: -1, y: -1 };
    var layer = new Kinetic.Layer();

    stage.add(layer);

    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    function randomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $("#bezier").click(function() {
        var points = [];

        var update = function(cid) {
            var line = new Kinetic.Shape({
                name: "curve-"+cid,
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    ctx.bezierCurveTo(points[1].x, points[1].y,
                        points[2].x, points[2].y,
                        points[3].x, points[3].y);
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                    //ctx.closePath();
                    //ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1
            });

            layer.add(line);
            stage.draw();
        };

        var draw = function() {
            points.push(JSON.parse(JSON.stringify(currentMousePos)));

            if(points.length == 4) {
                $(this).css("cursor", "auto");
                $(this).off();
                var cid = Math.random().toString(36).substring(7);
                var color = randomColor();

                // Show points
                $.each(points, function(idx, obj) {
                    var p = new Kinetic.Circle({
                        x: obj.x,
                        y: obj.y,
                        radius: 5,
                        fill: color,
                        draggable: true,
                        idx: idx
                    });
                    p.idx = idx;
                    p.cid = cid;

                    p.on("click", function() {
                        console.log(this.x() / scale, this.y() / scale);
                    });

                    p.on('dragmove', function() {
                        stage.get(".curve-"+cid).remove();
                        points[idx] = {x: this.x(), y: this.y()};

                        update(cid);
                    });

                    layer.add(p);
                    stage.draw();
                });

                update(cid);
            }
        };

        $("canvas").css("cursor", "pointer").click(draw);
    });

    $("#line").click(function() {
        var points = [];

        var update = function(cid) {
            var line = new Kinetic.Line({
                name: "line-"+cid,
                points: points,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1
            });

            layer.add(line);
            stage.draw();
        };

        var draw = function() {
            points.push(currentMousePos.x);
            points.push(currentMousePos.y);

            if(points.length == 4) {
                $(this).css("cursor", "auto");
                $(this).off();
                var cid = Math.random().toString(36).substring(7);
                var cid2 = Math.random().toString(36).substring(7);
                var color = randomColor();

                // Show points
                var p1 = new Kinetic.Circle({
                        x: points[0],
                        y: points[1],
                        radius: 5,
                        fill: color,
                        draggable: true,
                        idx: 0
                    });
                p1.idx = 0;
                p1.cid = cid;

                p1.on("click", function() {
                    console.log(this.x()/scale, this.y()/scale);
                });

                p1.on('dragmove', function() {
                    stage.get(".line-"+cid).remove();
                    points[0] = this.x();
                    points[1] = this.y();

                    update(cid);
                });

                var p2 = new Kinetic.Circle({
                    x: points[2],
                    y: points[3],
                    radius: 5,
                    fill: color,
                    draggable: true,
                    idx: 2
                });
                p2.idx = 2;
                p2.cid = cid2;

                p2.on("click", function() {
                    console.log(this.x() / scale, this.y() / scale);
                });

                p2.on('dragmove', function() {
                    stage.get(".line-"+cid2).remove();
                    points[2] = this.x();
                    points[3] = this.y();

                    update(cid2);
                });

                layer.add(p1);
                layer.add(p2);
                stage.draw();
            }

            update(cid);
            update(cid2);
        };

        $("canvas").css("cursor", "pointer").click(draw);
    });
}