-- To run sql files from psql shell: (nameOfdb)=> \i [nameOfFile.sql]

-- Syntax to create new database "CREATE DATABASE [mydb (db name)]"
-- CREATE DATABASE sidebar

DROP TABLE notifications;
DROP TABLE messages;
DROP TABLE userprefs;
DROP TABLE dancecard;
DROP TABLE users;


-- Every table should have at least one primary key! (best practice)
CREATE TABLE users (
	userid			SERIAL PRIMARY KEY, /*NOT NULL UNIQUE (constraint is same as primary key*/
	username		varchar(30) NOT NULL,
	password		varchar(30) NOT NULL,
	email			varchar(30) NOT NULL,
	gender			char(1),
	dateofbirth		date CHECK (dateofbirth < CURRENT_DATE),
	age				int CHECK (age > 0 AND age < 100),
	location_city	varchar(30),
	location_state	varchar(30),
	zipCode			char(5),
	personal_blurb	varchar(300) DEFAULT 'I''m a blank essay',
	imageurls		varchar(100) ARRAY,
	medimageurls	varchar(100) ARRAY,
	smallimageurls	varchar(100) ARRAY

	--PRIMMARY KEY (a, b) for multiple primary keys in a table
);

CREATE TABLE userprefs (
	userid 			int REFERENCES users (userid) ON DELETE CASCADE,
	male			boolean,
	female			boolean,
	age_min			int,
	age_max			int CHECK (age_max > age_min),
	distance_max	int,
	PRIMARY KEY (userid)
);

CREATE TABLE dancecard (
	userid			int REFERENCES users (userid) ON DELETE CASCADE, -- Foreign key constraint
	partnerid		int REFERENCES users (userid) ON DELETE CASCADE, 
	status			varchar(10),
	--FOREIGN KEY (userId, partnerId) REFERENCES user (userId, userId)
	PRIMARY KEY (userid, partnerid)
); 

CREATE TABLE messages (
	senderid		int REFERENCES users (userid),
	receiverid		int REFERENCES users (userid),
	message 		text NOT NULL,
	sendtime		timestamp,
	PRIMARY KEY (senderid, receiverid, sendtime)		 
);

CREATE TABLE notifications (
	userid 			int REFERENCES users (userid) ON DELETE CASCADE,
	message 		varchar(140) NOT NULL,	
	action_time		timestamp,
	PRIMARY KEY (userid)
);



-- To remove table or to recreate it differently
-- DROP TABLE user 

-- INSERT INTO users VALUES (
-- 	0, 
-- 	'mxgutman', 
-- 	'm', 
-- 	'1982-11-27', 
-- 	94102, 
-- 	'I love trying new restaurants and exploring the bay.'
-- );

-- -- Or alternative syntax

-- INSERT INTO users 
-- 	(userId, userName, gender, dateOfBirth, zipCode, personalBlurb) 
-- VALUES 
-- 	(1, 'andkw', 'm', '1989-01-29', 94123, 'I''m interested in all things art and design. Working in the bay area doing UX work.'
-- );

-- COPY users FROM '/Users/derekkan/Dev/sidebarDating/api/users.txt' DELIMITER ',' CSV;
-- COPY danceCard FROM '/Users/derekkan/Dev/sidebarDating/api/dancecard.txt' DELIMITER ',' CSV;
-- COPY messages FROM '/Users/derekkan/Dev/sidebarDating/api/messages.txt' DELIMITER ',' CSV;
-- COPY userprefs FROM '/Users/derekkan/Dev/sidebarDating/api/userprefs.txt' DELIMITER ',' CSV;
-- can use COPY command to insert large amounts of data residing in a flat text file 
-- COPY user FROM '/where/the/file/exists/user.txt'



-- UPDATE user 
--	SET gender = 'F', ...
--	WHERE dateOfBirth > '1994-11-28';

-- DELETE FROM user 
--	WHERE userId = 0;

-- DELETE FROM user; // removes ALL rows! be careful

-- Define views for common queries, building views ontop of other views is not uncommon! 
-- CREATE VIEW myview AS 
--	SELECT city, temp_lo, temp_hi, prcp, date, location
--		FROM weather, cities
--		WHERE city = name;

