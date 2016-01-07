var sparkContext = new SparkContext("local[*]", "dstream");
var streamingContext = null;
var duration = new Duration(500);
var data = [];

var foreachRDDTest = function() {
    streamingContext = new StreamingContext(sparkContext, duration);
    var dstream = streamingContext.socketTextStream("localhost", 9999);
    dstream.foreachRDD(function(rdd) {
        var d = rdd.collect();
        if(!d.isEmpty()) {
            var letters = d.get(0).split(",");
            letters.forEach(function(l) {
                data.push(l);
            });
        }
    })

    streamingContext.start();
}

var flatMapTest = function() {
    streamingContext = new StreamingContext(sparkContext, duration);
    var dstream = streamingContext.socketTextStream("localhost", 9999);
    var ds1 = dstream.flatMap(function(line) {
        return line.split(",");
    })

    ds1.foreachRDD(function(rdd) {
        var d = rdd.collect();
        if(!d.isEmpty()) {
            d.forEach(function(letter) {
                data.push(letter)
            })
        }
    })

    streamingContext.start();
}

var flatMapToPairTest = function() {
    streamingContext = new StreamingContext(sparkContext, duration);
    var dstream = streamingContext.socketTextStream("localhost", 9999);
    var ds1 = dstream.flatMapToPair(function(line) {
        var ret = [];
        var arr = line.split(",");
        arr.forEach(function(letter) {
            ret.push([letter,1]);
        })

        return ret;
    })

    ds1.foreachRDD(function(rdd) {
        var d = rdd.collect();
        if(!d.isEmpty()) {
            d.forEach(function(letter) {
                data.push(letter)
            })
        }
    })

    streamingContext.start();
}

var mapTest = function() {
    streamingContext = new StreamingContext(sparkContext, duration);
    var dstream = streamingContext.socketTextStream("localhost", 9999);
    var ds1 = dstream.flatMap(function(line) {
        return line.split(",");
    });

    var ds2 = ds1.map(function(letter){
        return letter.toUpperCase();
    });

    ds2.foreachRDD(function(rdd) {
        var d = rdd.collect();
        if(!d.isEmpty()) {
            d.forEach(function(letter) {
                data.push(letter)
            })
        }
    })

    streamingContext.start();
}

var stop = function() {
    streamingContext.stop(false);
    streamingContext.awaitTermination();
};

var getData = function() {
    return data.join(",");
};

