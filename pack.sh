#!/bin/sh

yuglify -c src/*.js && mv src/bar.js.min.js ./euterpe.js
