const express = require('express');
const mysql = require('mysql');
const validator = require('validator');
const moment = require('moment');


const app = express();

app.use(express.json());

app.post('/inscricao', (req,res) =>{

    res.status(200).send('Inscrição recebida com sucesso!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'clientes'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ', err);
        return;
    }

    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

app.post('/inscricoes', (req, res) => {
    const {nome, email, telefone, cpf, data_nascimento} = req.body;
    
    connection.query(
        'INSERT INTO inscricoes (nome, email, telefone, cpf, data_nascimento) VALUES (?, ?, ?, ?, ?',
        [nome, email, telefone, cpf, data_nascimento],
        (err, result) => {
            if(err){
                console.log('Erro ao inserir a inscrição no banco de dados:', err);
                res.status(500).json({message: 'Erro ao inserir a inscrição no banco de dados'});
                return;
            }

            console.log('Inscrição ${result.insertId} inserida com sucesso no banco de dados!');
            res.status(201).json({message: 'Inscrição registrada com sucesso!'});
        }
    );

    if(!validator.isEmail(email)){
        res.status(400),json({message: 'E-mail inválido'});
        return;
    }

    connection.query('SELECT COUNT(*) AS count FROM inscricoes WHERE email = ?', [email], (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao verificar duplicidade de email');
        } else {
          const count = results[0].count;
          if (count > 0) {
            res.status(400).send('Já existe uma inscrição com esse email');
          } else {
            // Realiza a inserção no banco de dados
            const query = 'INSERT INTO inscricoes (nome, email) VALUES (?, ?)';
            connection.query(query, [nome, email], (err) => {
              if (err) {
                console.error(err);
                res.status(500).send('Erro ao inserir inscrição');
              } else {
                res.status(201).send('Inscrição realizada com sucesso');
              }
            });
          }
        }
      });

      const formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const query = 'INSERT INTO forms_answers (nome, email, created_at) VALUES (?, ?, ?)';
      connection.query(query, [nome, email, formattedDate], (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao inserir inscrição');
        } else {
          res.status(201).send('Inscrição realizada com sucesso');
        }
      });
      
    
});

