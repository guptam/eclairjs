/*                                                                         
* Copyright 2016 IBM Corp.                                                 
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


    /**
     * @classdesc
     * 
     * A handle to a query that is executing continuously in the background as new data arrives.
     * All these methods are thread-safe.
     * @since EclairJS 0.7 Spark  2.0.0
     * @class StreamingQuery
     * @memberof module:eclairjs/sql/streaming
     */

    var StreamingQuery = Java.type('org.eclairjs.nashorn.wrap.sql.streaming.StreamingQuery');
    
    /**
     * Returns the name of the query. This name is unique across all active queries. This can be
     * set in the [[org.apache.spark.sql.DataStreamWriter DataStreamWriter]] as
     * `dataframe.writeStream.queryName("query").start()`.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#name
     * @since EclairJS 0.7 Spark  2.0.0
     * @returns {string} 
     */
    
    
    /**
     * Returns the unique id of this query. This id is automatically generated and is unique across
     * all queries that have been started in the current process.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#id
     * @since EclairJS 0.7 Spark  2.0.0
     * @returns {number} 
     */
    
    
    /**
     * Returns the {@link SparkSession} associated with `this`.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#sparkSession
     * @since EclairJS 0.7 Spark  2.0.0
     * @returns {module:eclairjs/sql.SparkSession} 
     */
    
    
    /**
     * Whether the query is currently active or not
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#isActive
     * @since EclairJS 0.7 Spark  2.0.0
     * @returns {boolean} 
     */
    
    
    /**
     * Returns the {@link StreamingQueryException} if the query was terminated by an exception.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#exception
     * @since EclairJS 0.7 Spark  2.0.0
     * @returns {module:eclairjs/sql/streaming.StreamingQueryException} 
     */
    
    
    /**
     * Returns current status of all the sources.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#sourceStatuses
     * @since EclairJS 0.7 Spark  2.0.0
     * @returns {module:eclairjs/sql/streaming.SourceStatus[]}
     */
    
    
    /**
     *  Returns current status of the sink.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#sinkStatus
     * @returns {module:eclairjs/sql/streaming.SinkStatus} 
     */
    
    
    /**
     * Waits for the termination of `this` query, either by `query.stop()` or by an exception.
     * If the query has terminated with an exception, then the exception will be thrown.
     * Otherwise, it returns whether the query has terminated or not within the `timeoutMs`
     * milliseconds.
     *
     * If the query has terminated, then all subsequent calls to this method will either return
     * `true` immediately (if the query was terminated by `stop()`), or throw the exception
     * immediately (if the query has terminated with exception).
     *
     * @throws StreamingQueryException, if `this` query has terminated with an exception
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#awaitTermination
     *
     * @since EclairJS 0.7 Spark  2.0.0
     * @param {number} [timeoutMs]
     * @returns {boolean} 
     */
    
    
    /**
     * Blocks until all available data in the source has been processed and committed to the sink.
     * This method is intended for testing. Note that in the case of continually arriving data, this
     * method may block forever. Additionally, this method is only guaranteed to block until data that
     * has been synchronously appended data to a {@link Source}
     * prior to invocation. (i.e. `getOffset` must immediately reflect the addition).
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#processAllAvailable
     * @since EclairJS 0.7 Spark  2.0.0
     */

    
    
    /**
     * Stops the execution of this query if it is running. This method blocks until the threads
     * performing execution has stopped.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#stop
     * @since EclairJS 0.7 Spark  2.0.0
     */

    
    
    /**
     * Prints the physical plan to the console for debugging purposes.
     *
     * @function
     * @name module:eclairjs/sql/streaming.StreamingQuery#explain
     * @param {boolean} [extended]  whether to do extended explain or not
     * @since EclairJS 0.7 Spark  2.0.0
     */

    
    module.exports = StreamingQuery;
})();