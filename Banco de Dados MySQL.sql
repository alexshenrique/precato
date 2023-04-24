create database clientes;

create table inscricoes (
id int not null auto_increment,
nome varchar(100) not null,
email varchar(100) not null,
telefone varchar(15) not null,
cpf varchar(11) not null,
data_nascimento date not null,
data_inscricao timestamp not null default current_timestamp,
primary key(id)
);