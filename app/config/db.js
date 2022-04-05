const mysql = require('mysql');

    const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'evoting'
      });
       
    connection.connect((err)=>{
          if(err){
              console.log(err);
          }
          console.log('Database Connected.........');
      })


module.exports = connection