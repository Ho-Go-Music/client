import cors from 'cors';
import express from 'express'
import mysql from 'mysql2'; // https://www.npmjs.com/package/mysql2 官方api文档
const connetion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '775028',
    database: 'WebMusic'
})
const app = express();


//配置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// 设置允许跨域访问的源
// 1. 使用cors包
app.use(cors());

// 2. 手动配置跨域请求问题
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });


// 处理各种api请求
// 1. 服务器响应
app.get('/', (req, res) => {
    res.send('hello world!')
})

// 2. 判断是否存在账户
app.post('/LogIn', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    let query = 'select * from users where name=? and password=?';
    connetion.query(query, [name, password], (err, results, fields) => {
        if (results.length) {
            return res.send('success');
        }
        return res.send('fail');
    })
})

// 3. 注册账户
app.post('/SignUp', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    let query = 'select * from users where name=?';
    connetion.query(query, [name], (err, results, fields) => {
        if (results.length) {
            return res.send('users info exist');
        }
        else {
            let insert = 'insert into users (name,password,email) values (?,?,?)';
            connetion.execute(insert, [name, password, email], (err, results, fields) => {
                if (err) {
                    return res.send(' sign up fail');
                }
                return res.send('sign up success');
            })
        }
    })
})


// 启动服务器
app.listen(8000, () => {
    console.log('express listen on 8000');
})
