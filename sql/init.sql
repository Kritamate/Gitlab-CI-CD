create table customer (
	id serial NOT NULL,
	name varchar(100) NOT NULL,
	points int4 NOT NULL,
	CONSTRAINT customer_pkey PRIMARY KEY (id)
);

insert into customer (name, points) values 
('Stamp', 11),
('Snow', 9);