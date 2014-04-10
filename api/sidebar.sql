-- To run sql files from psql shell: (nameOfdb)=> \i [nameOfFile.sql]

-- Syntax to create new database "CREATE DATABASE [mydb (db name)]"
-- CREATE DATABASE sidebar

DROP TABLE messages;
DROP TABLE danceCard;
DROP TABLE users;


-- Every table should have at least one primary key! (best practice)
CREATE TABLE users (
	userId			int PRIMARY KEY, /*NOT NULL UNIQUE (constraint is same as primary key*/
	name		varchar(20) NOT NULL,
	gender			varchar(1) NOT NULL,
	dateOfBirth		date CHECK (dateOfBirth < CURRENT_DATE) NOT NULL,
	age				int CHECK (age > 0 AND age < 100),
	location_city	varchar(30) NOT NULL,
	location_state	varchar(30) NOT NULL,
	zipCode			int CHECK (zipCode > 0 AND zipCode < 100000) NOT NULL,
	personal_blurb	varchar(300) DEFAULT 'I''m a blank essay',
	imageUrls		varchar(100)[] 

	--PRIMMARY KEY (a, b) for multiple primary keys in a table
);

CREATE TABLE danceCard (
	userId			int REFERENCES users (userId) ON DELETE CASCADE, -- Foreign key constraint
	partnerId		int REFERENCES users (userId) ON DELETE CASCADE, 
	status			varchar(10),
	--FOREIGN KEY (userId, partnerId) REFERENCES user (userId, userId)
	PRIMARY KEY (userId, partnerId)
); 

CREATE TABLE messages (
	senderId		int REFERENCES users (userId),
	receiverId		int REFERENCES users (userId),
	message 		text NOT NULL,
	sendTime		timestamp,
	PRIMARY KEY (senderId, receiverId, sendTime)		 
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

COPY users FROM '/Users/derekkan/Dev/sidebarDating/api/users.txt' DELIMITER ',' CSV;
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

