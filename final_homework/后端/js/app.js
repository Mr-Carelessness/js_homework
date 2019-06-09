var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer  = require('multer');
var url = require('url');
var mysql = require('./mysqlImpl.js');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));
app.use('/public', express.static('public'));
// 设置请求函数


app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
}) 
 
//  主页输出 "Hello World"
app.get('/', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   //console.log(req);
   //console.log(res.body.first_name);
   console.log("主页 GET 请求");
   //res.send('Hello GET');
   res.end(JSON.stringify({ans:1,content:"123"}))
})

//  sql
app.get('/sql', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   console.log("主页 sql_select 请求");
   mysql.selectTest(mysql.connection(), function(data){
		res.write(JSON.stringify(data));
		res.end()   
   });
})

//  web输出 "Hello World"
app.get('/web', function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    var params = url.parse(req.url, true).query;
	var ans = {
		name: params.name,
		url: params.url
	}
	if(ans.name == '123'){
		res.write("网站名：" + ans.name);
		res.write("\n");
		res.write("网站 URL：" + ans.url);
		res.end();
	}
	else{
		res.write(JSON.stringify(ans));
		res.end();
	}
})
 
//  POST 请求
app.post('/', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   console.log("主页 POST 请求");
   res.send('Hello POST');
})

//  POST 请求
app.post('/del_t', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   console.log("/del_t POST 请求");
   res.send('删除也没面');
}) 

app.post('/process_post', urlencodedParser, function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   // 输出 JSON 格式
   var response = {
       "first_name":req.body.first_name,
       "last_name":req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.get('/process_get', function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       "first_name":req.query.first_name,
       "last_name":req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})
//  /del_user 页面响应
app.get('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求");
   res.send('删除页面');
})
 
//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
   console.log("/list_user GET 请求");
   res.send('用户列表页面');
})
 
// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {   
   console.log("/ab*cd GET 请求");
   res.send('正则匹配');
})
 
app.post('/file_upload', function (req, res) {
   console.log(req.files[0]);  // 上传的文件信息
   var des_file = __dirname + "/" + req.files[0].originalname;
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})
 
//==============================================================
/*
	操作：登录后台操作
	路径：/user/login
*/
app.post('/user/login', urlencodedParser, function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
	console.log("主页 login 请求");
    // 输出 JSON 格式
    var post_data = [req.body.id, req.body.passwd];
    mysql.login(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：获取用户信息操作
	路径：/user/get
*/
app.get('/user/get', function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
	console.log("主页 user_get 请求");
    var params = url.parse(req.url, true).query;
	var post_data = [params.id];
	mysql.getUser(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：修改用户信息操作
	路径：/user/update
*/
app.post('/user/update', urlencodedParser, function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
	console.log("主页 user_update 请求");
    // 输出 JSON 格式
    var post_data = [req.body.email, req.body.qq, req.body.wx, req.body.signal, req.body.id];
    mysql.updateUser(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：修改用户password操作
	路径：/user/update/pwd
*/
app.post('/user/update/pwd', urlencodedParser, function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
	console.log("主页 user_update 请求");
    // 输出 JSON 格式
	var post_data = [req.body.modify, req.body.id];
    mysql.updateUserPwd(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})

/*
	操作：查询所有的标准问题及答案
	路径：/stdQA/select
*/
app.get('/stdQA/select', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   console.log("主页 stdQA_select 请求");
   mysql.selectStdQA(mysql.connection(), function(data){
		res.write(JSON.stringify(data));
		res.end()   
   });
})
/*
	操作：添加一条的标准问题及答案
	路径：/stdQA/add
*/
app.post('/stdQA/add', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    console.log("主页 stdQA_add 请求");
    var post_data = [req.body.question, req.body.answer];
    mysql.addStdQA(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：批量删除部分标准问题及答案
	路径：/stdQA/delete
*/
app.post('/stdQA/delete', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    console.log("主页 stdQA_delete 请求");
	console.log(req.body);
	var del = [req.body["del"]];
	/*console.log(del);*/
	var delStr="";
	for(var i=0;i<del.length;i++){
		if(i==0)    delStr += (del[i]);
		else		delStr += (","+del[i]);
	}
    // 输出 JSON 格式
    var post_data = [delStr];
    //var post_data = del;
    //console.log(post_data);
    mysql.deleteStdQA(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})

/*
	操作：查询后台系统中使用的常见问题及答案
	路径：/comQuestion/select
*/
app.get('/comQuestion/select', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   console.log("主页 comQuestion_select 请求");
   mysql.selectComQuestion(mysql.connection(), function(data){
		res.write(JSON.stringify(data));
		res.end()   
   });
})
 
/*
	操作：查询后台系统中使用的对话历史记录
	路径：/dialog/select
*/ 
app.get('/dialog/select', function (req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*"); 
   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
   console.log("主页 dialog_select 请求");
   mysql.selectDialog(mysql.connection(), function(data){
		res.write(JSON.stringify(data));
		res.end()   
   });
})

/*
	操作：批量删除后台系统中使用的对话历史记录
	路径：/dialog/delete
*/ 
app.post('/dialog/delete', urlencodedParser, function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*"); 
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
	console.log("主页 dialog_delete 请求");
	console.log(req.body);
	var del = [req.body["del"]];
	/*console.log(del);*/
	var delStr="";
	for(var i=0;i<del.length;i++){
		if(i==0)    delStr += (del[i]);
		else		delStr += (","+del[i]);
	}
    // 输出 JSON 格式
    var post_data = [delStr];
    //var post_data = del;
    //console.log(post_data);
    mysql.deleteDialog(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})

/*
	操作：查询近12个月的询问人数
	路径：/chart/use/select
*/ 
app.post('/chart/use/select', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    console.log("主页 stdQA_add 请求");
    var post_data = [req.body.year, req.body.month];
    mysql.selectChartUse(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：查询高频词汇
	路径：/chart/word/select
*/ 
app.post('/chart/word/select', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    console.log("主页 stdQA_add 请求");
    mysql.selectChartWord(mysql.connection(), function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：查询本月前5关注度最高的问题
	路径：/chart/problem/select
*/ 
app.post('/chart/problem/select', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    console.log("主页 stdQA_add 请求");
    var post_data = [req.body.year, req.body.month];
    mysql.selectChartProblem(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})
/*
	操作：查询本月前5关联度最高的问题
	路径：/chart/problem2/select
*/ 
app.post('/chart/problem2/select', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    console.log("主页 stdQA_add 请求");
    var post_data = [req.body.year, req.body.month];
    mysql.selectChartProblem2(mysql.connection(), post_data, function(data){
	    res.write(JSON.stringify(data));
	    res.end();
    });
})



 
var server = app.listen(3456, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})