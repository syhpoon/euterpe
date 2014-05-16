//
// Euterpe.js
//
// Max E. Kuznetsov <mek@mek.uz.ua>
// Copyright MuzMates 2014

function Euterpe() {};

// Get the object value by key or default if undefined
Euterpe.get_config = function(config, name, defaultVal) {
    if(typeof config === 'undefined')
        return defaultVal;

    return typeof config[name] === 'undefined' ? defaultVal : config[name];
}

