var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs');
var url = require('url');
var mysql = require('./mysqlImpl.js');
var bodyParse = require('body-parser');
var multiparty = require('multiparty');
var formidable = require("formidable");

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }));
//app.use('/public', express.static('public'));
// 设置图片上传路径
//var upload = multer({dest: 'avatar/'});
//var type = upload.single('file');

app.use('/upload',express.static('upload'));
 
// bodyParse 用来解析post数据
//app.use(bodyParse.urlencoded({extended:false}));
//app.use(express.static('public'));

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

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

//上传图片待返回的数据
var myResult = {
    code: 0,
    message:"默认",
    token:""
}
/*
	操作：文件上传请求处理，upload.array 支持多文件上传，第二个参数是上传文件数目
	路径：/user/avatar/update
*/
app.post('/user/avatar/update', function (req, res) {
	/*
	//获取表单的数据 以及post过来的图片
    var form = new multiparty.Form();
    form.uploadDir='./upload'   //上传图片保存的地址     目录必须存在
	/form.on('file',(name,file)=>{
		fs.rename(oldPath,newPath,(err)=>{
			if(err){
				throw err;
			}
		})
	});/
    form.parse(req, function(err, fields, files) {
        //获取提交的数据以及图片上传成功返回的图片信息
        console.log(fields);  //*获取表单的数据
        console.log(files);  //*图片上传成功返回的信息
        // 拿到的是 提交的数据 和图片 路径 保存到数据库表中
		myResult.code = "200";
        myResult.message="成功";
        res.send(myResult);
    });
	*/
	var form = new formidable.IncomingForm();
	form.uploadDir = "avatar"; //存放目录
	form.encoding = 'utf-8';
	form.keepExtensions = true;
	//开始文件上传
	res.writeHead(200, {'content-type': 'text/plain'});
	form.parse(req, function(error, fields, files){
		console.log(fields);
		console.log(files);
		var username = fields.username;
        for(var key in files){
            var file = files[key];
            var fName = username;//(new Date()).getTime();
            switch (file.type){
                case "image/jpeg":
                    fName = fName + ".jpg";
                    break;
                case "image/png":
                    fName = fName + ".png";
                    break;
                default :
                    fName = fName + ".png";
                    break;
            }
            console.log(file.size);
            var uploadDir = "avatar/" + fName;
			console.log(uploadDir)
			var post_data = ["http://zuccsecondary.cn/qa/js/"+uploadDir, fields.username];
			//修改用户头像地址
			mysql.updateUserImg(mysql.connection(), post_data, function(data){});
            fs.rename(file.path, uploadDir, function(err) {
                if (err) {
                    res.write(err+"\n");
                    res.end();
                }
                //res.write("upload image:<br/>");
                //res.write("<img src='/imgShow?id=" + fName + "' />");
            });
        }
		res.write(JSON.stringify({code:0,msg:"上传成功"}));
		res.end();
    });
});


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