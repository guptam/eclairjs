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
/**
 * @constructor
 * @classdesc Interface used to write a DataFrame to external storage systems (e.g. file systems, key-value stores, etc). 
 * Use DataFrame.write to access this.
 */
var DataFrameWriter = function(javaDataFrameWriter) {
	var jvmObj = javaDataFrameWriter;
	this.logger = Logger.getLogger("sql.DataFrameWriter_js");
	JavaWrapper.call(this, jvmObj);
};

DataFrameWriter.prototype = Object.create(JavaWrapper.prototype);

//Set the "constructor" property to refer to DataFrameWriter
DataFrameWriter.prototype.constructor = DataFrameWriter;
/**
 * Specifies the behavior when data or table already exists.
 * @parma {string | SaveMode} saveMode Specifies the behavior when data or table already exists. Options include: 
 * - overwrite: overwrite the existing data. - append: append the data. - ignore: ignore the operation (i.e. no-op). - error: default option, 
 * throw an exception at runtime.
 * @returns {DataFrameWriter}
 */
DataFrameWriter.prototype.mode = function(mode) {
    return new DataFrameWriter(this.javaDataFrameWriter.mode(mode));
};
/**
 * Saves the content of the DataFrame as the specified table. 
 * In the case the table already exists, behavior of this function depends on the save mode, 
 * specified by the mode function (default to throwing an exception). When mode is Overwrite, 
 * the schema of the DataFrame does not need to be the same as that of the existing table. 
 * When mode is Append, the schema of the DataFrame need to be the same as that of the existing table, 
 * and format or options will be ignored.
 * When the DataFrame is created from a non-partitioned HadoopFsRelation with a single input path, 
 * and the data source provider can be mapped to an existing Hive builtin SerDe (i.e. ORC and Parquet), 
 * the table is persisted in a Hive compatible format, which means other systems like Hive will be able to read this table. 
 * Otherwise, the table is persisted in a Spark SQL specific format.
 * @param {string} tableName
 */
DataFrameWriter.prototype.saveAsTable = function(tableName) {
    this.javaDataFrameWriter.saveAsTable(tableName);
};