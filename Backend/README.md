<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## Para Testar o projeto abaixo :

### 1º Passo : Acessar o projeto na pasta Backend
- Entre na pasta do projeto:
```bash
 cd Desafio_Chromasoft/Backend
```

### 2º Passo : Instale as dependências do projeto
- Certifique-se de que o Composer está instalado. Execute o comando para instalar as dependências do Laravel:
```bash
 composer install
```

### 3º Passo : Configure o arquivo .env
- O arquivo .env contém as variáveis de ambiente do projeto (como configurações de banco de dados). 
- Faça o seguinte: Verifique se existe um arquivo .env. Caso não exista, crie uma cópia do arquivo de exemplo:
```bash
 cp .env.example .env
```
- Abra o arquivo .env e configure as seguintes variáveis principais, especialmente as de conexão com o banco de dados:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nome_do_banco
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### 4º Passo : Inicializar o banco de dados
- Criar o banco de dados configurado no .env (no exemplo acima, seria nome_do_banco).
- Executar as migrações para criar as tabelas necessárias:
```bash
php artisan migrate
```

### 5º Passo : Executar o projeto e verificar se a API está rodando
- Vamos rodar nossa aplicação laravel, execute o comando abaixo no terminal :
```bash
 php artisan serve
```
- Abra seu navegador (google, firefox etc...)
- Acesse a seguinte url :
```bash
 http://127.0.0.1:8000
```

