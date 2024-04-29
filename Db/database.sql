CREATE DATABASE harrypotter;

\c harrypotter;

CREATE TABLE bruxos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  idade INTEGER NOT NULL,
  casa_hogwarts VARCHAR(255) NOT NULL,
  habilidade_especial VARCHAR(255) NOT NULL,
  status_sangue VARCHAR(255) NOT NULL,
  patrono VARCHAR(255)
);

CREATE TABLE varinhas (
    id SERIAL PRIMARY KEY,
    material VARCHAR(100) NOT NULL,
    comprimento DECIMAL(5,2) NOT NULL,
    nucleo VARCHAR(100) NOT NULL,
    data_fabricacao DATE NOT NULL
);

INSERT INTO bruxos (nome, idade, casa_hogwarts, habilidade_especial, status_sangue, patrono)
VALUES ('Harry Potter', 17, 'Grifinória', 'Voar em vassoura', 'Mestiço', 'Girafa');

