sidebarDating
=============

Postgresql 

in psql terminal create or switch to database sidebar

to create: 

CREATE USER sidebar SUPERUSER;
CREATE sidebar OWNER = sidebar;

to change owner:

ALTER DATABASE sidebar OWNER TO sidebar

to switch to sidebar database (if psql prompt is something other than 'sidebar=#'):

\connect sidebar

to setup the tables and insert default users:

\i ~/{{path to sidebarDating Directory}}/sidebarDating/api/sidebar.sql

Chrome exension setup 


