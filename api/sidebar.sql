-- To run sql files from psql shell: (nameOfdb)=> \i [nameOfFile.sql]

-- Syntax to create new database "CREATE DATABASE [mydb (db name)]"
-- CREATE DATABASE sidebar

-- SELECT EXTRACT(YEAR from (SELECT age(dateofbirth) FROM users));

-- SELECT userid FROM (SELECT userid, extract(YEAR from age(dateofbirth)) AS acceptable  FROM users) AS temp where acceptable>24 AND acceptable < 30;
-- SELECT *, CASE WHEN male='t' THEN 'm' END AS men, CASE WHEN female='t' THEN 'f' END AS women  FROM userprefs;

-- SELECT userid, username FROM (SELECT *, CASE WHEN male='t' THEN 'm' END AS men, CASE WHEN female='t' THEN 'f' END AS women  FROM userprefs, users WHERE userprefs.userid=users.userid) WHERE men=(SELECT gender FROM users WHERE userid=23) AND female=(SELECT gender FROM users WHERE userid=23) ; 

--user preferences...

-- SELECT u.userid, u.username FROM users u, userprefs p WHERE u.userid=p.userid AND CASE WHEN p.male THEN 'm'='f' WHEN p.female THEN 'f'='f' END;

-- SELECT users.userid, username FROM (SELECT *, CASE WHEN male='t' THEN 'm' END AS men, CASE WHEN female='t' THEN 'f' END AS women  FROM userprefs, users WHERE userprefs.userid=users.userid) AS temp WHERE men=(SELECT gender FROM users WHERE userid=23) AND female=(SELECT gender FROM users WHERE userid=23);

-- CREATE FUNCTION youMatchTheirPreferences(userid int) 
-- 	RETURNS  TABLE (
-- 		userid			Integer, 
-- 		username		varchar(30),
-- 		gender			char(1),
-- 		dateofbirth		date,
-- 		location_city	varchar(30),
-- 		location_state	varchar(30),
-- 		zipCode			char(5),
-- 		personal_blurb	varchar(300),
-- 		imageurls		varchar(100) ARRAY,
-- 		medimageurls	varchar(100) ARRAY,
-- 		smallimageurls	varchar(100) ARRAY

-- 		) AS $$
-- DECLARE 
-- 	genderToCheck char(1);
-- 	ageToCheck Integer;
-- BEGIN

-- 	SELECT INTO genderToCheck gender FROM users WHERE (userid = $1);
-- 	SELECT INTO ageToCheck EXTRACT(YEAR FROM (SELECT age(dateofbirth) FROM users WHERE userid = $1));

-- 	SELECT u.userid, u.username FROM users u, userprefs p WHERE u.userid=p.userid AND CASE WHEN p.male THEN 'm'='m' WHEN p.female THEN 'f'='m' END;

-- 	RETURN QUERY
-- 	SELECT u.userid, 
-- 	       u.username, 
-- 	       u.gender, 
-- 	       u.dateofbirth, 
-- 	       u.location_city, 
-- 	       u.location_state,
-- 	       u.zipCode,
-- 	       u.personal_blurb,
-- 	       u.imageurls,
-- 	       u.medimageurls,
-- 	       u.smallimageurls

-- 	FROM users u, userprefs p 
-- 	WHERE 
-- 		u.userid=p.userid AND 
-- 		CASE WHEN p.male THEN 'm'=genderToCheck END AND
-- 		CASE WHEN p.female THEN 'f'=genderToCheck END AND 
-- 		p.age_min < ageToCheck AND 
-- 		p.age_max > ageToCheck;


-- END;
-- $$ LANGUAGE plpgsql;

--return people whose preferences include your age and your gender (and distance from them) 
--return people who's age is greater than your min age  preferance
--return people who's age is less than your max age preference

DROP TABLE IF EXISTS url_categories;
DROP TABLE IF EXISTS user_history;
DROP TABLE IF EXISTS urls;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS userprefs;
DROP TABLE IF EXISTS dancecard;
DROP TABLE IF EXISTS users;
-- DROP FUNCTION IF EXISTS dancecard_notification();
-- DROP FUNCTION IF EXISTS message_notification();
-- DROP FUNCTION IF EXISTS notify_trigger();
-- DROP FUNCTION IF EXISTS check_mutual(userid1 int, userid2 int);

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
	smallimageurls	varchar(100) ARRAY,
	logged_in		 bool DEFAULT 'f'

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
	mutual			boolean DEFAULT 'false',
	updatetime		timestamp,
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
	notificationid	SERIAL,
	userid 			int REFERENCES users (userid) ON DELETE CASCADE,
	about_userid	int REFERENCES users (userid),
	message 		varchar(140) NOT NULL,	
	action_time		timestamp,
	type 			varchar(10),--message/dancecard
	subtype			varchar(10),--dancecard (added, removed, mutual)/message (new)
	status			varchar(10) DEFAULT 'unread',--read/unread/ignore
	PRIMARY KEY (notificationid)
);

CREATE TABLE urls (
	urlid			    SERIAL,
	url 			    varchar(300),
	page_title		    varchar(140),
	primary_img_url		varchar(140),
	PRIMARY KEY (urlid)
);

CREATE TABLE url_categories (
	urlid			int REFERENCES urls (urlid) ON DELETE CASCADE,
	level1 			varchar(40),--main category
	level2			varchar(40),--sub-category 
	level3			varchar(40),--sub-sub category
	level4			varchar(40),--etc..
	level5			varchar(40),
	score			NUMERIC(6,6),--accuracy/confidence score
	PRIMARY KEY (urlid, level1, level2, level3)
);

CREATE TABLE user_history (
	userid 			int REFERENCES users (userid) ON DELETE CASCADE,
	urlid			int REFERENCES urls (urlid) ON DELETE CASCADE,
	visit_count		int,
	last_visit		timestamp,
	PRIMARY KEY (userid, urlid)
);

--One way of caculating relative interest only considering first level
--SELECT u.username, c.level1, SUM (c.score * h.visit_count) as interest_score  
--FROM users u, url_categories c, user_history h 
--WHERE u.userid = h.userid AND h.urlid=c.urlid 
--GROUP BY u.username, c.level1;

-- CREATE FUNCTION dancecard_notification() RETURNS TRIGGER AS $_$
-- DECLARE
-- 	-- name varchar := SELECT username FROM users WHERE userid = NEW.userid;
-- 	name varchar(30);
-- 	message varchar := '';
-- 	mutualVar boolean := 'false';
-- 	status_check varchar;
-- 	subTypeVar varchar(10);

-- BEGIN
-- 	SELECT INTO name username FROM users WHERE userid = NEW.userid;
-- 	SELECT INTO status_check status FROM dancecard WHERE userid = NEW.partnerid AND partnerid = NEW.userid;

-- 	IF (status_check = 'added' AND NEW.status = 'added') THEN
-- 		mutualVar := 'true';
-- 		NEW.mutual = 'true';
-- 	ELSE
-- 		mutualVar := 'false';
-- 		NEW.mutual = 'false';
-- 	END IF;

-- 	UPDATE dancecard SET mutual = mutualVar WHERE (partnerid=NEW.partnerid OR userid=NEW.partnerid) AND (userid=NEW.userid OR partnerid=NEW.userid);
-- 	-- UPDATE dancecard SET mutual = (SELECT check_mutual(14,1)) WHERE (partnerid=1 AND userid=14) OR (partnerid=14 AND userid=1);

-- 	RAISE NOTICE 'what is mutual? , %', mutualVar;
-- 	RAISE NOTICE 'what is NEW? , %', NEW;

-- 	IF (TG_OP = 'INSERT') THEN 
-- 		IF (mutualVar) THEN 
-- 			message := name || ' added you back';
-- 			subTypeVar := 'mutual';
-- 		ELSE
-- 			message := name || ' added you to their dancecard';
-- 			subTypeVar := 'added';
-- 		END IF;
-- 	END IF;

-- 	IF (TG_OP = 'UPDATE' AND NEW.status = 'removed') THEN
-- 		message := name || ' removed you from their dancecard';
-- 		subTypeVar := 'removed';
-- 	END IF;

-- 	INSERT INTO notifications (userid, about_userid, message, action_time, type, subtype) 
-- 	    VALUES (NEW.partnerid, NEW.userid, message ,CURRENT_TIMESTAMP, 'dancecard', subTypeVar); 

--     RETURN NEW;
-- END $_$ LANGUAGE 'plpgsql';

-- CREATE FUNCTION message_notification() RETURNS TRIGGER AS $_$
-- DECLARE
-- 	-- name varchar := SELECT username FROM users WHERE userid = NEW.userid;
-- 	name varchar(30);
-- 	message varchar := '';

-- BEGIN
-- 	SELECT INTO name username FROM users WHERE userid = NEW.senderid;
	
-- 	IF (TG_OP = 'INSERT') THEN 
-- 		message := name || ' sent you a message';
-- 	END IF;

-- 	INSERT INTO notifications (userid, about_userid, message, action_time, type, subtype) 
-- 	    VALUES (NEW.receiverid, NEW.senderid, message ,CURRENT_TIMESTAMP, 'message', 'new'); 

--     RETURN NEW;
-- END $_$ LANGUAGE 'plpgsql';

-- CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
-- DECLARE
-- BEGIN
--   -- PERFORM pg_notify('watchers', TG_TABLE_NAME || ',userid,' || NEW.userid );

--   PERFORM pg_notify('watchers', NEW.userid || ',' || 
--   								NEW.notificationid || ',' || 
--   								NEW.about_userid || ',' || 
--   								NEW.message || ',' || 
--   								NEW.action_time || ',' || 
--   								NEW.type || ',' || 
--   								NEW.subtype || ',' || 
--   								NEW.status);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE FUNCTION check_mutual(userid1 int, userid2 int) RETURNS boolean AS $$
-- DECLARE 
-- 	count int;
-- BEGIN

-- 	SELECT INTO count COUNT(*) FROM dancecard  WHERE (userid=$1 OR partnerid=$1) AND (userid=$2 OR partnerid=$2) AND status='added';

-- 	IF (count = 2) THEN 
-- 		RETURN 'true';
-- 	ELSE
-- 		RETURN 'false';
-- 	END IF;

-- END;
-- $$ LANGUAGE plpgsql;


-- CREATE TRIGGER add_dancecard_notification AFTER INSERT OR UPDATE OF status ON dancecard FOR EACH ROW EXECUTE PROCEDURE dancecard_notification();
-- CREATE TRIGGER add_message_notification BEFORE INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE message_notification();
-- CREATE TRIGGER watched_table_trigger AFTER INSERT ON notifications FOR EACH ROW EXECUTE PROCEDURE notify_trigger();

-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Aziz', 'Aziz@gmail.com', '1234', 'm', '1985-11-28', 
-- 	   		   '94121', 'San Francisco', 'California', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lectus sed neque ultrices tincidunt. Aliquam erat volutpat. Aliquam erat.',
-- 	   		   '{"/scaled_azizAnsari1.jpg", 
-- 	   		     "/scaled_azizAnsari3.jpg",
--     			 "/scaled_azizAnsari2.jpg"
--     			 }',
--     			 '{"/med_azizAnsari1.jpg",
--     			   "/med_azizAnsari3.jpg",
--    				   "/med_azizAnsari2.jpg"
--    				   }',
--    				   '{"/small_azizAnsari1.jpg",
--     				"/small_azizAnsari3.jpg",
--     				"/small_azizAnsari2.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (1, 'false', 'true', 22, 34, 15); 

-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Daniel', 'danny@gmail.com', '1234', 'm', '1990-3-14', 
-- 	   		   '94121', 'San Francisco', 'California', 'Integer accumsan, felis vel tempor faucibus, nisl dui aliquam diam, ornare ultricies magna elit sit amet ipsum. Vivamus fermentum condimentum.',
-- 	   		   '{"/scaled_danRadclife3.jpg",
--     			"/scaled_danRadclife1.jpg",
--    				 "/scaled_danRadclife2.jpg"
--     			 }',
--     			 '{"/med_danRadclife3.jpg",
--    				   "/med_danRadclife1.jpg",
--     				"/med_danRadclife2.jpg"
--    				   }',
--    				   '{ "/small_danRadclife3.jpg",
--     				  "/small_danRadclife1.jpg",
--   					  "/small_danRadclife2.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (2, 'false', 'true', 22, 34, 15); 

-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Michael', 'mike@gmail.com', '1234', 'm', '1987-8-2', 
-- 	   		   '94103', 'San Francisco', 'California', 'Donec fermentum eget nibh et congue. Pellentesque facilisis neque et nulla scelerisque, tristique mattis mi dictum. Sed molestie mi eleifend.',
-- 	   		   '{"/scaled_mikeCera3.jpg",
--   				  "/scaled_mikeCera2.jpg",
--   				  "/scaled_mikeCera1.jpg"
--     			 }',
--     			 '{"/med_mikeCera3.jpg",
--     			  "/med_mikeCera2.jpg",
--     			  "/med_mikeCera1.jpg"
--    				   }',
--    				   '{ "/small_mikeCera3.jpg",
--     				  "/small_mikeCera2.jpg",
--    					  "/small_mikeCera1.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (3, 'false', 'true', 22, 34, 15); 

-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Max', 'max@gmail.com', '1234', 'm', '1982-5-17', 
-- 	   		   '94103', 'San Francisco', 'California', 'Ut elit sapien, malesuada in felis nec, imperdiet consequat leo. Nunc a velit eu tellus gravida interdum id quis mauris. Vestibulum tincidunt.',
-- 	   		   '{"/scaled_maxGreenfield1.jpg",
--   				 "/scaled_maxGreenfield3.jpg",
--    				 "/scaled_maxGreenfield2.jpg"
--     			 }',
--     			 '{"/med_maxGreenfield1.jpg",
--     				"/med_maxGreenfield3.jpg",
--     				"/med_maxGreenfield2.jpg"
--    				   }',
--    				   '{ "/small_maxGreenfield1.jpg",
--     				  "/small_maxGreenfield3.jpg",
--     				  "/small_maxGreenfield2.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (4, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Mac', 'mac@gmail.com', '1234', 'm', '1991-1-17', 
-- 	   		   '94103', 'San Francisco', 'California', 'Aliquam tincidunt diam quis lorem dignissim, sed venenatis odio ornare. Duis vel turpis interdum, rutrum metus ac, dictum risus.', 
-- 	   		   '{"/scaled_macDemarco1.jpg",
-- 			    "/scaled_macDemarco3.jpg",
-- 			    "/scaled_macDemarco2.jpg"
--     			 }',
--     			 '{"/med_macDemarco1.jpg",
-- 				    "/med_macDemarco3.jpg",
-- 				    "/med_macDemarco2.jpg"
--    				   }',
--    				   '{ "/small_macDemarco1.jpg",
--     				  "/small_macDemarco3.jpg",
--    					  "/small_macDemarco2.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (5, 'false', 'true', 22, 34, 15); 

-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Jonah', 'jonah@gmail.com', '1234', 'm', '1989-10-30', 
-- 	   		   '94103', 'San Francisco', 'California', 'Nullam vitae ultrices risus, id volutpat odio. Suspendisse convallis nibh eget nisi pharetra porta. Sed eget ligula ultrices, varius ligula quis.',
-- 	   		   '{"/scaled_jonahHill2.jpg",
-- 			    "/scaled_jonahHill3.jpg",
-- 			    "/scaled_jonahHill1.jpg"
--     			 }',
--     			 '{"/med_jonahHill2.jpg",
-- 				    "/med_jonahHill3.jpg",
-- 				    "/med_jonahHill1.jpg"
--    				   }',
--    				   '{ "/small_jonahHill2.jpg",
-- 				    "/small_jonahHill3.jpg",
-- 				    "/small_jonahHill1.jpg"
--     				}');


-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (6, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('John', 'john@gmail.com', '1234', 'm', '1981-9-2', 
-- 	   		   '94103', 'San Francisco', 'California', 'Aenean dui turpis, pellentesque quis libero et, laoreet venenatis mauris. In facilisis, ante id vehicula aliquet, erat nulla placerat mauris.', 
-- 	   		   '{"/scaled_johnCho3.jpg",
-- 			    "/scaled_johnCho1.jpg",
-- 			    "/scaled_johnCho2.jpg"
--     			 }',
--     			 '{"/med_johnCho3.jpg",
-- 				    "/med_johnCho1.jpg",
-- 				    "/med_johnCho2.jpg"
--    				   }',
--    				   '{ "/small_johnCho3.jpg",
-- 					    "/small_johnCho1.jpg",
-- 					    "/small_johnCho2.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (7, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Joe', 'joe@gmail.com', '1234', 'm', '1984-7-28', 
-- 	   		   '94103', 'San Francisco', 'California', 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur imperdiet augue ut consectetur.', 
-- 	   		   '{"/scaled_jgl2.jpg",
-- 			    "/scaled_jgl3.jpg",
-- 			    "/scaled_jgl1.jpg"
--     			 }',
--     			 '{"/med_jgl2.jpg",
-- 				    "/med_jgl3.jpg",
-- 				    "/med_jgl1.jpg"
--    				   }',
--    				   '{ "/small_jgl2.jpg",
-- 					    "/small_jgl3.jpg",
-- 					    "/small_jgl1.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (8, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Jason', 'jason@gmail.com', '1234', 'm', '1983-11-14', 
-- 	   		   '94103', 'San Francisco', 'California', 'Nunc varius elit at rutrum molestie. Sed molestie ornare eros, in feugiat massa cursus ut. Vestibulum vitae erat velit. In pharetra felis dolor.', 
-- 	   		   '{"/scaled_jasonSegel1.jpg",
-- 			    "/scaled_jasonSegel3.JPG",
-- 			    "/scaled_jasonSegel2.jpg"
--     			 }',
--     			 '{"/med_jasonSegel1.jpg",
-- 				    "/med_jasonSegel3.JPG",
-- 				    "/med_jasonSegel2.jpg"
--    				   }',
--    				   '{ "/small_jasonSegel1.jpg",
-- 					    "/small_jasonSegel3.JPG",
-- 					    "/small_jasonSegel2.jpg"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (9, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Martin', 'martin@gmail.com', '1234', 'm', '1982-10-14', 
-- 	   		   '94103', 'San Francisco', 'California', 'Nam eleifend accumsan urna et eleifend. Sed ornare nulla eu risus volutpat, quis hendrerit erat condimentum. Eu sollicitudin nibh posuere.', 
-- 	   		   '{"/scaled_martinStarr1.jpg",
-- 			    "/scaled_martinStarr2.jpg",
-- 			    "/scaled_martinStarr3.png"
--     			 }',
--     			 '{"/med_martinStarr1.jpg",
-- 				    "/med_martinStarr2.jpg",
-- 				    "/med_martinStarr3.png"
--    				   }',
--    				   '{ "/small_martinStarr1.jpg",
-- 				    "/small_martinStarr2.jpg",
-- 				    "/small_martinStarr3.png"
--     				}');

-- 	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (10, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Jason', 'j@gmail.com', '1234', 'm', '1979-4-10', 
-- 	   		   '94103', 'San Francisco', 'California', 'Maecenas hendrerit neque ac neque auctor sodales. Etiam dapibus, lorem eget porttitor luctus, tellus dui dapibus libero, non faucibus.',
-- 	   		   '{    "/scaled_jasonLee3.jpg",
-- 				    "/scaled_jasonLee1.jpg",
-- 				    "/scaled_jasonLee2.png"
--     			 }',
--     			 '{"/med_jasonLee3.jpg",
-- 				    "/med_jasonLee1.jpg",
-- 				    "/med_jasonLee2.png"
--    				   }',
--    				   '{ "/small_jasonLee3.jpg",
-- 					    "/small_jasonLee1.jpg",
-- 					    "/small_jasonLee2.png"
--     				}');

-- INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (11, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('James', 'james@gmail.com', '1234', 'm', '1984-7-10', 
-- 	   		   '94103', 'San Francisco', 'California', 'Mauris justo a dui. Nulla facilisi. Morbi molestie risus massa, vel feugiat libero posuere pretium. Sed egestas, turpis ut dignissim ornare.', 
-- 	   		   '{    "/scaled_jamesFranco3.jpg",
-- 				    "/scaled_jamesFranco2.jpg",
-- 				    "/scaled_jamesFranco1.jpg"
--     			 }',
--     			 '{"/med_jamesFranco3.jpg",
-- 				    "/med_jamesFranco2.jpg",
-- 				    "/med_jamesFranco1.jpg"
--    				   }',
--    				   '{ "/small_jamesFranco3.jpg",
-- 					    "/small_jamesFranco2.jpg",
-- 					    "/small_jamesFranco1.jpg"
--     				}');

-- 	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (12, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Reggie', 'reggie@gmail.com', '1234', 'm', '1980-7-10', 
-- 	   		   '94103', 'San Francisco', 'California', 'Sapien urna adipiscing metus, at fringilla diam magna eu dui. Aliquam nibh enim, egestas vel gravida ac, faucibus sit amet est.',
-- 	   		   '{   "/scaled_reggieWatts1.jpeg",
-- 				    "/scaled_reggieWatts2.jpeg",
-- 				    "/scaled_reggieWatts3.jpeg"
--     			 }',
--     			 '{"/med_reggieWatts1.jpeg",
-- 				    "/med_reggieWatts2.jpeg",
-- 				    "/med_reggieWatts3.jpeg"
--    				   }',
--    				   '{ "/small_reggieWatts1.jpeg",
-- 					    "/small_reggieWatts2.jpeg",
-- 					    "/small_reggieWatts3.jpeg"
--     				}');

-- 	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (13, 'false', 'true', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Zooey', 'zooey@gmail.com', '1234', 'f', '1982-9-10', 
-- 	   		   '94103', 'San Francisco', 'California', 'Sed a tellus eu lectus luctus vulputate et a felis. Nullam eget odio sit amet tortor hendrerit condimentum a sed nibh. Ut odio mi, vulputate.',
-- 	   		   '{   "/scaled_zooeyD2.jpeg",
-- 				    "/scaled_zooeyD3.jpeg",
-- 				    "/scaled_zooeyD1.jpg"
--     			 }',
--     			 '{"/med_zooeyD2.jpeg",
-- 				    "/med_zooeyD3.jpeg",
-- 				    "/med_zooeyD1.jpg"
--    				   }',
--    				   '{  "/small_zooeyD2.jpeg",
-- 					    "/small_zooeyD3.jpeg",
-- 					    "/small_zooeyD1.jpg"
--     				}');

-- 	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (14, 'true', 'false', 22, 34, 15); 


-- INSERT INTO users (username, email, password, gender, dateofbirth, 
-- 	        zipcode, location_city, location_state, personal_blurb,
-- 	        imageurls, medimageurls, smallimageurls) 
-- 	   VALUES ('Emma', 'emma@gmail.com', '1234', 'f', '1989-9-10', 
-- 	   		   '94103', 'San Francisco', 'California', 'Non lacus ac, mollis consequat ante. Pellentesque nec venenatis justo. Nunc congue mi sed magna consectetur, quis tincidunt quam.',
-- 	   		   '{  "/scaled_emmaStone2.jpg",
-- 				    "/scaled_emmaStone3.jpg",
-- 				    "/scaled_emmaStone1.jpg"
--     			 }',
--     			 '{"/med_emmaStone2.jpg",
-- 				    "/med_emmaStone3.jpg",
-- 				    "/med_emmaStone1.jpg"
--    				   }',
--    				   '{  "/small_emmaStone2.jpg",
-- 					    "/small_emmaStone3.jpg",
-- 					    "/small_emmaStone1.jpg"
--     				}');

-- 	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
-- 	   VALUES (15, 'true', 'false', 22, 34, 15); 


/*
 Navicat PostgreSQL Data Transfer

 Source Server         : sidebar_copy
 Source Server Version : 90304
 Source Host           : localhost
 Source Database       : sidebar
 Source Schema         : sidebar

 Target Server Version : 90304
 File Encoding         : utf-8

 Date: 05/05/2014 22:54:13 PM
*/

-- DROP SCHEMA IF EXISTS sidebar CASCADE;
-- CREATE SCHEMA sidebar;
-- SET search_path = sidebar;

-- ----------------------------
--  Table structure for users
-- ----------------------------
-- DROP TABLE IF EXISTS "users" CASCADE;
-- CREATE TABLE "users" (
--     "userid" SERIAL,
--     "username" varchar(30) NOT NULL COLLATE "default",
--     "password" varchar(30) NOT NULL COLLATE "default",
--     "email" varchar(30) NOT NULL COLLATE "default",
--     "gender" char(1) COLLATE "default",
--     "dateofbirth" date,
--     "age" int4,
--     "location_city" varchar(30) COLLATE "default",
--     "location_state" varchar(30) COLLATE "default",
--     "zipcode" char(5) COLLATE "default",
--     "personal_blurb" varchar(300) DEFAULT 'I''m a blank essay'::character varying COLLATE "default",
--     "imageurls" varchar(100)[] COLLATE "default",
--     "medimageurls" varchar(100)[] COLLATE "default",
--     "smallimageurls" varchar(100)[] COLLATE "default",
--     "logged_in" bool DEFAULT 'f'
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "users" OWNER TO "sidebar";

-- ----------------------------
--  Records of users
-- ----------------------------
BEGIN;
INSERT INTO "users" VALUES ('23', 'Christina', '1234', 'christina@gmail.com', 'f', '1986-01-01', '27', 'Berkeley', 'CA', '94704', 'Microcakes and stuff!', '{/scaled_23-1.jpg,/scaled_23-2.jpg,/scaled_23-3.jpg}', '{/med_23-1.jpg,/med_23-2.jpg,/med_23-3.jpg}', '{/small_23-1.jpg,/small_23-2.jpg,/small_23-3.jpg}', 't');
INSERT INTO "users" VALUES ('1', 'Alex', '1234', 'alex@gmail.com', 'm', '1990-03-03', '24', 'San Mateo', 'CA', '94404', 'LA based Actor, originally SF Bay Area. Have 2 Feature films currently working on. I like Film/Theater. Family. Friends. Food. Wrestling.', '{/scaled_1-1.jpg,/scaled_1-2.jpg,/scaled_1-3.jpg}', '{/med_1-1.jpg,/med_1-2.jpg,/med_1-3.jpg}', '{/small_1-1.jpg,/small_1-2.jpg,/small_1-3.jpg}', 't');
INSERT INTO "users" VALUES ('2', 'James', '1234', 'james@gmail.com', 'm', '1989-02-07', '25', 'Richmond', 'CA', '94084', 'Mellow, night owl, weekend hiker. Illustrator. Art, movie, and game enthusiast. Likes to do something out of the ordinary. Likes Animals.', '{/scaled_2-1.jpg,/scaled_2-2.jpg,/scaled_2-3.jpg}', '{/med_2-1.jpg,/med_2-2.jpg,/med_2-3.jpg}', '{/small_2-1.jpg,/small_2-2.jpg,/small_2-3.jpg}', 't');
INSERT INTO "users" VALUES ('3', 'Hunter', '1234', 'hunter@gmail.com', 'm', '1991-10-06', '22', 'Oakland', 'CA', '94607', 'Looking for like minded chill people. Interested in clubs, parties, and meaningless shinnanigans.', '{/scaled_3-1.jpg,/scaled_3-2.jpg,/scaled_3-3.jpg}', '{/med_3-1.jpg,/med_3-2.jpg,/med_3-3.jpg}', '{/small_3-1.jpg,/small_3-2.jpg,/small_3-3.jpg}', 'f');
INSERT INTO "users" VALUES ('4', 'Joseph', '1234', 'joseph@gmail.com', 'm', '1984-01-30', '30', 'Fremont', 'CA', '94536', 'God, talking, playing basketball, cooking, beach, gym, smiles. I''ve no kids, but I want some. Don''t be shy.', '{/scaled_4-1.jpg,/scaled_4-2.jpg,/scaled_4-3.jpg}', '{/med_4-1.jpg,/med_4-2.jpg,/med_4-3.jpg}', '{/small_4-1.jpg,/small_4-2.jpg,/small_4-3.jpg}', 'f');
INSERT INTO "users" VALUES ('5', 'Robert', '1234', 'robert@gmail.com', 'm', '1991-01-01', '23', 'Daily City', 'CA', '94015', 'I am an urban farmer, so that''s pretty fun! Backpacking, climbing, running, biking, the works. I also write for a food politics journal!', '{/scaled_5-1.jpg,/scaled_5-2.jpg,/scaled_5-3.jpg}', '{/med_5-1.jpg,/med_5-2.jpg,/med_5-3.jpg}', '{/small_5-1.jpg,/small_5-2.jpg,/small_5-3.jpg}', 'f');
INSERT INTO "users" VALUES ('6', 'Kenny', '1234', 'kenny@gmail.com', 'm', '1990-06-05', '23', 'San Francisco', 'CA', '94111', 'I''ve always been a creator, but cinematography is my driving force. It''s what satisfies me. I shoot horrors, westerns, and thrillers.', '{/scaled_6-1.jpg,/scaled_6-2.jpg,/scaled_6-3.jpg}', '{/med_6-1.jpg,/med_6-2.jpg,/med_6-3.jpg}', '{/small_6-1.jpg,/small_6-2.jpg,/small_6-3.jpg}', 'f');
INSERT INTO "users" VALUES ('7', 'Jarod', '1234', 'jarod@gmail.com', 'm', '1990-10-25', '23', 'Daily City', 'CA', '94015', 'I love the idea of creating art for a living. I''m good at singing/songwriting/guitar/acting/improvisation/poker', '{/scaled_7-1.jpg,/scaled_7-2.jpg,/scaled_7-3.jpg}', '{/med_7-1.jpg,/med_7-2.jpg,/med_7-3.jpg}', '{/small_7-1.jpg,/small_7-2.jpg,/small_7-3.jpg}', 'f');
INSERT INTO "users" VALUES ('8', 'Daniel', '1234', 'daniel@gmail.com', 'm', '1989-05-13', '24', 'Berkeley', 'CA', '94704', 'Things I love... Dance, Guitar, Music in general, pursuing my passions, experiencing life and a lot more', '{/scaled_8-1.jpg,/scaled_8-2.jpg,/scaled_8-3.jpg}', '{/med_8-1.jpg,/med_8-2.jpg,/med_8-3.jpg}', '{/small_8-1.jpg,/small_8-2.jpg,/small_8-3.jpg}', 'f');
INSERT INTO "users" VALUES ('9', 'Evan', '1234', 'evan@gmail.com', 'm', '1984-07-04', '29', 'Daily City', 'CA', '94015', 'Things I could not live without: Food, exercise, sex, laughter, sports, friends', '{/scaled_9-1.jpg,/scaled_9-2.jpg,/scaled_9-3.jpg}', '{/med_9-1.jpg,/med_9-2.jpg,/med_9-3.jpg}', '{/small_9-1.jpg,/small_9-2.jpg,/small_9-3.jpg}', 'f');
INSERT INTO "users" VALUES ('10', 'Elijah', '1234', 'elijah@gmail.com', 'm', '1986-11-14', '27', 'Daily City', 'CA', '94015', 'Making the most out of my time. Kicking ass and having fun. I like to dance, giggle, wiggle, and work on my power moves while driving.', '{/scaled_10-1.jpg,/scaled_10-2.jpg,/scaled_10-3.jpg}', '{/med_10-1.jpg,/med_10-2.jpg,/med_10-3.jpg}', '{/small_10-1.jpg,/small_10-2.jpg,/small_10-3.jpg}', 'f');
INSERT INTO "users" VALUES ('11', 'Michael', '1234', 'michael@gmail.com', 'm', '1984-07-27', '29', 'Berkeley', 'CA', '94704', 'My interests and skills are acting, singing, swimming, running, soccer, and I love to hike and I am a gym fanatic as well.', '{/scaled_11-1.jpg,/scaled_11-2.jpg,/scaled_11-3.jpg}', '{/med_11-1.jpg,/med_11-2.jpg,/med_11-3.jpg}', '{/small_11-1.jpg,/small_11-2.jpg,/small_11-3.jpg}', 'f');
INSERT INTO "users" VALUES ('12', 'Benny', '1234', 'benny@gmail.com', 'm', '1990-06-28', '23', 'Berkeley', 'CA', '94704', 'Filmmaking, capoeira, oil paintings, and theatre are the aspirations on the table. Also love sunlight, food, vegetation, and chocolate', '{/scaled_12-1.jpg,/scaled_12-2.jpg,/scaled_12-3.jpg}', '{/med_12-1.jpg,/med_12-2.jpg,/med_12-3.jpg}', '{/small_12-1.jpg,/small_12-2.jpg,/small_12-3.jpg}', 'f');
INSERT INTO "users" VALUES ('13', 'Peter', '1234', 'peter@gmail.com', 'm', '1991-11-08', '22', 'Oakland', 'CA', '94607', 'The activities I most like to do are acting in my free times , spending time with my dog, and watching movies.', '{/scaled_13-1.jpg,/scaled_13-2.jpg,/scaled_13-3.jpg}', '{/med_13-1.jpg,/med_13-2.jpg,/med_13-3.jpg}', '{/small_13-1.jpg,/small_13-2.jpg,/small_13-3.jpg}', 't');
INSERT INTO "users" VALUES ('14', 'Shane', '1234', 'shane@gmail.com', 'm', '1984-04-23', '30', 'Daily City', 'CA', '94015', 'I''m little bit all over the place i draw paint sing play guitar and do graphic design i love my two dogs tomatoe and ninja!', '{/scaled_14-1.jpg,/scaled_14-2.jpg,/scaled_14-3.jpg}', '{/med_14-1.jpg,/med_14-2.jpg,/med_14-3.jpg}', '{/small_14-1.jpg,/small_14-2.jpg,/small_14-3.jpg}', 'f');
INSERT INTO "users" VALUES ('15', 'Luke', '1234', 'luke@gmail.com', 'm', '1990-12-23', '23', 'Richmond', 'CA', '94084', 'Sports, Technology, Beer, Books, Fishing, Going out and having fun!', '{/scaled_15-1.jpg,/scaled_15-2.jpg,/scaled_15-3.jpg}', '{/med_15-1.jpg,/med_15-2.jpg,/med_15-3.jpg}', '{/small_15-1.jpg,/small_15-2.jpg,/small_15-3.jpg}', 'f');
INSERT INTO "users" VALUES ('16', 'Jackson', '1234', 'jackson@gmail.com', 'm', '1990-05-29', '23', 'Richmond', 'CA', '94084', 'Battling monsters, demons, and lethargy. Creating stuff from nowhere. Leaving footprints and taking pictures of the footprint', '{/scaled_16-1.jpg,/scaled_16-2.jpg,/scaled_16-3.jpg}', '{/med_16-1.jpg,/med_16-2.jpg,/med_16-3.jpg}', '{/small_16-1.jpg,/small_16-2.jpg,/small_16-3.jpg}', 'f');
INSERT INTO "users" VALUES ('17', 'Zane', '1234', 'zane@gmail.com', 'm', '1986-06-27', '27', 'Oakland', 'CA', '94607', 'I love to have fun, work out and play baseball. I''m quite the jokester- I''m sure I can make you laugh. ', '{/scaled_17-1.jpg,/scaled_17-2.jpg,/scaled_17-3.jpg}', '{/med_17-1.jpg,/med_17-2.jpg,/med_17-3.jpg}', '{/small_17-1.jpg,/small_17-2.jpg,/small_17-3.jpg}', 'f');
INSERT INTO "users" VALUES ('18', 'Brock', '1234', 'brock@gmail.com', 'm', '1988-08-06', '25', 'Oakland', 'CA', '94607', 'Writing, acting, kareoke(sometimes), making pizza, drinking(not too proud of that one) and negotiating', '{/scaled_18-1.jpg,/scaled_18-2.jpg,/scaled_18-3.jpg}', '{/med_18-1.jpg,/med_18-2.jpg,/med_18-3.jpg}', '{/small_18-1.jpg,/small_18-2.jpg,/small_18-3.jpg}', 'f');
INSERT INTO "users" VALUES ('19', 'Ryan', '1234', 'ryan@gmail.com', 'm', '1985-09-24', '28', 'Belmont', 'CA', '94002', 'Making moves, tshirt design, writing music and poetry, drawing, photography, living life how I define it', '{/scaled_19-1.jpg,/scaled_19-2.jpg,/scaled_19-3.jpg}', '{/med_19-1.jpg,/med_19-2.jpg,/med_19-3.jpg}', '{/small_19-1.jpg,/small_19-2.jpg,/small_19-3.jpg}', 'f');
INSERT INTO "users" VALUES ('20', 'Sebastian', '1234', 'sebastian@gmail.com', 'm', '1991-03-01', '23', 'Richmond', 'CA', '94084', 'Technology - Crafting - Video Games - Using Common Sense - Rubiks Cube - Managing - Writing - Guitar - Fixing burned out light bulbs', '{/scaled_20-1.jpg,/scaled_20-2.jpg,/scaled_20-3.jpg}', '{/med_20-1.jpg,/med_20-2.jpg,/med_20-3.jpg}', '{/small_20-1.jpg,/small_20-2.jpg,/small_20-3.jpg}', 'f');
INSERT INTO "users" VALUES ('21', 'David', '1234', 'david@gmail.com', 'm', '1984-04-05', '30', 'San Mateo', 'CA', '94404', 'Sports, jeopardy, chess, poker, family, friends, music, books', '{/scaled_21-1.jpg,/scaled_21-2.jpg,/scaled_21-3.jpg}', '{/med_21-1.jpg,/med_21-2.jpg,/med_21-3.jpg}', '{/small_21-1.jpg,/small_21-2.jpg,/small_21-3.jpg}', 'f');
INSERT INTO "users" VALUES ('22', 'Andrew', '1234', 'andrew@gmail.com', 'm', '1985-12-15', '28', 'Berkeley', 'CA', '94704', 'I''ve never been beaten at MarioKart 64. Ever. I''m the best on Earth. It''s a curse', '{/scaled_22-1.jpg,/scaled_22-2.jpg,/scaled_22-3.jpg}', '{/med_22-1.jpg,/med_22-2.jpg,/med_22-3.jpg}', '{/small_22-1.jpg,/small_22-2.jpg,/small_22-3.jpg}', 'f');
COMMIT;


SELECT setval('users_userid_seq', 24, false);

-- ----------------------------
--  Table structure for userprefs
-- ----------------------------
-- DROP TABLE IF EXISTS "userprefs";
-- CREATE TABLE "userprefs" (
--     "userid" int4 NOT NULL,
--     "male" bool,
--     "female" bool,
--     "age_min" int4,
--     "age_max" int4,
--     "distance_max" int4
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "userprefs" OWNER TO "sidebar";

-- ----------------------------
--  Records of userprefs
-- ----------------------------
BEGIN;
INSERT INTO "userprefs" VALUES ('1', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('2', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('3', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('4', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('5', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('6', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('7', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('8', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('9', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('10', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('11', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('12', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('13', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('14', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('15', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('16', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('17', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('18', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('19', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('20', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('21', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('22', 'f', 't', '20', '30', '45');
INSERT INTO "userprefs" VALUES ('23', 't', 'f', '22', '28', '30');
COMMIT;

 -- SELECT userid, username, dateofbirth, location_city, location_state, personal_blurb, imageurls, medimageurls, smallimageurls, (SELECT count(*) from dancecard where userid=2 AND status='added') AS dancecard_count, logged_in 
 --                            FROM users WHERE userid=2;

-- ----------------------------
--  Table structure for dancecard
-- ----------------------------
-- DROP TABLE IF EXISTS "dancecard";
-- CREATE TABLE "dancecard" (
--     "userid" int4 NOT NULL,
--     "partnerid" int4 NOT NULL,
--     "status" varchar(10) COLLATE "default",
--     "mutual" bool DEFAULT false,
--     "updatetime" timestamp(6) NULL
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "dancecard" OWNER TO "sidebar";

-- ----------------------------
--  Records of dancecard
-- ----------------------------
BEGIN;
INSERT INTO "dancecard" VALUES ('11', '23', 'added', 't', '2014-05-05 19:48:47');
INSERT INTO "dancecard" VALUES ('23', '11', 'added', 't', '2014-05-05 17:54:10');
INSERT INTO "dancecard" VALUES ('23', '2', 'added', 'f', '2014-05-05 17:58:51');
COMMIT;

-- ----------------------------
--  Table structure for messages
-- ----------------------------
-- DROP TABLE IF EXISTS "messages";
-- CREATE TABLE "messages" (
--     "senderid" int4 NOT NULL,
--     "receiverid" int4 NOT NULL,
--     "message" text NOT NULL COLLATE "default",
--     "sendtime" timestamp(6) NOT NULL
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "messages" OWNER TO "sidebar";

-- ----------------------------
--  Records of messages
-- ----------------------------
BEGIN;
INSERT INTO "messages" VALUES ('11', '23', 'Hi there cutie!', '2014-05-05 15:40:17');
INSERT INTO "messages" VALUES ('23', '11', 'I see you''re on github?', '2014-05-05 16:39:59');
COMMIT;

-- ----------------------------
--  Table structure for notifications
-- ----------------------------
-- DROP TABLE IF EXISTS "notifications";
-- CREATE TABLE "notifications" (
--     "notificationid" serial,
--     "userid" int4,
--     "about_userid" int4,
--     "message" varchar(140) NOT NULL COLLATE "default",
--     "action_time" timestamp(6) NULL,
--     "type" varchar(10) COLLATE "default",
--     "subtype" varchar(10) COLLATE "default",
--     "status" varchar(10) DEFAULT 'unread'::character varying COLLATE "default"
-- )
-- WITH (OIDS=FALSE);
-- -- ALTER TABLE "notifications" OWNER TO "sidebar";

-- SELECT setval('notifications_notificationid_seq', 1, false);

-- ----------------------------
--  Table structure for urls
-- -- ----------------------------
-- DROP TABLE IF EXISTS "urls" CASCADE;
-- CREATE TABLE "urls" (
--     "urlid" SERIAL,
--     "url" varchar(300) COLLATE "default",
--     "page_title" varchar(140) COLLATE "default",
--     "primary_img_url" varchar(140) COLLATE "default"
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "urls" OWNER TO "sidebar";

-- ----------------------------
--  Records of urls
-- ----------------------------
BEGIN;
INSERT INTO "urls" VALUES ('8', 'http://www.webmd.com/women/guide/essential-vitamins-for-women-at-every-age', 'Essential Vitamins for Women at Every Age', null);
INSERT INTO "urls" VALUES ('13', 'https://wwws.mint.com/login.event', 'Mint.com', null);
INSERT INTO "urls" VALUES ('14', 'https://chaseonline.chase.com/', 'Chase Online - Logon', null);
INSERT INTO "urls" VALUES ('16', 'http://www.adamwaaramaa.com/fundraising/writing-your-pitch-deck/', 'How To Write A Killer Pitch Deck In 10 Slides | Adam Waaramaa On Entrepreneurship', null);
INSERT INTO "urls" VALUES ('18', 'http://www.thewhir.com/web-hosting-news/hackers-find-cloud-account-credentials-github-leading-72-hour-cryptocurrency-mining-spree', 'Hackers Find Cloud Account Credentials on GitHub Leading to 72-Hour Cryptocurrency Mining Spree - Web Host Industry Review', null);
INSERT INTO "urls" VALUES ('20', 'http://www.netflix.com/WiPlayer?movieid=70267239&trkid=13462260&tctx=0%2C0%2C4c7eecbf-d697-4cef-a100-83ed8e72f3e8-693061', 'Netflix', null);
INSERT INTO "urls" VALUES ('25', 'https://www.netflix.com/?locale=en-US', 'Netflix - Watch TV Shows Online, Watch Movies Online', null);
INSERT INTO "urls" VALUES ('27', 'http://assorted-experience.blogspot.com/2014/05/doctesting-python-command-line-scripts.html', 'Assorted Experience: Doctesting Python command line scripts', null);
INSERT INTO "urls" VALUES ('36', 'https://news.ycombinator.com/newest', 'New Links | Hacker News', null);
INSERT INTO "urls" VALUES ('43', 'https://www.comixology.com/top-rated', 'Top Rated Comics - Comics by comiXology', null);
INSERT INTO "urls" VALUES ('1', 'http://techcrunch.com/2014/05/05/facebook-acqusition-helped-oculus/', 'Oculus CEO Says Selling To Facebook Convinced Big Developers To Build For It | TechCrunch', 'http://tctechcrunch2011.files.wordpress.com/2014/05/brendan-iribe-oculus12.jpg');
INSERT INTO "urls" VALUES ('3', 'https://vine.co/lists/20-explosive-moments-when-the-beat-drops', 'https://vine.co/lists/20-explosive-moments-when-the-beat-drops', 'https://vine.co/assets/images/meta/vine_screencap.png');
INSERT INTO "urls" VALUES ('5', 'http://mashable.com/2014/05/05/doge-vine/', 'Much Doge on Vine. So Wow.', 'http://rack.1.mshcdn.com/media/ZgkyMDE0LzA1LzA1L2ExL0RvZ2VWaW5lLjdkNGY5LmpwZwpwCXRodW1iCTk1MHg1MzQjCmUJanBn/43950e8a/c33/Doge-Vine.jpg');
INSERT INTO "urls" VALUES ('2', 'http://techcrunch.com/', 'TechCrunch - The latest technology news and information on startups', 'http://s1.wp.com/wp-content/themes/vip/techcrunch-2013/assets/images/logo-large.png?m=1391183173g');
INSERT INTO "urls" VALUES ('4', 'https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable', 'https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable', 'https://vine.co/assets/images/meta/vine_screencap.png');
INSERT INTO "urls" VALUES ('6', 'http://mashable.com/2014/05/05/automattic-funding/', 'WordPress.com Creator Automattic Raises $160 Million', 'http://rack.2.mshcdn.com/media/ZgkyMDE0LzA1LzA1LzcwL211bGxlbndlZzEuYmEwM2QuanBnCnAJdGh1bWIJOTUweDUzNCMKZQlqcGc/b8478ee1/b93/mullenweg1.jpg');
INSERT INTO "urls" VALUES ('9', 'https://www.etsy.com/', 'Etsy - Your place to buy and sell all things handmade, vintage, and supplies', 'http://www.etsy.com/images/logo_no_border.gif');
INSERT INTO "urls" VALUES ('7', 'http://www.pinterest.com/pin/182395853631827993/', 'Pin by Evelyn Poeppelmeier on Style and Beauty: Dresses (Gowns and Re…', 'http://media-cache-ec0.pinimg.com/736x/66/75/a7/6675a752e2d18c4398ad722f3dd21324.jpg');
INSERT INTO "urls" VALUES ('11', 'http://americanfood.about.com/od/classicchowdersandstews/r/beefstew.htm', 'Old Fashioned Beef Stew Recipe - How to Make Old Fashioned Beef Stew', 'http://0.tqn.com/d/americanfood/1/0/v/-/-/-/beefstew.jpg');
INSERT INTO "urls" VALUES ('12', 'https://github.com/', 'GitHub', 'https://github.global.ssl.fastly.net/images/modules/open_graph/github-logo.png');
INSERT INTO "urls" VALUES ('15', 'http://www.iftf.org/what-we-do/who-we-are/staff/marina-gorbis/', 'IFTF: Marina Gorbis', 'http://www.iftf.org/uploads/RTEmagicC_picture-43.gif.gif');
INSERT INTO "urls" VALUES ('17', 'http://www.infoworld.com/d/security/github-bans-weak-passwords-after-brute-force-attack-results-in-compromised-accounts-231273', 'GitHub bans weak passwords after brute-force attack results in compromised accounts | Security - InfoWorld', 'http://computerworld.com.edgesuite.net/ifw/IFW.png');
INSERT INTO "urls" VALUES ('19', 'http://hbr.org/2014/01/how-netflix-reinvented-hr/ar/1', 'How Netflix Reinvented HR - Harvard Business Review', 'http://static.hbr.org/hbrg-main/resources/images/hbr_opengraph_360x185.png');
INSERT INTO "urls" VALUES ('23', 'https://www.youtube.com/watch?v=wo8aSo5Tv1E', 'Air - Moon Safari [Full Album] - YouTube', 'https://i1.ytimg.com/vi/wo8aSo5Tv1E/maxresdefault.jpg');
INSERT INTO "urls" VALUES ('10', 'http://www.ultimate-guitar.com/', 'ULTIMATE GUITAR TABS. 800,000 songs catalog with free Chords, Guitar Tabs, Bass Tabs, Ukulele Chords and Guitar Pro Tabs!', 'http://www.ultimate-guitar.com/tv/images/16168_r182858_thumbnail_small.jpg');
INSERT INTO "urls" VALUES ('21', 'https://www.ischool.berkeley.edu/about', 'About | School of Information', 'http://www.ischool.berkeley.edu/files/imagecache/og/i_square.jpg');
INSERT INTO "urls" VALUES ('26', 'http://www.nbcnews.com/storyline/missing-jet/boeing-rolls-royce-face-bill-over-hunt-flight-mh370-n97011', 'Boeing, Rolls-Royce to Face Bill Over Hunt for Flight MH370 - NBC News.com', 'http://media3.s-nbcnews.com/i/newscms/2014_18/418316/tdy_jet-comp_140503_df28c0aa38fb70472c7b9a055ada9805.jpg');
INSERT INTO "urls" VALUES ('28', 'https://medium.com/editors-picks/ad3d3c5e3c65', 'Forget 140 characters: Here’s How to Go to Jail for 10 Months for One ‘k’ — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*lWDlFbAzgqwW_RCf9FGaiQ.jpeg');
INSERT INTO "urls" VALUES ('24', 'http://www.slate.com/articles/podcasts/culturegabfest.html', 'Culture Gabfest', 'http://www.slate.com/etc/designs/slate/images/slate_facebook_icon.png');
INSERT INTO "urls" VALUES ('22', 'http://www.nytimes.com/', 'The New York Times - Breaking News, World News & Multimedia', 'http://i1.nyt.com/images/2014/05/06/health/POLIO/POLIO-largeHorizontal375.jpg');
INSERT INTO "urls" VALUES ('32', 'https://play.spotify.com/artist/1yAwtBaoHLEDWAnWR87hBT', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "urls" VALUES ('33', 'https://play.spotify.com/browse', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "urls" VALUES ('34', 'https://play.spotify.com/album/2okCg9scHue9GNELoB8U9g', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "urls" VALUES ('35', 'https://play.spotify.com/radio/artist/3TVXtAsR1Inumwj472S9r4', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "urls" VALUES ('37', 'https://www.youtube.com/watch?v=IgKWPdJWuBQ', 'Elon Musk: The mind behind Tesla, SpaceX, SolarCity ... - YouTube', 'https://i1.ytimg.com/vi/IgKWPdJWuBQ/maxresdefault.jpg');
INSERT INTO "urls" VALUES ('38', 'https://www.youtube.com/watch?v=6ycn5VmBUYY', '100 Days of Dance - YouTube', 'https://i1.ytimg.com/vi/6ycn5VmBUYY/maxresdefault.jpg');
INSERT INTO "urls" VALUES ('40', 'http://www.imdb.com/chart/top', 'IMDb Top 250 - IMDb', 'http://ia.media-imdb.com/images/G/01/imdb/images/logos/imdb_fb_logo-1730868325._V379391653_.png');
INSERT INTO "urls" VALUES ('42', 'http://www.nytimes.com/pages/opinion/index.html', 'Editorials, Columns, Op-Ed, Letters, Opinionator and More Opinion - The New York Times', 'http://graphics8.nytimes.com/images/2014/05/05/opinion/0503OPEDisland/0503OPEDisland-sfSpan-v2.jpg');
INSERT INTO "urls" VALUES ('39', 'https://www.youtube.com/watch?v=zRlpIkH3b5I', 'Photoshopping Real Women Into Cover Models - YouTube', 'https://i1.ytimg.com/vi/zRlpIkH3b5I/hqdefault.jpg');
INSERT INTO "urls" VALUES ('29', 'https://medium.com/editors-picks/a26385113bf0', 'Cold War Coloring Book Taught A-10 Pilots to Kill Soviet Tanks — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/blue/overlay/blue/1*t6gtNb-DAEXHHo1NZ3IPCQ.jpeg');
INSERT INTO "urls" VALUES ('30', 'https://medium.com/editors-picks/1bd6f5e75763', 'What Everyone Could Be Missing About the Kurt Cobain ‘Bitch With Zits’ Letter  — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/yellow/overlay/yellow/1*0n_-k5-MxIu3uXBcTVg1Xg.jpeg');
INSERT INTO "urls" VALUES ('31', 'https://medium.com/editors-picks/646320568f9d', 'When a Kidnapped Journalist Is a Freelancer — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*ltkYYkHx6CHF5TzMqTO4hw.jpeg');
INSERT INTO "urls" VALUES ('41', 'http://www.nytimes.com/roomfordebate/2014/05/04/how-should-electronic-cigarretes-be-regulated', 'How Should Electronic Cigarretes Be Regulated? - Room for Debate - NYTimes.com', 'http://graphics8.nytimes.com/images/2014/04/29/opinion/rfdvaping/rfdvaping-thumbWide.jpg');
INSERT INTO "urls" VALUES ('44', 'http://www.pinterest.com/all/humor/', 'Humor on Pinterest - funny pictures, quotes and memes', 'http://media-cache-ak0.pinimg.com/236x/62/e5/83/62e5835df7b7c13edbdc1aeead3a3273.jpg');
INSERT INTO "urls" VALUES ('45', 'https://www.google.com/', 'Google Home Page', null);
COMMIT;

SELECT setval('urls_urlid_seq', 46, false);

-- ----------------------------
--  Table structure for url_categories
-- -- ----------------------------
-- DROP TABLE IF EXISTS "url_categories";
-- CREATE TABLE "url_categories" (
--     "urlid" int4 NOT NULL,
--     "level1" varchar(40) NOT NULL COLLATE "default",
--     "level2" varchar(40) NOT NULL COLLATE "default",
--     "level3" varchar(40) NOT NULL COLLATE "default",
--     "level4" varchar(40) COLLATE "default",
--     "level5" varchar(40) COLLATE "default",
--     "score" numeric(6,6)
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "url_categories" OWNER TO "sidebar";

-- ----------------------------
--  Records of url_categories
-- ----------------------------
BEGIN;
INSERT INTO "url_categories" VALUES ('3', 'travel', 'specialty travel', 'vineyards', '', '', '0.771858');
INSERT INTO "url_categories" VALUES ('3', 'food and drink', 'beverages', 'alcoholic beverages', 'wine', '', '0.633116');
INSERT INTO "url_categories" VALUES ('3', 'business and industrial', 'agriculture and forestry', 'crops and seed', '', '', '0.054800');
INSERT INTO "url_categories" VALUES ('1', 'technology and computing', 'internet technology', 'social network', '', '', '0.488826');
INSERT INTO "url_categories" VALUES ('1', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.288975');
INSERT INTO "url_categories" VALUES ('1', 'business and industrial', '', '', '', '', '0.247608');
INSERT INTO "url_categories" VALUES ('5', 'family and parenting', '', '', '', '', '0.437683');
INSERT INTO "url_categories" VALUES ('5', 'pets', 'cats', '', '', '', '0.281174');
INSERT INTO "url_categories" VALUES ('5', 'education', 'homework and study tips', '', '', '', '0.246091');
INSERT INTO "url_categories" VALUES ('4', 'travel', 'specialty travel', 'vineyards', '', '', '0.771858');
INSERT INTO "url_categories" VALUES ('4', 'food and drink', 'beverages', 'alcoholic beverages', 'wine', '', '0.633116');
INSERT INTO "url_categories" VALUES ('4', 'business and industrial', 'agriculture and forestry', 'crops and seed', '', '', '0.054800');
INSERT INTO "url_categories" VALUES ('6', 'family and parenting', '', '', '', '', '0.394961');
INSERT INTO "url_categories" VALUES ('6', 'art and entertainment', 'visual art and design', 'design', '', '', '0.285270');
INSERT INTO "url_categories" VALUES ('6', 'business and industrial', 'company', 'merger and acquisition', '', '', '0.218782');
INSERT INTO "url_categories" VALUES ('2', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.366779');
INSERT INTO "url_categories" VALUES ('2', 'hobbies and interests', 'guitar', '', '', '', '0.301621');
INSERT INTO "url_categories" VALUES ('2', 'business and industrial', '', '', '', '', '0.281700');
INSERT INTO "url_categories" VALUES ('9', 'technology and computing', 'internet technology', 'email', '', '', '0.634357');
INSERT INTO "url_categories" VALUES ('9', 'shopping', 'gifts', '', '', '', '0.413833');
INSERT INTO "url_categories" VALUES ('9', 'hobbies and interests', 'arts and crafts', 'crochet', '', '', '0.409018');
INSERT INTO "url_categories" VALUES ('15', 'family and parenting', 'children', '', '', '', '0.426110');
INSERT INTO "url_categories" VALUES ('15', 'society', '', '', '', '', '0.333390');
INSERT INTO "url_categories" VALUES ('15', 'business and industrial', '', '', '', '', '0.235372');
INSERT INTO "url_categories" VALUES ('7', 'finance', 'bank', 'atms', '', '', '0.544048');
INSERT INTO "url_categories" VALUES ('7', 'family and parenting', '', '', '', '', '0.391303');
INSERT INTO "url_categories" VALUES ('7', 'style and fashion', 'jewelry', 'bracelets', '', '', '0.373276');
INSERT INTO "url_categories" VALUES ('11', 'home and garden', 'appliances', 'small appliances', 'food processors', '', '0.500086');
INSERT INTO "url_categories" VALUES ('11', 'business and industrial', 'energy', 'oil', '', '', '0.489626');
INSERT INTO "url_categories" VALUES ('11', 'food and drink', 'desserts and baking', '', '', '', '0.393319');
INSERT INTO "url_categories" VALUES ('17', 'technology and computing', 'programming languages', 'java', '', '', '0.522546');
INSERT INTO "url_categories" VALUES ('17', 'technology and computing', 'software', '', '', '', '0.460356');
INSERT INTO "url_categories" VALUES ('17', 'shopping', 'resources', 'product reviews', '', '', '0.352878');
INSERT INTO "url_categories" VALUES ('16', 'business and industrial', '', '', '', '', '0.361359');
INSERT INTO "url_categories" VALUES ('16', 'business and industrial', 'business operations', 'business plans', '', '', '0.256385');
INSERT INTO "url_categories" VALUES ('16', 'hobbies and interests', 'reading', '', '', '', '0.184031');
INSERT INTO "url_categories" VALUES ('14', 'technology and computing', 'internet technology', 'email', '', '', '0.554103');
INSERT INTO "url_categories" VALUES ('14', 'society', 'crime', 'property crime', 'piracy', '', '0.449075');
INSERT INTO "url_categories" VALUES ('14', 'technology and computing', 'consumer electronics', 'game systems and consoles', 'xbox', '', '0.365870');
INSERT INTO "url_categories" VALUES ('20', 'technology and computing', 'internet technology', 'email', '', '', '0.663538');
INSERT INTO "url_categories" VALUES ('20', 'technology and computing', 'internet technology', 'social network', '', '', '0.426642');
INSERT INTO "url_categories" VALUES ('20', 'news', 'local news', '', '', '', '0.347285');
INSERT INTO "url_categories" VALUES ('19', 'business and industrial', '', '', '', '', '0.384719');
INSERT INTO "url_categories" VALUES ('19', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.275626');
INSERT INTO "url_categories" VALUES ('19', 'education', '', '', '', '', '0.247802');
INSERT INTO "url_categories" VALUES ('10', 'technology and computing', 'programming languages', 'javascript', '', '', '0.771187');
INSERT INTO "url_categories" VALUES ('10', 'technology and computing', 'software', 'databases', '', '', '0.165709');
INSERT INTO "url_categories" VALUES ('10', 'technology and computing', 'internet technology', 'email', '', '', '0.143043');
INSERT INTO "url_categories" VALUES ('12', 'technology and computing', 'software', '', '', '', '0.331832');
INSERT INTO "url_categories" VALUES ('12', 'business and industrial', '', '', '', '', '0.157346');
INSERT INTO "url_categories" VALUES ('12', 'business and industrial', 'business operations', 'management', 'project management', '', '0.150008');
INSERT INTO "url_categories" VALUES ('21', 'education', 'school', '', '', '', '0.469108');
INSERT INTO "url_categories" VALUES ('21', 'science', 'computer science', 'information science', '', '', '0.187253');
INSERT INTO "url_categories" VALUES ('21', 'careers', '', '', '', '', '0.159794');
INSERT INTO "url_categories" VALUES ('18', 'society', 'crime', 'property crime', 'larceny', '', '0.422567');
INSERT INTO "url_categories" VALUES ('18', 'sports', 'running and jogging', '', '', '', '0.307609');
INSERT INTO "url_categories" VALUES ('18', 'technology and computing', '', '', '', '', '0.246521');
INSERT INTO "url_categories" VALUES ('27', 'technology and computing', 'programming languages', 'c and c++', '', '', '0.320373');
INSERT INTO "url_categories" VALUES ('27', 'technology and computing', 'mp3 and midi', '', '', '', '0.239909');
INSERT INTO "url_categories" VALUES ('27', 'technology and computing', 'hardware', 'computer', '', '', '0.207707');
INSERT INTO "url_categories" VALUES ('25', 'business and industrial', 'advertising and marketing', 'advertising', '', '', '0.254679');
INSERT INTO "url_categories" VALUES ('25', 'technology and computing', '', '', '', '', '0.156716');
INSERT INTO "url_categories" VALUES ('25', 'technology and computing', 'internet technology', 'web search', '', '', '0.128620');
INSERT INTO "url_categories" VALUES ('29', 'law, govt and politics', 'armed forces', 'air force', '', '', '0.439661');
INSERT INTO "url_categories" VALUES ('29', 'law, govt and politics', 'armed forces', 'army', '', '', '0.262220');
INSERT INTO "url_categories" VALUES ('29', 'art and entertainment', 'visual art and design', 'drawing', '', '', '0.216497');
INSERT INTO "url_categories" VALUES ('28', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.532373');
INSERT INTO "url_categories" VALUES ('28', 'style and fashion', 'accessories', 'hats', '', '', '0.500143');
INSERT INTO "url_categories" VALUES ('28', 'technology and computing', 'internet technology', 'email', '', '', '0.443534');
INSERT INTO "url_categories" VALUES ('24', 'family and parenting', '', '', '', '', '0.318184');
INSERT INTO "url_categories" VALUES ('24', 'education', 'school', '', '', '', '0.313217');
INSERT INTO "url_categories" VALUES ('24', 'news', '', '', '', '', '0.286366');
INSERT INTO "url_categories" VALUES ('22', 'automotive and vehicles', 'cars', '', '', '', '0.701591');
INSERT INTO "url_categories" VALUES ('22', 'shopping', 'resources', 'product reviews', '', '', '0.474771');
INSERT INTO "url_categories" VALUES ('22', 'technology and computing', 'internet technology', 'web search', '', '', '0.472867');
INSERT INTO "url_categories" VALUES ('23', 'art and entertainment', 'music', '', '', '', '0.137966');
INSERT INTO "url_categories" VALUES ('23', 'travel', 'tourist destinations', 'france', '', '', '0.095961');
INSERT INTO "url_categories" VALUES ('23', 'technology and computing', 'internet technology', 'email', '', '', '0.093337');
INSERT INTO "url_categories" VALUES ('32', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "url_categories" VALUES ('32', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "url_categories" VALUES ('32', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "url_categories" VALUES ('33', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "url_categories" VALUES ('33', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "url_categories" VALUES ('33', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "url_categories" VALUES ('34', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "url_categories" VALUES ('34', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "url_categories" VALUES ('34', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "url_categories" VALUES ('37', 'business and industrial', 'business operations', 'business plans', '', '', '0.599520');
INSERT INTO "url_categories" VALUES ('37', 'automotive and vehicles', 'electric vehicles', '', '', '', '0.224540');
INSERT INTO "url_categories" VALUES ('37', 'technology and computing', '', '', '', '', '0.192090');
INSERT INTO "url_categories" VALUES ('30', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.433114');
INSERT INTO "url_categories" VALUES ('30', 'technology and computing', 'internet technology', 'email', '', '', '0.298543');
INSERT INTO "url_categories" VALUES ('30', 'hobbies and interests', 'guitar', '', '', '', '0.236217');
INSERT INTO "url_categories" VALUES ('35', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "url_categories" VALUES ('35', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "url_categories" VALUES ('35', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "url_categories" VALUES ('36', 'news', '', '', '', '', '0.389049');
INSERT INTO "url_categories" VALUES ('36', 'travel', '', '', '', '', '0.321863');
INSERT INTO "url_categories" VALUES ('36', 'technology and computing', 'software', '', '', '', '0.303563');
INSERT INTO "url_categories" VALUES ('38', 'technology and computing', 'consumer electronics', 'camera and photo equipment', 'cameras and camcorders', 'cameras', '0.679511');
INSERT INTO "url_categories" VALUES ('38', 'careers', 'nursing', '', '', '', '0.248631');
INSERT INTO "url_categories" VALUES ('38', 'law, govt and politics', 'politics', 'elections', '', '', '0.134952');
INSERT INTO "url_categories" VALUES ('41', 'law, govt and politics', 'legal issues', 'legislation', '', '', '0.446285');
INSERT INTO "url_categories" VALUES ('41', 'health and fitness', 'addiction', 'smoking addiction', '', '', '0.256792');
INSERT INTO "url_categories" VALUES ('41', 'food and drink', '', '', '', '', '0.155291');
INSERT INTO "url_categories" VALUES ('42', 'hobbies and interests', 'getting published', 'freelance writing', '', '', '0.577079');
INSERT INTO "url_categories" VALUES ('42', 'science', 'biology', 'cytology', '', '', '0.576974');
INSERT INTO "url_categories" VALUES ('42', 'society', 'crime', '', '', '', '0.535476');
INSERT INTO "url_categories" VALUES ('39', 'technology and computing', 'internet technology', 'social network', '', '', '0.560452');
INSERT INTO "url_categories" VALUES ('39', 'health and fitness', 'disease', 'allergies', '', '', '0.401354');
INSERT INTO "url_categories" VALUES ('39', 'society', 'dating', '', '', '', '0.374853');
INSERT INTO "url_categories" VALUES ('44', 'health and fitness', 'disorders', 'mental disorder', 'panic and anxiety', '', '0.590479');
INSERT INTO "url_categories" VALUES ('44', 'food and drink', '', '', '', '', '0.537762');
INSERT INTO "url_categories" VALUES ('44', 'religion and spirituality', '', '', '', '', '0.385138');
INSERT INTO "url_categories" VALUES ('31', 'society', 'unrest and war', '', '', '', '0.300496');
INSERT INTO "url_categories" VALUES ('31', 'family and parenting', '', '', '', '', '0.260903');
INSERT INTO "url_categories" VALUES ('31', 'business and industrial', '', '', '', '', '0.217887');
INSERT INTO "url_categories" VALUES ('43', 'art and entertainment', 'comics and animation', 'comics', '', '', '0.624668');
INSERT INTO "url_categories" VALUES ('43', 'hobbies and interests', 'games', 'role playing games', '', '', '0.565756');
INSERT INTO "url_categories" VALUES ('43', 'technology and computing', 'software', 'shareware and freeware', '', '', '0.399031');
INSERT INTO "url_categories" VALUES ('40', 'society', 'work', 'unemployment', '', '', '0.527083');
INSERT INTO "url_categories" VALUES ('40', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.454305');
INSERT INTO "url_categories" VALUES ('40', 'technology and computing', 'operating systems', 'mac os', '', '', '0.243126');
INSERT INTO "url_categories" VALUES ('45', 'news', 'dating', 'blank', 'blank', 'blank', '0.100000');
COMMIT;


-- ----------------------------
--  Table structure for user_history
-- -- ----------------------------
-- DROP TABLE IF EXISTS "user_history";
-- CREATE TABLE "user_history" (
--     "userid" int4 NOT NULL,
--     "urlid" int4 NOT NULL,
--     "visit_count" int4,
--     "last_visit" timestamp(6) NULL
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "user_history" OWNER TO "sidebar";

-- ----------------------------
--  Records of user_history
-- ----------------------------
BEGIN;
INSERT INTO "user_history" VALUES ('2', '12', '1', null);
INSERT INTO "user_history" VALUES ('3', '12', '1', null);
INSERT INTO "user_history" VALUES ('4', '12', '1', null);
INSERT INTO "user_history" VALUES ('2', '22', '1', null);
INSERT INTO "user_history" VALUES ('10', '45', '1', null);
INSERT INTO "user_history" VALUES ('11', '45', '1', null);
INSERT INTO "user_history" VALUES ('12', '45', '1', null);
INSERT INTO "user_history" VALUES ('13', '45', '1', null);
INSERT INTO "user_history" VALUES ('14', '45', '1', null);
INSERT INTO "user_history" VALUES ('15', '45', '1', null);
INSERT INTO "user_history" VALUES ('16', '45', '1', null);
INSERT INTO "user_history" VALUES ('17', '45', '1', null);
INSERT INTO "user_history" VALUES ('18', '45', '1', null);
INSERT INTO "user_history" VALUES ('19', '45', '1', null);
INSERT INTO "user_history" VALUES ('20', '45', '1', null);
INSERT INTO "user_history" VALUES ('23', '12', '1', null);
INSERT INTO "user_history" VALUES ('23', '22', '1', null);
INSERT INTO "user_history" VALUES ('23', '45', '1', null);
INSERT INTO "user_history" VALUES ('11', '29', '1', null);
INSERT INTO "user_history" VALUES ('11', '30', '1', null);
INSERT INTO "user_history" VALUES ('23', '43', '4', null);
INSERT INTO "user_history" VALUES ('10', '42', '3', null);
INSERT INTO "user_history" VALUES ('11', '42', '3', null);
INSERT INTO "user_history" VALUES ('13', '42', '3', null);
INSERT INTO "user_history" VALUES ('12', '2', '3', null);
INSERT INTO "user_history" VALUES ('14', '2', '3', null);
INSERT INTO "user_history" VALUES ('15', '2', '3', null);
INSERT INTO "user_history" VALUES ('16', '2', '3', null);
INSERT INTO "user_history" VALUES ('17', '42', '3', null);
INSERT INTO "user_history" VALUES ('18', '3', '3', null);
INSERT INTO "user_history" VALUES ('19', '4', '3', null);
INSERT INTO "user_history" VALUES ('20', '5', '3', null);
INSERT INTO "user_history" VALUES ('21', '6', '3', null);
INSERT INTO "user_history" VALUES ('22', '7', '3', null);
COMMIT;



-- -- ----------------------------
-- --  Primary key structure for table dancecard
-- -- ----------------------------
-- ALTER TABLE "dancecard" ADD PRIMARY KEY ("userid", "partnerid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table messages
-- -- ----------------------------
-- ALTER TABLE "messages" ADD PRIMARY KEY ("senderid", "receiverid", "sendtime") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table notifications
-- -- ----------------------------
-- ALTER TABLE "notifications" ADD PRIMARY KEY ("notificationid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table url_categories
-- -- ----------------------------
-- ALTER TABLE "url_categories" ADD PRIMARY KEY ("urlid", "level1", "level2", "level3") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table urls
-- -- ----------------------------
-- ALTER TABLE "urls" ADD PRIMARY KEY ("urlid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table user_history
-- -- ----------------------------
-- ALTER TABLE "user_history" ADD PRIMARY KEY ("userid", "urlid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table userprefs
-- -- ----------------------------
-- ALTER TABLE "userprefs" ADD PRIMARY KEY ("userid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Checks structure for table userprefs
-- -- ----------------------------
-- ALTER TABLE "userprefs" ADD CONSTRAINT "userprefs_check" CHECK ((age_max > age_min)) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Primary key structure for table users
-- -- ----------------------------
-- ALTER TABLE "users" ADD PRIMARY KEY ("userid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Checks structure for table users
-- -- ----------------------------
-- ALTER TABLE "users" ADD CONSTRAINT "users_dateofbirth_check" CHECK ((dateofbirth < ('now'::text)::date)) NOT DEFERRABLE INITIALLY IMMEDIATE;
-- ALTER TABLE "users" ADD CONSTRAINT "users_age_check" CHECK (((age > 0) AND (age < 100))) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Foreign keys structure for table dancecard
-- -- ----------------------------
-- ALTER TABLE "dancecard" ADD CONSTRAINT "dancecard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
-- ALTER TABLE "dancecard" ADD CONSTRAINT "dancecard_partnerid_fkey" FOREIGN KEY ("partnerid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Foreign keys structure for table messages
-- -- ----------------------------
-- ALTER TABLE "messages" ADD CONSTRAINT "messages_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;
-- ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverid_fkey" FOREIGN KEY ("receiverid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Foreign keys structure for table notifications
-- -- ----------------------------
-- ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
-- ALTER TABLE "notifications" ADD CONSTRAINT "notifications_about_userid_fkey" FOREIGN KEY ("about_userid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Foreign keys structure for table url_categories
-- -- ----------------------------
-- ALTER TABLE "url_categories" ADD CONSTRAINT "url_categories_urlid_fkey" FOREIGN KEY ("urlid") REFERENCES "urls" ("urlid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Foreign keys structure for table user_history
-- -- ----------------------------
-- ALTER TABLE "user_history" ADD CONSTRAINT "user_history_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
-- ALTER TABLE "user_history" ADD CONSTRAINT "user_history_urlid_fkey" FOREIGN KEY ("urlid") REFERENCES "urls" ("urlid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -- ----------------------------
-- --  Foreign keys structure for table userprefs
-- -- ----------------------------
-- ALTER TABLE "userprefs" ADD CONSTRAINT "userprefs_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

DROP FUNCTION IF EXISTS dancecard_notification();
DROP FUNCTION IF EXISTS message_notification();
DROP FUNCTION IF EXISTS notify_trigger();
DROP FUNCTION IF EXISTS check_mutual(userid1 int, userid2 int);
DROP FUNCTION IF EXISTS youMatchTheirPreferences(int);
DROP FUNCTION IF EXISTS theyMatchYourPreferences(useridToTest int);
DROP FUNCTION IF EXISTS getPrimaryUsers(useridToTest int);
DROP FUNCTION IF EXISTS getSecondaryUsers(useridToTest int);

CREATE FUNCTION dancecard_notification() RETURNS TRIGGER AS $$
DECLARE
    -- name varchar := SELECT username FROM users WHERE userid = NEW.userid;
    name varchar(30);
    message varchar := '';
    mutualVar boolean := 'false';
    status_check varchar;
    subTypeVar varchar(10);

BEGIN
    SELECT INTO name username FROM users WHERE userid = NEW.userid;
    SELECT INTO status_check status FROM dancecard WHERE userid = NEW.partnerid AND partnerid = NEW.userid;

    IF (status_check = 'added' AND NEW.status = 'added') THEN
        mutualVar := 'true';
        NEW.mutual = 'true';
    ELSE
        mutualVar := 'false';
        NEW.mutual = 'false';
    END IF;

    UPDATE dancecard SET mutual = mutualVar WHERE (partnerid=NEW.partnerid OR userid=NEW.partnerid) AND (userid=NEW.userid OR partnerid=NEW.userid);
    -- UPDATE dancecard SET mutual = (SELECT check_mutual(14,1)) WHERE (partnerid=1 AND userid=14) OR (partnerid=14 AND userid=1);

    RAISE NOTICE 'what is mutual? , %', mutualVar;
    RAISE NOTICE 'what is NEW? , %', NEW;

    IF (TG_OP = 'INSERT') THEN
        IF (mutualVar) THEN
            message := name || ' added you back';
            subTypeVar := 'mutual';
        ELSE
            message := name || ' added you to their dancecard';
            subTypeVar := 'added';
        END IF;
    END IF;

    IF (TG_OP = 'UPDATE' AND NEW.status = 'removed') THEN
        message := name || ' removed you from their dancecard';
        subTypeVar := 'removed';
    END IF;

    INSERT INTO notifications (userid, about_userid, message, action_time, type, subtype)
        VALUES (NEW.partnerid, NEW.userid, message ,CURRENT_TIMESTAMP, 'dancecard', subTypeVar);

    RETURN NEW;
END $$ LANGUAGE 'plpgsql';

CREATE FUNCTION message_notification() RETURNS TRIGGER AS $$
DECLARE
    -- name varchar := SELECT username FROM users WHERE userid = NEW.userid;
    name varchar(30);
    message varchar := '';

BEGIN
    SELECT INTO name username FROM users WHERE userid = NEW.senderid;

    IF (TG_OP = 'INSERT') THEN
        message := name || ' sent you a message';
    END IF;

    INSERT INTO notifications (userid, about_userid, message, action_time, type, subtype)
        VALUES (NEW.receiverid, NEW.senderid, message ,CURRENT_TIMESTAMP, 'message', 'new');

    RETURN NEW;
END $$ LANGUAGE 'plpgsql';

CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE

    imageurl varchar(100); 
BEGIN
  -- PERFORM pg_notify('watchers', TG_TABLE_NAME || ',userid,' || NEW.userid );
  SELECT INTO imageurl smallimageurls[1] FROM users WHERE userid=NEW.about_userid; 

  PERFORM pg_notify('watchers', NEW.userid || ',' ||
                                NEW.notificationid || ',' ||
                                NEW.about_userid || ',' ||
                                NEW.message || ',' ||
                                NEW.action_time || ',' ||
                                NEW.type || ',' ||
                                NEW.subtype || ',' ||
                                NEW.status || ',' || 
                                imageurl);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION check_mutual(userid1 int, userid2 int) RETURNS boolean AS $$
DECLARE
    count int;
BEGIN

    SELECT INTO count COUNT(*) FROM dancecard  WHERE (userid=$1 OR partnerid=$1) AND (userid=$2 OR partnerid=$2) AND status='added';

    IF (count = 2) THEN
        RETURN 'true';
    ELSE
        RETURN 'false';
    END IF;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getPrimaryUsers(useridToTest int) 
    RETURNS  TABLE (
        userid          Integer, 
        username        varchar(30),
        gender          char(1),
        dateofbirth     date,
        location_city   varchar(30),
        location_state  varchar(30),
        zipCode         char(5),
        personal_blurb  varchar(300),
        imageurls       varchar(100) ARRAY,
        medimageurls    varchar(100) ARRAY,
        smallimageurls  varchar(100) ARRAY,
        logged_in       bool

        ) AS $$
DECLARE 
BEGIN
    
    RETURN QUERY
    SELECT * FROM youMatchTheirPreferences($1) INTERSECT SELECT * FROM theyMatchYourPreferences($1);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getSecondaryUsers(useridToTest int) 
    RETURNS  TABLE (
        userid          Integer, 
        username        varchar(30),
        gender          char(1),
        dateofbirth     date,
        location_city   varchar(30),
        location_state  varchar(30),
        zipCode         char(5),
        personal_blurb  varchar(300),
        imageurls       varchar(100) ARRAY,
        medimageurls    varchar(100) ARRAY,
        smallimageurls  varchar(100) ARRAY,
        logged_in       bool

        ) AS $$
DECLARE 
BEGIN
    
    RETURN QUERY
    SELECT * FROM youMatchTheirPreferences($1) EXCEPT SELECT *  FROM theyMatchYourPreferences($1);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION youMatchTheirPreferences(useridToTest int) 
    RETURNS  TABLE (
        userid          Integer, 
        username        varchar(30),
        gender          char(1),
        dateofbirth     date,
        location_city   varchar(30),
        location_state  varchar(30),
        zipCode         char(5),
        personal_blurb  varchar(300),
        imageurls       varchar(100) ARRAY,
        medimageurls    varchar(100) ARRAY,
        smallimageurls  varchar(100) ARRAY,
        logged_in       bool

        ) AS $$
DECLARE 
    genderToCheck char(1);
    ageToCheck Integer;
BEGIN

    SELECT INTO genderToCheck u.gender FROM users u WHERE (u.userid = $1);
    SELECT INTO ageToCheck EXTRACT(YEAR FROM (SELECT age(u.dateofbirth) FROM users u WHERE u.userid = $1));

    RAISE NOTICE 'what is genderToCheck? , %', genderToCheck;
    RAISE NOTICE 'what is ageToCheck? , %', ageToCheck;

    RETURN QUERY
    SELECT u.userid, 
           u.username, 
           u.gender, 
           u.dateofbirth, 
           u.location_city, 
           u.location_state,
           u.zipCode,
           u.personal_blurb,
           u.imageurls,
           u.medimageurls,
           u.smallimageurls,
           u.logged_in

    FROM users u, userprefs p 
    WHERE 
        u.userid=p.userid AND 
        (CASE WHEN p.male THEN 'm'=genderToCheck END OR
        CASE WHEN p.female THEN 'f'=genderToCheck END) AND 
        p.age_min <= ageToCheck AND 
        p.age_max >= ageToCheck;


END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION theyMatchYourPreferences(useridToTest int) 
    RETURNS  TABLE (
        userid          Integer, 
        username        varchar(30),
        gender          char(1),
        dateofbirth     date,
        location_city   varchar(30),
        location_state  varchar(30),
        zipCode         char(5),
        personal_blurb  varchar(300),
        imageurls       varchar(100) ARRAY,
        medimageurls    varchar(100) ARRAY,
        smallimageurls  varchar(100) ARRAY,
        logged_in       bool

        ) AS $$
DECLARE 
    acceptsMale char(1);
    acceptsFemale char(1);
    minAgeToCheck Integer;
    maxAgeToCheck Integer;
BEGIN

    SELECT INTO minAgeToCheck, maxAgeToCheck, acceptsMale, acceptsFemale 
                p.age_min, p.age_max, CASE p.male WHEN 't' THEN 'm' END AS men, CASE p.female WHEN 't' THEN 'f' END AS women 
                FROM userprefs p WHERE p.userid=$1;

-- SELECT userid FROM (SELECT userid, extract(YEAR from age(dateofbirth)) AS acceptable  FROM users) AS temp where acceptable>24 AND acceptable < 30;
    RETURN QUERY
    SELECT temp.userid, 
           temp.username, 
           temp.gender, 
           temp.dateofbirth, 
           temp.location_city, 
           temp.location_state,
           temp.zipCode,
           temp.personal_blurb,
           temp.imageurls,
           temp.medimageurls,
           temp.smallimageurls,
           temp.logged_in

    FROM  (SELECT u.userid,
                  u.username,
                  u.gender,
                  u.dateofbirth,
                  u.location_city,
                  u.location_state,
                  u.zipCode,
                  u.personal_blurb,
                  u.imageurls,
                  u.medimageurls,
                  u.smallimageurls,
                  u.logged_in,
                  extract(YEAR from age(u.dateofbirth)) AS acceptable  FROM users u) AS temp
    WHERE 
        acceptable >= minAgeToCheck AND 
        acceptable <= maxAgeToCheck AND
        (temp.gender=acceptsMale OR temp.gender=acceptsFemale);


END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER add_dancecard_notification AFTER INSERT OR UPDATE OF status ON "dancecard" FOR EACH ROW EXECUTE PROCEDURE dancecard_notification();
CREATE TRIGGER add_message_notification BEFORE INSERT ON "messages" FOR EACH ROW EXECUTE PROCEDURE message_notification();
CREATE TRIGGER watched_table_trigger AFTER INSERT ON "notifications" FOR EACH ROW EXECUTE PROCEDURE notify_trigger();


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

