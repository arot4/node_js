import { createServer } from 'node:http';
import * as ejs from 'ejs';
import { parse } from 'node:querystring';
import { readFile } from 'node:fs'; 
import { createConnection } from 'mysql';

var con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos"
});

const server = createServer((req, res) => {
  console.log('req.url:', req.url);

  if (req.url === '/cp') {
    con.connect(function(err) {
      con.query("SELECT * FROM productos", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        ejs.renderFile('views/catalogoproductos.html',{ productos: result }, (err, str) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('An error occurred');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(str);
          }
        });
      });
    });
    
    
  }else if (req.url === '/cu') {con.connect(function(err) {
    con.query("SELECT * FROM usuarios", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      ejs.renderFile('views/catalogousuarios.html', { usuarios: result},(err, str) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('An error occurred');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(str);
        }
      });
    });
  })
    
    
  }else if (req.url === '/cc') {
    con.connect(function(err) {
    con.query("SELECT * FROM empleados", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      ejs.renderFile('views/catalogoclientes.html',{clientes:result}, (err, str) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('An error occurred');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(str);
        }
      });
    });
  })
    
    
  }
  
  
  else if (req.url === '/login') {
    ejs.renderFile('views/index.html', (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('An error occurred');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(str);
      }
    });
  } else

  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = parse(body);
      console.log('Usuario:', formData.usuario);
      console.log('Contraseña:', formData.contrasena);
      if (formData.usuario === 'fulanito' && formData.contrasena === '123') {

        readFile('views/menu.html', 'utf8', (err, str) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('An error occurred');
          } else {
            console.log('Redireccionando a menu.html');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(str);
          }
        });
      } else {
        console.log('Credenciales incorrectas, redireccionando a index.html');
        res.writeHead(302, { 'Location': '/' });
        res.end();
      }
    });
  } else {
    ejs.renderFile('views/index.html', (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('An error occurred');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(str);
      }
    });
  }
});


server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});