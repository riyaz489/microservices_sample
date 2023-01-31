\set username `echo $DB_USER`
\set password `echo $DB_PASSWORD`

create user :username with encrypted password  :'password';

create database auth;
\c  auth;
-- we need to switch to correct db to run below queries
-- then it will assign permissions for auth db public schema otherwise it will be postgres db public schema
grant all privileges on database auth to :username ;
GRANT USAGE ON SCHEMA public TO :username;
GRANT ALL PRIVILEGES ON SCHEMA public TO :username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO :username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO :username;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO :username;





--\set table `echo %table%`
--\c test;
--select * from :`echo %table%`;
