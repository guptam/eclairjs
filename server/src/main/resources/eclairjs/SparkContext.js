/*
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {

    var JavaWrapper = require(EclairJS_Globals.NAMESPACE + '/JavaWrapper');
    var Logger = require(EclairJS_Globals.NAMESPACE + '/Logger');
    var Utils = require(EclairJS_Globals.NAMESPACE + '/Utils');
    var SparkConf = require(EclairJS_Globals.NAMESPACE + '/SparkConf');
    var logger = Logger.getLogger("SparkContext_js");

    var initSparkContext = function (conf) {
        /*
        if (typeof kernel !== 'undefined') {
            if (kernel.javaSparkContext() != null) {
                return kernel.javaSparkContext();
            } else {
                kernel.createSparkContext(Utils.unwrapObject(conf));
                return kernel.javaSparkContext();
            }
        }
        */

        /*
         * Create a new JavaSparkContext from a conf
         *
         */
        var jvmSC = new org.apache.spark.api.java.JavaSparkContext(Utils.unwrapObject(conf));

        return jvmSC
    };
    /**
     *
     * @constructor
     * @memberof module:eclairjs
     * @classdesc A JavaScript-friendly version of SparkContext that returns RDDs
     * Only one SparkContext may be active per JVM. You must stop() the active SparkContext before creating a new one.
     * This limitation may eventually be removed; see SPARK-2243 for more details.
     * @param {module:eclairjs.SparkConf} conf - a object specifying Spark parameters
     */
    var SparkContext = function () {
        var jvmObj;
        this.customModsAdded = false; // only add the big zip of all non-core required mods once per SparkContext
        if (arguments.length == 2) {
            var conf = new SparkConf()
            conf.setMaster(arguments[0])
            conf.setAppName(arguments[1])
            jvmObj = initSparkContext(conf)
        } else if (arguments.length == 1 &&
            (arguments[0] instanceof org.apache.spark.api.java.JavaSparkContext)) {
            jvmObj = arguments[0];
        } else {
            jvmObj = initSparkContext(arguments[0])
        }
        JavaWrapper.call(this, jvmObj);
        logger.debug(this.version());
    };

    SparkContext.prototype = Object.create(JavaWrapper.prototype);

//Set the "constructor" property to refer to SparkContext
    SparkContext.prototype.constructor = SparkContext;

    /**
     * Return a copy of this SparkContext's configuration. The configuration ''cannot'' be
     * changed at runtime.
     * @returns {module:eclairjs.SparkConf}
     */
    SparkContext.prototype.getConf = function () {
        var javaObject = this.getJavaObject().getConf();
        return new SparkConf(javaObject);
    };


    /**
     * @returns {string[]}
     */
    SparkContext.prototype.jars = function () {
        return this.getJavaObject().jars();
    };


    /**
     * @returns {string[]}
     */
    SparkContext.prototype.files = function () {
        return this.getJavaObject().files();
    };


    /**
     * @returns {string}
     */
    SparkContext.prototype.master = function () {
        return this.getJavaObject().master();
    };


    /**
     * @returns {string}
     */
    SparkContext.prototype.appName = function () {
        return this.getJavaObject().appName();
    };


    /**
     * @returns {boolean}
     */
    SparkContext.prototype.isLocal = function () {
        return this.getJavaObject().isLocal();
    };

    /**
     * @returns {boolean}  true if context is stopped or in the midst of stopping.
     */
    SparkContext.prototype.isStopped = function () {
        return this.getJavaObject().isStopped();
    };


    /**
     * @returns {SparkStatusTracker}
     */
    SparkContext.prototype.statusTracker = function () {
        var javaObject = this.getJavaObject().statusTracker();
        return Utils.javaToJs(javaObject);
    };


    /**
     * @returns {string}
     * @function
     * @name module:eclairjs.SparkContext#uiWebUrl
     */
     SparkContext.prototype.uiWebUrl = function() {
        return  this.getJavaObject().uiWebUrl();
     };


    /**
     * A unique identifier for the Spark application.
     * Its format depends on the scheduler implementation.
     * (i.e.
     *  in case of local spark app something like 'local-1433865536131'
     *  in case of YARN something like 'application_1433865536131_34483'
     * )
     * @returns {string}
     */
    SparkContext.prototype.applicationId = function () {
        return this.getJavaObject().applicationId();
    };


    /**
     * @returns {string}
     */
    SparkContext.prototype.applicationAttemptId = function () {
        return this.getJavaObject().applicationAttemptId();
    };


    /**
     * @param {string} logLevel  The desired log level as a string.
     * Valid log levels include: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN
     */
    SparkContext.prototype.setLogLevel = function (logLevel) {
        this.getJavaObject().setLogLevel(logLevel);
    };



    /**
      * Set a local property that affects jobs submitted from this thread, such as the Spark fair
      * scheduler pool. User-defined properties may also be set here. These properties are propagated
      * through to worker tasks and can be accessed there via
      * [[org.apache.spark.TaskContext#getLocalProperty]].
      *
      * These properties are inherited by child threads spawned from this thread. This
      * may have unexpected consequences when working with thread pools. The standard java
      * implementation of thread pools have worker threads spawn other worker threads.
      * As a result, local properties may propagate unpredictably.
     * @param {string}
     * @param {string}
     */
    SparkContext.prototype.setLocalProperty = function (key, value) {
        this.getJavaObject().setLocalProperty(key, value);
    };


    /**
     * Get a local property set in this thread, or null if it is missing. See
     * {@link setLocalProperty}.
     * @param {string}
     * @returns {string}
     */
    SparkContext.prototype.getLocalProperty = function (key) {
        return this.getJavaObject().getLocalProperty(key);
    };


    /**
     * @param {string}
     */
    SparkContext.prototype.setJobDescription = function (value) {
        this.getJavaObject().setJobDescription(value);
    };


    /**
     * Assigns a group ID to all the jobs started by this thread until the group ID is set to a
     * different value or cleared.
     *
     * Often, a unit of execution in an application consists of multiple Spark actions or jobs.
     * Application programmers can use this method to group all those jobs together and give a
     * group description. Once set, the Spark web UI will associate such jobs with this group.
     *
     * The application can also use {@link cancelJobGroup} to cancel all
     * running jobs in this group. For example,
     * @param {string}
     * @param {string}
     * @param {boolean}
     */
    SparkContext.prototype.setJobGroup = function (groupId, description, interruptOnCancel) {
        this.getJavaObject().setJobGroup(groupId, description, interruptOnCancel);
    };


    /**
     * clearJobGroup
     */
    SparkContext.prototype.clearJobGroup = function () {
        this.getJavaObject().clearJobGroup();
    };


    /**
     * Create an {@link Accumulable} shared variable of the given type, to which tasks can "add" values with add.
     * Only the master can access the accumuable's value.
     *
     * @param {object} initialValue
     * @param {module:eclairjs.AccumulableParam} param
     * @param {string} name of  the accumulator for display in Spark's web UI.
     * @returns {module:eclairjs.Accumulable}
     */
    SparkContext.prototype.accumulable = function (initialValue, param, name) {
        var Accumulable = require(EclairJS_Globals.NAMESPACE + '/Accumulable');
        return new Accumulable(initialValue, param, name);

    };
    /**
     * Create an {@link Accumulator}  variable, which tasks can "add" values to using the add method.
     * Only the master can access the accumulator's value.
     *
     * @param {int | float} initialValue
     * @param {string | AccumulableParam} [name] of  the accumulator for display in Spark's web UI. or param.  defaults to FloatAccumulatorParam
     * @param {module:eclairjs.AccumulableParam} [param]  defaults to FloatAccumulatorParam, use only if also specifying name
     * @returns {module:eclairjs.Accumulator}
     */
    SparkContext.prototype.accumulator = function () {
        var Accumulator = require(EclairJS_Globals.NAMESPACE + '/Accumulator');
        var FloatAccumulatorParam = require(EclairJS_Globals.NAMESPACE + '/FloatAccumulatorParam');

        var initialValue = arguments[0];
        var name;
        var param = new FloatAccumulatorParam();
        logger.debug("accumulator " , initialValue);

        if (arguments[1]) {
            if (typeof arguments[1] === "string") {
                name = arguments[1];
                if (arguments[2]) {
                    param = arguments[2];
                }
            } else {
                param = arguments[1];
            }
        }
        return new Accumulator(initialValue, param, name);

    };

        /**
         * Register the given accumulator.  Note that accumulators must be registered before use, or it
         * will throw exception.
         * @param {module:eclairjs/util.AccumulatorV2} acc
         * @param {string} [name]
         * @function
         * @name module:eclairjs.SparkContext#register
         */
         SparkContext.prototype.register = function(acc,name) {
            var acc_uw = Utils.unwrapObject(acc);
            if (name)
             this.getJavaObject().register(acc_uw,name);
            else
             this.getJavaObject().register(acc_uw);
         };

    /**
     * Create an Accumulator integer variable, which tasks can "add" values to using the add method.
     * Only the master can access the accumulator's value.
     * @param {int} initialValue
     * @param {string} name of  the accumulator for display in Spark's web UI.
     * @returns {module:eclairjs.Accumulator}
     */
    SparkContext.prototype.intAccumulator = function (initialValue, name) {
        var Accumulator = require(EclairJS_Globals.NAMESPACE + '/Accumulator');
        var IntAccumulatorParam = require(EclairJS_Globals.NAMESPACE + '/IntAccumulatorParam');

        return new Accumulator(initialValue, new IntAccumulatorParam(), name);

    };
    /**
     * Create an Accumulator float variable, which tasks can "add" values to using the add method.
     * Only the master can access the accumulator's value.
     * @param {float} initialValue
     * @param {string} name of  the accumulator for display in Spark's web UI.
     * @returns {module:eclairjs.Accumulator}
     */
    SparkContext.prototype.floatAccumulator = function (initialValue, name) {
        var Accumulator = require(EclairJS_Globals.NAMESPACE + '/Accumulator');
        var FloatAccumulatorParam = require(EclairJS_Globals.NAMESPACE + '/FloatAccumulatorParam');
        return new Accumulator(initialValue, new FloatAccumulatorParam(), name);

    };
    /**
     *  Add a file to be downloaded with this Spark job on every node. The path passed can be either a local file,
     * a file in HDFS (or other Hadoop-supported filesystems), or an HTTP, HTTPS or FTP URI.
     * To access the file in Spark jobs, use SparkFiles.get(fileName) to find its download location.
     * @param {string} path - Path to the file
     */
    SparkContext.prototype.addFile = function (path) {
        this.getJavaObject().addFile(path);
    };
    /**
     * Adds a JAR dependency for all tasks to be executed on this SparkContext in the future. The path passed can be either a local file, a file in HDFS (or other Hadoop-supported filesystems), or an HTTP, HTTPS or FTP URI.
     * @param {string} path - Path to the jar
     */
    SparkContext.prototype.addJar = function (path) {
        //public void addJar(java.lang.String path)
        this.getJavaObject().addJar(path);
    };
    /**
     * Broadcast a read-only variable to the cluster, returning a Broadcast object for reading it in distributed functions.
     * The variable will be sent to each cluster only once.
     * @param {object} value JSON object.
     * @returns {module:eclairjs/broadcast.Broadcast}
     */
    SparkContext.prototype.broadcast = function (value) {
        //var v = Utils.unwrapObject(value);
        var v = JSON.stringify(value);
        return Utils.javaToJs(this.getJavaObject().broadcast(v));
    };


    /**
     * Returns a list of file paths that are added to resources.
     * @returns {string[]}
     * @function
     * @name module:eclairjs.SparkContext#listFiles
     */
     SparkContext.prototype.listFiles = function() {
        return  this.getJavaObject().listFiles();
     };


    /**
     * Distribute a local Scala collection to form an RDD.
     * @param {array} list
     * @param {integer} [numSlices]
     * @returns {module:eclairjs.RDD}
     */
    SparkContext.prototype.parallelize = function (list, numSlices) {
        //public <T> JavaRDD<T> parallelize(java.util.List<T> list, int numSlices)
        var list_uw = [];
        list.forEach(function (item) {
            list_uw.push(Utils.unwrapObject(item));
            //list_uw.push(Serialize.jsToJava(item));
        });
        if (numSlices) {
            return  Utils.javaToJs(this.getJavaObject().parallelize(list_uw, numSlices));
        } else {
            return  Utils.javaToJs(this.getJavaObject().parallelize(list_uw));
        }

    };


    /**
     * Distribute a local collection to form an RDD.
     * @param {array} list array of Tuple 2
     * @param {integer} numSlices
     * @returns {module:eclairjs.PairRDD}
     */
    SparkContext.prototype.parallelizePairs = function (list, numSlices) {
        //public <T> JavaRDD<T> parallelize(java.util.List<T> list, int numSlices)
        var list_uw = [];
        list.forEach(function (item) {
            list_uw.push(Utils.unwrapObject(item));
        });
        if (numSlices) {
            return Utils.javaToJs(this.getJavaObject().parallelizePairs(list_uw, numSlices));
        } else {
            return Utils.javaToJs(this.getJavaObject().parallelizePairs(list_uw));
        }

    };
    /**
     * Creates a new RDD[Long] containing elements from `start` to `end`(exclusive), increased by
     * `step` every element.
     *
     * @note if we need to cache this RDD, we should make sure each partition does not exceed limit.
     *
     * @param {number} start  the start value.
     * @param {number} end  the end value.
     * @param {number} step  the incremental step
     * @param {number} numSlices  the partition number of the new RDD.
     * @returns {module:eclairjs.RDD}
     */
    SparkContext.prototype.range = function (start, end, step, numSlices) {
        var javaObject = this.getJavaObject().range(start, end, step, numSlices);
        return new Utils.javaToJs(javaObject);
    };


    /**
     * Read a text file from HDFS, a local file system (available on all nodes), or any Hadoop-supported file system URI,
     * and return it as an RDD of Strings.
     * @param {string} path - path to file
     * @param {int} [minPartitions]
     * @returns {module:eclairjs.RDD}
     */
    SparkContext.prototype.textFile = function (path, minPartitions) {
        if (minPartitions) {
            return Utils.javaToJs(this.getJavaObject().textFile(path, minPartitions));
        } else {
            return Utils.javaToJs(this.getJavaObject().textFile(path));
        }

    };


    /**
     * Read a directory of text files from HDFS, a local file system (available on all nodes), or any
     * Hadoop-supported file system URI. Each file is read as a single record and returned in a
     * key-value pair, where the key is the path of each file, the value is the content of each file.
     *
     * <p> For example, if you have the following files:
     * @example
     *   hdfs://a-hdfs-path/part-00000
     *   hdfs://a-hdfs-path/part-00001
     *   ...
     *   hdfs://a-hdfs-path/part-nnnnn
     *
     *
     * Do `var rdd = sparkContext.wholeTextFile("hdfs://a-hdfs-path")`,
     *
     * <p> then `rdd` contains
     * @example
     *   (a-hdfs-path/part-00000, its content)
     *   (a-hdfs-path/part-00001, its content)
     *   ...
     *   (a-hdfs-path/part-nnnnn, its content)
     *
     *
     * @note Small files are preferred, large file is also allowable, but may cause bad performance.
     * @note On some filesystems, `.../path/&#42;` can be a more efficient way to read all files
     *       in a directory rather than `.../path/` or `.../path`
     *
     * @param {string} path  Directory to the input data files, the path can be comma separated paths as the
     *             list of inputs.
     * @param {number} minPartitions  A suggestion value of the minimal splitting number for input data.
     * @returns {module:eclairjs.RDD}
     */
    SparkContext.prototype.wholeTextFiles = function (path, minPartitions) {
        var javaObject = this.getJavaObject().wholeTextFiles(path, minPartitions);
        return  Utils.javaToJs(javaObject);
    };

    /**
     * Set the directory under which RDDs are going to be checkpointed.
     * The directory must be a HDFS path if running on a cluster.
     * @param {string} dir
     */
    SparkContext.prototype.setCheckpointDir = function (dir) {
        this.getJavaObject().setCheckpointDir(dir);
    };

    /**
     * Shut down the SparkContext.
     */
    SparkContext.prototype.stop = function () {
        this.getJavaObject().stop();
    };

    /**
     * The version of EclairJS and Spark on which this application is running.
     * @returns {string}
     */
    SparkContext.prototype.version = function () {
        var javaVersion = java.lang.System.getProperty("java.version");
        var jv = javaVersion.split(".");
        var wrongJavaVersionString = "Java 1.8.0_60 or greater required for EclairJS";
        var wrongSparkVersionString = "Spark 1.5.1 or greater required for EclairJS";
        if (jv[0] < 2) {
            if (jv[0] == 1) {
                if (jv[1] < 8) {
                    throw wrongJavaVersionString;
                } else {
                    if (jv[1] == 8) {
                        // we are at 1.8
                        var f = jv[2]
                        var fix = f.split("_");
                        if ((fix[0] < 1) && (fix[1] < 60)) {
                            // less than 1.8.0_60
                            throw wrongJavaVersionString;
                        }
                    } else {
                        // 1.9 or greater
                    }
                }
            } else {
                throw wrongJavaVersionString;
            }

        } else {
            // versions is 2.0 or greater
        }
        var sparkVersion = this.getJavaObject().version();
        var sv = sparkVersion.split(".");
        if (sv[0] < 2) {
            if (sv[0] == 1) {
                if (sv[1] < 5) {
                    throw wrongSparkVersionString;
                } else {
                    if (sv[1] == 5) {
                        // we are at 1.5
                        if (sv[2] < 1) {
                            // less than 1.5.1
                            throw wrongSparkVersionString;
                        }
                    } else {
                        // 1.5 or greater
                    }
                }
            } else {
                throw wrongSparkVersionString;
            }

        } else {
            // versions is 2.0 or greater
        }
        
        return "EclairJS-nashorn 0.10.2 Spark " + sparkVersion;
    };

    /**
     * Zip up a file in a directory to preserve it's path and add it to worker node for download via addFile.
     */
    SparkContext.prototype.addModule = function (module) {
        //print("SparkContext.addModule: "+module.toString());
        //var folder = module.modname.slice(0, module.modname.lastIndexOf("\/")),
        var parent = ModuleUtils.getParent(module);
        //print("SparkContext.addModule parent: "+parent);

        var folder = (parent && parent.subdir && module.subdir.indexOf(parent.subdir) > -1) ? parent.subdir : (module.subdir || "."),
            zipfile = parent && parent.zipfile ? parent.zipfile.replace(".zip", "_child_" + Date.now() + ".zip") : "module_" + Date.now() + ".zip",
            filename = module.id.slice(module.id.lastIndexOf("\/") + 1, module.id.length);
        //print("SparkContext.addModule folder: "+folder);
        //print("SparkContext.addModule filename: "+filename);
        try {
            org.eclairjs.nashorn.Utils.zipFile(folder, zipfile, [filename]);
            //print("SparkContext.addModule zipped file now going to try and addFile: "+zipfile);
            this.getJavaObject().addFile(zipfile);
            module.zipfile = zipfile;
        } catch (exc) {
            print("Cannot add module: " + module.modname);
            print(exc);
        }
    };

    /**
     * Zip up all required files not in JAR to preserve paths and add it to worker node for download via addFile.
     */
    SparkContext.prototype.addCustomModules = function () {
        // The big zip of all non-core required mods will be loaded only once per SparkContext.
        // Note: If the temp file already exists for it, an exception is thrown and can be ignored.
        var mods = ModuleUtils.getModulesByType({type: "core", value: false});
        logger.debug("addingCustomModules: ",mods.toString());
        var folder = ".", zipfile = ModuleUtils.defaultZipFile, filenames = [];
        mods.forEach(function (mod) {
            filenames.push(mod.id.slice(mod.id.lastIndexOf("\/") + 1, mod.id.length));
        });
        logger.debug("SparkContext.addCustomModules folder: ",folder);
        logger.debug("SparkContext.addCustomModules filenames: ",filenames.toString());
        try {
            org.eclairjs.nashorn.Utils.zipFile(folder, zipfile, filenames);
            this.getJavaObject().addFile(zipfile);
            logger.debug("Custom modules have been added");
        } catch (exc) {
            logger.debug("Custom modules have already been added");
        }
    };

    /**
     * Load an RDD saved as a SequenceFile containing serialized objects, with NullWritable keys and BytesWritable
     * values that contain a serialized partition. This is still an experimental storage format and may not be supported
     * exactly as is in future releases.
     * @param {string} path
     * @param {integer} [minPartitions]
     * @returns {module:eclairjs.RDD}
     */
    SparkContext.prototype.objectFile = function (path, minPartitions) {
        var javaRdd;
        if(minPartitions) {
            javaRdd = this.getJavaObject().objectFile(path, minPartitions);
        } else {
            javaRdd = this.getJavaObject().objectFile(path);
        }
        return Utils.javaToJs(javaRdd);

    };

    /**
     * A default Hadoop Configuration for the Hadoop code (e.g. file systems) that we reuse.
     * '''Note:''' As it will be reused in all Hadoop RDDs, it's better not to modify it unless you plan to set some global configurations for all Hadoop RDDs.
     * @example
     *  var hadoopConf = sparkContext.hadoopConfiguration();
     *  hadoopConf.set("fs.swift.service.softlayer.auth.url", "https://identity.open.softlayer.com/v3/auth/tokens");
     *  hadoopConf.set("fs.swift.service.softlayer.auth.endpoint.prefix", "endpoints");
     *  hadoopConf.set("fs.swift.service.softlayer.tenant", "productid"); // IBM BlueMix Object Store product id
     *  hadoopConf.set("fs.swift.service.softlayer.username", "userid"); // IBM BlueMix Object Store user id
     *  hadoopConf.set("fs.swift.service.softlayer.password", "secret"); // IBM BlueMix Object Store password
     *  hadoopConf.set("fs.swift.service.softlayer.apikey", "secret"); // IBM BlueMix Object Store password
     *
     *  var rdd = sparkContext.textFile("swift://wordcount.softlayer/dream.txt").cache();
     *
     * @returns {org.apache.hadoop.conf.Configuration}
     * @private
     */
    SparkContext.prototype.hadoopConfiguration = function () {
        var javaRdd = this.getJavaObject().hadoopConfiguration();
        return Utils.javaToJs(javaRdd);
    };
    /**
     * Set the value of the name property of the Hadoop Configuration for the Hadoop code (e.g. file systems) that we reuse.
     * '''Note:''' As it will be reused in all Hadoop RDDs, it's better not to modify it unless you plan to set some global configurations for all Hadoop RDDs.
     * @example
     *  sparkContext.setHadoopConfiguration("fs.swift.service.softlayer.auth.url", "https://identity.open.softlayer.com/v3/auth/tokens");
     *  sparkContext.setHadoopConfiguration("fs.swift.service.softlayer.auth.endpoint.prefix", "endpoints");
     *  sparkContext.setHadoopConfiguration("fs.swift.service.softlayer.tenant", "productid"); // IBM BlueMix Object Store product id
     *  sparkContext.setHadoopConfiguration("fs.swift.service.softlayer.username", "userid"); // IBM BlueMix Object Store user id
     *  sparkContext.setHadoopConfiguration("fs.swift.service.softlayer.password", "secret"); // IBM BlueMix Object Store password
     *  sparkContext.setHadoopConfiguration("fs.swift.service.softlayer.apikey", "secret"); // IBM BlueMix Object Store password
     *
     *  var rdd = sparkContext.textFile("swift://wordcount.softlayer/dream.txt").cache();
     *
     * @param key
     * @param value
     * @returns {void}
     */
    SparkContext.prototype.setHadoopConfiguration = function (key, value) {
        if (value instanceof java.lang.Integer) {
            this.getJavaObject().hadoopConfiguration().setInt(key, value);
        } if (value instanceof java.lang.Double) {
            this.getJavaObject().hadoopConfiguration().setFloat(key, value);
        } if (value instanceof java.lang.Boolean) {
            this.getJavaObject().hadoopConfiguration().setBoolean(key, value);
        } else {
            this.getJavaObject().hadoopConfiguration().set(key, value);
        }

    };
    /**
     * Get the value of the name property of the Hadoop Configuration for the Hadoop code (e.g. file systems) that we reuse.
     * '''Note:''' As it will be reused in all Hadoop RDDs, it's better not to modify it unless you plan to set some global configurations for all Hadoop RDDs.
     * , null if no such property exists.
     * @param key
     * @param [defaultValue]
     * @returns {string}
     */
    SparkContext.prototype.getHadoopConfiguration = function (key, defaultValue) {
        try {
            return this.getJavaObject().hadoopConfiguration().getInt(key, defaultValue | 0);
        } catch (e) {
            try {
                return this.getJavaObject().hadoopConfiguration().getFloat(key, defaultValue | 0.0);
            } catch (e) {
                try {
                    var boolValue = this.getJavaObject().hadoopConfiguration().getBoolean(key, defaultValue | false);
                    var strValue =  this.getJavaObject().hadoopConfiguration().get(key, defaultValue);
                    if ("" + boolValue == strValue) {
                        return boolValue;
                    } else {
                        return strValue;
                    }
                } catch (e) {
                    return this.getJavaObject().hadoopConfiguration().get(key, defaultValue);
                }
            }

        }

    };

    SparkContext.prototype.toJSON = function () {
        var jsonObj = {
            "version": this.version(),
            "appName": this.appName(),
            "master": this.master()
        }
        return jsonObj;
    };

    module.exports = SparkContext;


})();
