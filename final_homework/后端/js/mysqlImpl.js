var mysql = require('mysql');

//链接函数
module.exports.connection = ()=>{
	return mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'matching',
	  multipleStatements: true
	});
} 

//同步问题：
//参考资料：
/*
    数据库选择测试操作
	输入--连接, 回调函数
	输出--操作结果{code,msg,data}
*/
var _selectTest = function(conn, callback){
	conn.connect();
	var sql = 'SELECT * FROM relation';
	conn.query(sql,function (err, result) {
		if(err){
		  console.log('[查询错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, msg:"操作成功", data:result};
          callback(ans);
		}
	   console.log('---查询结果：---------------------------------------------------');
	   console.log(result);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    }
	conn.end();	
}
module.exports.selectTest = function(conn, callback){
	return _selectTest(conn, callback);		
}

/*
	数据库login操作
	o输入--连接, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _login = function(conn, postdata, callback){
	conn.connect();
	var sql = 'select id,passwd from user where id=? and passwd=?';
	conn.query(sql, postdata, function (err, result) {
		if(err){
		  console.log('[登录错误] - ',err.message);
		  callback(error());
		}else{
		  if(result.length > 0){
			  var ans = {code:0, successlogin:1, msg:"登录成功"};
			  callback(ans);			  
		  }else{
			  var ans = {code:0, successlogin:0, msg:"登录失败"};
			  callback(ans);				  
		  }
		}
	   console.log('---登录结果：---------------------------------------------------');
	   console.log(result.length > 0);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.login = function(conn, postdata, callback){
	return _login(conn, postdata, callback);		
}

/*
	数据库获取用户信息操作
	o输入--连接, 请求数据, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _getUser = function(conn, postdata, callback){
	conn.connect();
	var sql = 'select id,createtime,email,qq,wx,user.signal from user where id=?';
	conn.query(sql, postdata, function (err, result) {
		if(err){
		  console.log('[登录错误] - ',err.message);
		  callback(error());
		}else{
		  if(result.length > 0){
			  var ans = {code:0, data:result, msg:"登录成功"};
			  callback(ans);			  
		  }else{
			  var ans = {code:0, msg:"查询失败"};
			  callback(ans);				  
		  }
		}
	   console.log('---查询结果：---------------------------------------------------');
	   console.log(result[0]);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.getUser = function(conn, postdata, callback){
	return _getUser(conn, postdata, callback);		
}

/*
	数据库修改用户信息操作
	o输入--连接, 请求数据, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _updateUser = function(conn, postdata, callback){
	conn.connect();
	var sql = 'update user set email=?,qq=?,wx=?,user.signal=? where id=?';
	conn.query(sql, postdata, function (err, result) {
		if(err){
			console.log('[登录错误] - ',err.message);
			callback(error());
		}else{
			var ans = {code:0, msg:"修改成功"};
			callback(ans);			  
		}
	   console.log('---修改结果：---------------------------------------------------');
	   console.log(true);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.updateUser = function(conn, postdata, callback){
	return _updateUser(conn, postdata, callback);		
}

/*
	数据库修改用户密码操作
	o输入--连接, 请求数据, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _updateUserPwd = function(conn, postdata, callback){
	conn.connect();
	var sql = 'update user set passwd=? where id=?';
	var flag = 0;
	conn.query(sql, postdata, function (err, result) {
		if(err){
			console.log('[修改错误] - ',err.message);
			callback(error());
		}else{
			var ans = {code:0, msg:"修改成功"};
			callback(ans);			  
		}
		console.log('---修改结果：---------------------------------------------------');
		console.log(true);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.updateUserPwd = function(conn, postdata, callback){
	return _updateUserPwd(conn, postdata, callback);		
}


/*
	数据库标准问题及答案查询
	o输入--连接, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _selectStdQA = function(conn, callback){
	conn.connect();
	var sql = 'select questionid,question,answer from content order by questionid asc';
	conn.query(sql,function (err, result) {
		if(err){
		  console.log('[查询错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, msg:"操作成功", data:result, recordsTotal: result.length};
          callback(ans);
		}
	   console.log('---查询结果：---------------------------------------------------');
	   console.log(result[0]);  
	   console.log('共查询到'+result.length+'条结果')
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectStdQA = function(conn, callback){
	return _selectStdQA(conn, callback);		
}
/*
	数据库标准问题及答案添加
	o输入--连接, 请求数据, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _addStdQA = function(conn, postdata, callback){
	conn.connect();
	var sql = 'insert into content(question,answer) values(?,?)';
	conn.query(sql, postdata, function (err, result) {
		if(err){
		  console.log('[查询错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, msg:"操作成功", data:result};
          callback(ans);
		}
	   console.log('---添加结果：---------------------------------------------------');
	   console.log(result);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.addStdQA = function(conn, postdata, callback){
	return _addStdQA(conn, postdata, callback);		
}

/*
	数据库标准问题及答案删除
	o输入--连接, 请求数据, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _deleteStdQA = function(conn, postdata, callback){
	conn.connect();
	if(postdata == null || postdata[0] == ""){callback({code: -1, msg: "未选择待删除数据"});return;}
	var sql = 'delete from content where questionid in ('+postdata[0]+')';
	console.log(sql);
	conn.query(sql,function (err, result) {
		if(err){
		  console.log('[删除错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, affectedRows:result.affectedRows, msg:"删除成功"};
		  callback(ans);			  
		}
	    console.log('---删除结果：---------------------------------------------------');
	    console.log("删除"+result.affectedRows+"条记录");  
	    //console.log(result);
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.deleteStdQA = function(conn, postdata, callback){
	return _deleteStdQA(conn, postdata, callback);		
}

/*
	数据库后台系统使用过程中常见问题及答案查询
	o输入--连接, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _selectComQuestion = function(conn, callback){
	conn.connect();
	var sql = 'select id,question,answer from comquestion';
	conn.query(sql,function (err, result) {
		if(err){
		  console.log('[查询错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, msg:"操作成功", data:result, recordsTotal: result.length};
          callback(ans);
		}
	   console.log('---查询结果：---------------------------------------------------');
	   console.log(result[0]);  
	   console.log('共查询到'+result.length+'条结果')
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectComQuestion = function(conn, callback){
	return _selectComQuestion(conn, callback);		
}

/*
	数据库后台系统使用过程中对话记录查询
	o输入--连接, 回调函数
	o输出--操作结果{code,msg,data}
*/
var _selectDialog = function(conn, callback){
	conn.connect();
	var sql = 'select id,userid,time,question,answer,flag from historyinfo';
	conn.query(sql,function (err, result) {
		if(err){
		  console.log('[查询错误] - ',err.message);
		  callback(error());
		}else{
		    var ans = {code:0, msg:"操作成功", data:result, recordsTotal: result.length};
            callback(ans);
		}
	   console.log('---查询结果：---------------------------------------------------');
	   console.log(result[0]);  
	   console.log('共查询到'+result.length+'条结果')
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectDialog = function(conn, callback){
	return _selectDialog(conn, callback);		
}

/*
	数据库后台系统使用过程中对话记录的删除
	o输入--连接, 请求数据, 回调函数 
	o输出--操作结果{code,msg,data}
*/
var _deleteDialog = function(conn, postdata, callback){
	conn.connect();
	if(postdata == null || postdata[0] == ""){callback({code: -1, msg: "未选择待删除数据"});return;}
	var sql = 'DELETE from historyinfo where id in ('+postdata[0]+')';
	//console.log(sql);
	//console.log(postdata);
	conn.query(sql, function (err, result) {
		if(err){
		  console.log('[删除错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, affectedRows:result.affectedRows, msg:"删除成功"};
		  callback(ans);			  
		}
	   console.log('---删除结果：---------------------------------------------------');
	   console.log("删除"+result.affectedRows+"条记录");  
	   //console.log(result);
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.deleteDialog = function(conn, postdata, callback){
	return _deleteDialog(conn, postdata, callback);		
}

/*
	数据库后台系统图表近12月询问人数查询
	o输入--连接, 请求数据, 回调函数 
	o输出--操作结果{code,msg,data}
*/
var _selectChartUse = function(conn, postdata, callback){
	conn.connect();
	if(postdata == null || postdata[0] == ""){callback({code: -1, msg: "未选择年份"});return;}
	var sql = 'select rec1,rec2,rec3,rec4,rec5,rec6,rec7,rec8,rec9,rec10,rec11,rec12 from chart_use where year=? and month=?';
	conn.query(sql, postdata, function (err, result) {
		if(err){
		  console.log('[查找错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, data:result, msg:"查找成功"};
		  callback(ans);			  
		}
	   console.log('---查找结果：---------------------------------------------------');
	   console.log(result[0]);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectChartUse = function(conn, postdata, callback){
	return _selectChartUse(conn, postdata, callback);		
}
/*
	数据库后台系统图表问题关键字分布查询
	o输入--连接, 回调函数 
	o输出--操作结果{code,msg,data}
*/
var _selectChartWord = function(conn, callback){
	conn.connect();
	var sql = 'select word as name,freq as value from chart_word order by freq desc limit 50';
	conn.query(sql, function (err, result) {
		if(err){
		  console.log('[查找错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, data:result, msg:"查找成功"};
		  callback(ans);			  
		}
	   console.log('---查找结果：---------------------------------------------------');
	   console.log(result[0]);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectChartWord = function(conn, callback){
	return _selectChartWord(conn, callback);		
}
/*
	数据库后台系统图表本月关注度前5问题查询
	o输入--连接, 请求数据, 回调函数 
	o输出--操作结果{code,msg,data}
*/
var _selectChartProblem = function(conn, postdata, callback){
	conn.connect();
	if(postdata == null || postdata[0] == ""){callback({code: -1, msg: "未选择年份"});return;}
	var sql = 'select question,freq,rank from chart_question where year=? and month=?';
	conn.query(sql, postdata, function (err, result) {
		if(err){
		  console.log('[查找错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, data:result, msg:"查找成功"};
		  callback(ans);			  
		}
	   console.log('---查找结果：---------------------------------------------------');
	   console.log(result[0]);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectChartProblem = function(conn, postdata, callback){
	return _selectChartProblem(conn, postdata, callback);		
}
/*
	数据库后台系统图表本月问题相似度最高前5问题查询
	o输入--连接, 请求数据, 回调函数 
	o输出--操作结果{code,msg,data}
*/
var _selectChartProblem2 = function(conn, postdata, callback){
	conn.connect();
	if(postdata == null || postdata[0] == ""){callback({code: -1, msg: "未选择年份"});return;}
	var sql = 'select question1,question2,freq,rank from chart_question2 where year=? and month=?';
	conn.query(sql, postdata, function (err, result) {
		if(err){
		  console.log('[查找错误] - ',err.message);
		  callback(error());
		}else{
		  var ans = {code:0, data:result, msg:"查找成功"};
		  callback(ans);			  
		}
	   console.log('---查找结果：---------------------------------------------------');
	   console.log(result[0]);  
	});
	function error() {
        return {code: -1, msg: "数据库出错"};
    } 
	conn.end();	
}
module.exports.selectChartProblem2 = function(conn, postdata, callback){
	return _selectChartProblem2(conn, postdata, callback);		
}


