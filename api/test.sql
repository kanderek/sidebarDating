DROP FUNCTION IF EXISTS youMatchTheirPreferences(int);
DROP FUNCTION IF EXISTS theyMatchYourPreferences(useridToTest int);
DROP FUNCTION IF EXISTS getPrimaryUsers(useridToTest int);
DROP FUNCTION IF EXISTS getSecondaryUsers(useridToTest int);

--GIVES world of choices for user with userid=1;
--SELECT userid, username  FROM youMatchTheirPreferences(1) INTERSECT SELECT userid, username  FROM theyMatchYourPreferences(1);

--GIVES people out of your preferences that have you inside theirs
--SELECT userid, username  FROM youMatchTheirPreferences(1) EXCEPT SELECT userid, username  FROM theyMatchYourPreferences(1);


CREATE OR REPLACE FUNCTION getPrimaryUsers(useridToTest int) 
	RETURNS  TABLE (
		userid			Integer, 
		username		varchar(30),
		gender			char(1),
		dateofbirth		date,
		location_city	varchar(30),
		location_state	varchar(30),
		zipCode			char(5),
		personal_blurb	varchar(300),
		imageurls		varchar(100) ARRAY,
		medimageurls	varchar(100) ARRAY,
		smallimageurls	varchar(100) ARRAY

		) AS $$
DECLARE 
BEGIN
	
	RETURN QUERY
	SELECT * FROM youMatchTheirPreferences($1) INTERSECT SELECT * FROM theyMatchYourPreferences($1);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getSecondaryUsers(useridToTest int) 
	RETURNS  TABLE (
		userid			Integer, 
		username		varchar(30),
		gender			char(1),
		dateofbirth		date,
		location_city	varchar(30),
		location_state	varchar(30),
		zipCode			char(5),
		personal_blurb	varchar(300),
		imageurls		varchar(100) ARRAY,
		medimageurls	varchar(100) ARRAY,
		smallimageurls	varchar(100) ARRAY

		) AS $$
DECLARE 
BEGIN
	
	RETURN QUERY
	SELECT * FROM youMatchTheirPreferences($1) EXCEPT SELECT *  FROM theyMatchYourPreferences($1);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION youMatchTheirPreferences(useridToTest int) 
	RETURNS  TABLE (
		userid			Integer, 
		username		varchar(30),
		gender			char(1),
		dateofbirth		date,
		location_city	varchar(30),
		location_state	varchar(30),
		zipCode			char(5),
		personal_blurb	varchar(300),
		imageurls		varchar(100) ARRAY,
		medimageurls	varchar(100) ARRAY,
		smallimageurls	varchar(100) ARRAY

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
	       u.smallimageurls

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
		userid			Integer, 
		username		varchar(30),
		gender			char(1),
		dateofbirth		date,
		location_city	varchar(30),
		location_state	varchar(30),
		zipCode			char(5),
		personal_blurb	varchar(300),
		imageurls		varchar(100) ARRAY,
		medimageurls	varchar(100) ARRAY,
		smallimageurls	varchar(100) ARRAY

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
	       temp.smallimageurls

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
				  extract(YEAR from age(u.dateofbirth)) AS acceptable  FROM users u) AS temp
	WHERE 
		acceptable >= minAgeToCheck AND 
		acceptable <= maxAgeToCheck AND
		(temp.gender=acceptsMale OR temp.gender=acceptsFemale);


END;
$$ LANGUAGE plpgsql;