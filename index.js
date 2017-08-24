Error.stackTraceLimit = Infinity;
var parseArgs = require('minimist');
var args = parseArgs(process.argv);
const Profiler = require('./Profiler');

global.Gun = require('gun/gun');

require('gun-db');
//var vfs = require('sack.vfs' );
//var vol = vfs.Volume( "Mount", "data.vfs" );
//require('gun-file');

let getSmallNode = function() {
    return {
        one: 'one',
        two: 'two',
        three: 'three',
        four: 'four',
        five: 'five',
        six: 'six',
        seven: 'seven',
        eight: 'eight',
        nine: 'nine',
        ten: 'ten'
    };
}

let getMediumNode = function() {
    let node = {};
    let keyPrefix = "prop";
    let val = "medium_property"
    for (var i = 0; i < 1000; i++) {
        node[`${keyPrefix}_${i}`] = val;
    }
    return node;
};

let getLargeNode = function() {
    let node = {};
    let keyPrefix = "prop";
    let val = "large_property"
    for (var i = 0; i < 10000; i++) {
        node[`${keyPrefix}_${i}`] = val;
    }
    return node;
};


let runMedium = () => {
    if (!args['skip-medium']) {
        let medium = new Profiler("__ Medium Nodes: 1000 Properties Each __", getMediumNode(), 100);
        medium.run(runLarge);
    } else {
        runLarge();
    }
}

let runLarge = () => {
    if (!args['skip-large']) {
        let large = new Profiler("__ Large Nodes: 10000 Properties Each __", getLargeNode(), 10);
        large.run(finished);
    } else {
        finished();
    }
}

if (!args['skip-small']) {
    let small = new Profiler("__ Small Nodes: 10 Properties Each __ ", getSmallNode(), 10000);
    small.run(runMedium);
} else {
    runMedium();
}

var finished = () => {
    // anchor vol so it doesn't garbage collect
    if( vol ) vol.Sqlite( "finshed.db" );
    console.log( "done?" );
}
