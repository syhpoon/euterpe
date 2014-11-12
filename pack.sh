#!/bin/sh

J=("src/version.js" \
   "src/core.js" \
   "src/container.js" \
   "src/node.js" \
   "src/row.js" \
   "src/column.js" \
   "src/bar.js" \
   "src/text.js" \
   "src/rest.js" \
   "src/string-number.js" \
   "src/key-signature.js" \
   "src/plugin.js" \
   "src/plugin-note-bar.js" \
   "src/plugin-note-text.js" \
   "src/plugin-accidentals.js" \
   "src/plugin-above-below.js" \
   "src/plugin-tab.js" \
   "src/plugin-align.js" \
   "src/helpers.js" \
   "src/score.js" \
   "src/note.js" \
   "src/clef.js" \
   "src/sharp.js" \
   "src/flat.js" \
   "src/natural.js" \
   "src/time-signature.js" \
   "src/time-signature-shape.js")

uglifyjs ${J[@]} --comments -c -m -o euterpe-min.js &&
uglifyjs ${J[@]} --comments -b -o euterpe.js
