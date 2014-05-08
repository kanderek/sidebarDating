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
DROP FUNCTION IF EXISTS dancecard_notification();
DROP FUNCTION IF EXISTS message_notification();
DROP FUNCTION IF EXISTS notify_trigger();
DROP FUNCTION IF EXISTS check_mutual(userid1 int, userid2 int);

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

CREATE FUNCTION dancecard_notification() RETURNS TRIGGER AS $_$
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
END $_$ LANGUAGE 'plpgsql';

CREATE FUNCTION message_notification() RETURNS TRIGGER AS $_$
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
END $_$ LANGUAGE 'plpgsql';

CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  -- PERFORM pg_notify('watchers', TG_TABLE_NAME || ',userid,' || NEW.userid );

  PERFORM pg_notify('watchers', NEW.userid || ',' || 
  								NEW.notificationid || ',' || 
  								NEW.about_userid || ',' || 
  								NEW.message || ',' || 
  								NEW.action_time || ',' || 
  								NEW.type || ',' || 
  								NEW.subtype || ',' || 
  								NEW.status);
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


CREATE TRIGGER add_dancecard_notification AFTER INSERT OR UPDATE OF status ON dancecard FOR EACH ROW EXECUTE PROCEDURE dancecard_notification();
CREATE TRIGGER add_message_notification BEFORE INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE message_notification();
CREATE TRIGGER watched_table_trigger AFTER INSERT ON notifications FOR EACH ROW EXECUTE PROCEDURE notify_trigger();

INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Aziz', 'Aziz@gmail.com', '1234', 'm', '1985-11-28', 
	   		   '94121', 'San Francisco', 'California', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lectus sed neque ultrices tincidunt. Aliquam erat volutpat. Aliquam erat.',
	   		   '{"/scaled_azizAnsari1.jpg", 
	   		     "/scaled_azizAnsari3.jpg",
    			 "/scaled_azizAnsari2.jpg"
    			 }',
    			 '{"/med_azizAnsari1.jpg",
    			   "/med_azizAnsari3.jpg",
   				   "/med_azizAnsari2.jpg"
   				   }',
   				   '{"/small_azizAnsari1.jpg",
    				"/small_azizAnsari3.jpg",
    				"/small_azizAnsari2.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (1, 'false', 'true', 22, 34, 15); 

INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Daniel', 'danny@gmail.com', '1234', 'm', '1990-3-14', 
	   		   '94121', 'San Francisco', 'California', 'Integer accumsan, felis vel tempor faucibus, nisl dui aliquam diam, ornare ultricies magna elit sit amet ipsum. Vivamus fermentum condimentum.',
	   		   '{"/scaled_danRadclife3.jpg",
    			"/scaled_danRadclife1.jpg",
   				 "/scaled_danRadclife2.jpg"
    			 }',
    			 '{"/med_danRadclife3.jpg",
   				   "/med_danRadclife1.jpg",
    				"/med_danRadclife2.jpg"
   				   }',
   				   '{ "/small_danRadclife3.jpg",
    				  "/small_danRadclife1.jpg",
  					  "/small_danRadclife2.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (2, 'false', 'true', 22, 34, 15); 

INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Michael', 'mike@gmail.com', '1234', 'm', '1987-8-2', 
	   		   '94103', 'San Francisco', 'California', 'Donec fermentum eget nibh et congue. Pellentesque facilisis neque et nulla scelerisque, tristique mattis mi dictum. Sed molestie mi eleifend.',
	   		   '{"/scaled_mikeCera3.jpg",
  				  "/scaled_mikeCera2.jpg",
  				  "/scaled_mikeCera1.jpg"
    			 }',
    			 '{"/med_mikeCera3.jpg",
    			  "/med_mikeCera2.jpg",
    			  "/med_mikeCera1.jpg"
   				   }',
   				   '{ "/small_mikeCera3.jpg",
    				  "/small_mikeCera2.jpg",
   					  "/small_mikeCera1.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (3, 'false', 'true', 22, 34, 15); 

INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Max', 'max@gmail.com', '1234', 'm', '1982-5-17', 
	   		   '94103', 'San Francisco', 'California', 'Ut elit sapien, malesuada in felis nec, imperdiet consequat leo. Nunc a velit eu tellus gravida interdum id quis mauris. Vestibulum tincidunt.',
	   		   '{"/scaled_maxGreenfield1.jpg",
  				 "/scaled_maxGreenfield3.jpg",
   				 "/scaled_maxGreenfield2.jpg"
    			 }',
    			 '{"/med_maxGreenfield1.jpg",
    				"/med_maxGreenfield3.jpg",
    				"/med_maxGreenfield2.jpg"
   				   }',
   				   '{ "/small_maxGreenfield1.jpg",
    				  "/small_maxGreenfield3.jpg",
    				  "/small_maxGreenfield2.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (4, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Mac', 'mac@gmail.com', '1234', 'm', '1991-1-17', 
	   		   '94103', 'San Francisco', 'California', 'Aliquam tincidunt diam quis lorem dignissim, sed venenatis odio ornare. Duis vel turpis interdum, rutrum metus ac, dictum risus.', 
	   		   '{"/scaled_macDemarco1.jpg",
			    "/scaled_macDemarco3.jpg",
			    "/scaled_macDemarco2.jpg"
    			 }',
    			 '{"/med_macDemarco1.jpg",
				    "/med_macDemarco3.jpg",
				    "/med_macDemarco2.jpg"
   				   }',
   				   '{ "/small_macDemarco1.jpg",
    				  "/small_macDemarco3.jpg",
   					  "/small_macDemarco2.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (5, 'false', 'true', 22, 34, 15); 

INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Jonah', 'jonah@gmail.com', '1234', 'm', '1989-10-30', 
	   		   '94103', 'San Francisco', 'California', 'Nullam vitae ultrices risus, id volutpat odio. Suspendisse convallis nibh eget nisi pharetra porta. Sed eget ligula ultrices, varius ligula quis.',
	   		   '{"/scaled_jonahHill2.jpg",
			    "/scaled_jonahHill3.jpg",
			    "/scaled_jonahHill1.jpg"
    			 }',
    			 '{"/med_jonahHill2.jpg",
				    "/med_jonahHill3.jpg",
				    "/med_jonahHill1.jpg"
   				   }',
   				   '{ "/small_jonahHill2.jpg",
				    "/small_jonahHill3.jpg",
				    "/small_jonahHill1.jpg"
    				}');


INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (6, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('John', 'john@gmail.com', '1234', 'm', '1981-9-2', 
	   		   '94103', 'San Francisco', 'California', 'Aenean dui turpis, pellentesque quis libero et, laoreet venenatis mauris. In facilisis, ante id vehicula aliquet, erat nulla placerat mauris.', 
	   		   '{"/scaled_johnCho3.jpg",
			    "/scaled_johnCho1.jpg",
			    "/scaled_johnCho2.jpg"
    			 }',
    			 '{"/med_johnCho3.jpg",
				    "/med_johnCho1.jpg",
				    "/med_johnCho2.jpg"
   				   }',
   				   '{ "/small_johnCho3.jpg",
					    "/small_johnCho1.jpg",
					    "/small_johnCho2.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (7, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Joe', 'joe@gmail.com', '1234', 'm', '1984-7-28', 
	   		   '94103', 'San Francisco', 'California', 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur imperdiet augue ut consectetur.', 
	   		   '{"/scaled_jgl2.jpg",
			    "/scaled_jgl3.jpg",
			    "/scaled_jgl1.jpg"
    			 }',
    			 '{"/med_jgl2.jpg",
				    "/med_jgl3.jpg",
				    "/med_jgl1.jpg"
   				   }',
   				   '{ "/small_jgl2.jpg",
					    "/small_jgl3.jpg",
					    "/small_jgl1.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (8, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Jason', 'jason@gmail.com', '1234', 'm', '1983-11-14', 
	   		   '94103', 'San Francisco', 'California', 'Nunc varius elit at rutrum molestie. Sed molestie ornare eros, in feugiat massa cursus ut. Vestibulum vitae erat velit. In pharetra felis dolor.', 
	   		   '{"/scaled_jasonSegel1.jpg",
			    "/scaled_jasonSegel3.JPG",
			    "/scaled_jasonSegel2.jpg"
    			 }',
    			 '{"/med_jasonSegel1.jpg",
				    "/med_jasonSegel3.JPG",
				    "/med_jasonSegel2.jpg"
   				   }',
   				   '{ "/small_jasonSegel1.jpg",
					    "/small_jasonSegel3.JPG",
					    "/small_jasonSegel2.jpg"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (9, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Martin', 'martin@gmail.com', '1234', 'm', '1982-10-14', 
	   		   '94103', 'San Francisco', 'California', 'Nam eleifend accumsan urna et eleifend. Sed ornare nulla eu risus volutpat, quis hendrerit erat condimentum. Eu sollicitudin nibh posuere.', 
	   		   '{"/scaled_martinStarr1.jpg",
			    "/scaled_martinStarr2.jpg",
			    "/scaled_martinStarr3.png"
    			 }',
    			 '{"/med_martinStarr1.jpg",
				    "/med_martinStarr2.jpg",
				    "/med_martinStarr3.png"
   				   }',
   				   '{ "/small_martinStarr1.jpg",
				    "/small_martinStarr2.jpg",
				    "/small_martinStarr3.png"
    				}');

	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (10, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Jason', 'j@gmail.com', '1234', 'm', '1979-4-10', 
	   		   '94103', 'San Francisco', 'California', 'Maecenas hendrerit neque ac neque auctor sodales. Etiam dapibus, lorem eget porttitor luctus, tellus dui dapibus libero, non faucibus.',
	   		   '{    "/scaled_jasonLee3.jpg",
				    "/scaled_jasonLee1.jpg",
				    "/scaled_jasonLee2.png"
    			 }',
    			 '{"/med_jasonLee3.jpg",
				    "/med_jasonLee1.jpg",
				    "/med_jasonLee2.png"
   				   }',
   				   '{ "/small_jasonLee3.jpg",
					    "/small_jasonLee1.jpg",
					    "/small_jasonLee2.png"
    				}');

INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (11, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('James', 'james@gmail.com', '1234', 'm', '1984-7-10', 
	   		   '94103', 'San Francisco', 'California', 'Mauris justo a dui. Nulla facilisi. Morbi molestie risus massa, vel feugiat libero posuere pretium. Sed egestas, turpis ut dignissim ornare.', 
	   		   '{    "/scaled_jamesFranco3.jpg",
				    "/scaled_jamesFranco2.jpg",
				    "/scaled_jamesFranco1.jpg"
    			 }',
    			 '{"/med_jamesFranco3.jpg",
				    "/med_jamesFranco2.jpg",
				    "/med_jamesFranco1.jpg"
   				   }',
   				   '{ "/small_jamesFranco3.jpg",
					    "/small_jamesFranco2.jpg",
					    "/small_jamesFranco1.jpg"
    				}');

	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (12, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Reggie', 'reggie@gmail.com', '1234', 'm', '1980-7-10', 
	   		   '94103', 'San Francisco', 'California', 'Sapien urna adipiscing metus, at fringilla diam magna eu dui. Aliquam nibh enim, egestas vel gravida ac, faucibus sit amet est.',
	   		   '{   "/scaled_reggieWatts1.jpeg",
				    "/scaled_reggieWatts2.jpeg",
				    "/scaled_reggieWatts3.jpeg"
    			 }',
    			 '{"/med_reggieWatts1.jpeg",
				    "/med_reggieWatts2.jpeg",
				    "/med_reggieWatts3.jpeg"
   				   }',
   				   '{ "/small_reggieWatts1.jpeg",
					    "/small_reggieWatts2.jpeg",
					    "/small_reggieWatts3.jpeg"
    				}');

	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (13, 'false', 'true', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Zooey', 'zooey@gmail.com', '1234', 'f', '1982-9-10', 
	   		   '94103', 'San Francisco', 'California', 'Sed a tellus eu lectus luctus vulputate et a felis. Nullam eget odio sit amet tortor hendrerit condimentum a sed nibh. Ut odio mi, vulputate.',
	   		   '{   "/scaled_zooeyD2.jpeg",
				    "/scaled_zooeyD3.jpeg",
				    "/scaled_zooeyD1.jpg"
    			 }',
    			 '{"/med_zooeyD2.jpeg",
				    "/med_zooeyD3.jpeg",
				    "/med_zooeyD1.jpg"
   				   }',
   				   '{  "/small_zooeyD2.jpeg",
					    "/small_zooeyD3.jpeg",
					    "/small_zooeyD1.jpg"
    				}');

	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (14, 'true', 'false', 22, 34, 15); 


INSERT INTO users (username, email, password, gender, dateofbirth, 
	        zipcode, location_city, location_state, personal_blurb,
	        imageurls, medimageurls, smallimageurls) 
	   VALUES ('Emma', 'emma@gmail.com', '1234', 'f', '1989-9-10', 
	   		   '94103', 'San Francisco', 'California', 'Non lacus ac, mollis consequat ante. Pellentesque nec venenatis justo. Nunc congue mi sed magna consectetur, quis tincidunt quam.',
	   		   '{  "/scaled_emmaStone2.jpg",
				    "/scaled_emmaStone3.jpg",
				    "/scaled_emmaStone1.jpg"
    			 }',
    			 '{"/med_emmaStone2.jpg",
				    "/med_emmaStone3.jpg",
				    "/med_emmaStone1.jpg"
   				   }',
   				   '{  "/small_emmaStone2.jpg",
					    "/small_emmaStone3.jpg",
					    "/small_emmaStone1.jpg"
    				}');

	INSERT INTO userprefs (userid, male, female, age_min, age_max, distance_max) 
	   VALUES (15, 'true', 'false', 22, 34, 15); 




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

