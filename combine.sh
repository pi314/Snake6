#!/usr/bin/sh
python combine.py _main.js > main.js
python combine.py _main.css > main.css

mv main.js res
mv main.css res
