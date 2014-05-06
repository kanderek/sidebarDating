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

<<<<<<< Updated upstream

-- ----------------------------
--  Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."users" CASCADE;
CREATE TABLE "sidebar"."users" (
    "userid" SERIAL,
    "username" varchar(30) NOT NULL COLLATE "default",
    "password" varchar(30) NOT NULL COLLATE "default",
    "email" varchar(30) NOT NULL COLLATE "default",
    "gender" char(1) COLLATE "default",
    "dateofbirth" date,
    "age" int4,
    "location_city" varchar(30) COLLATE "default",
    "location_state" varchar(30) COLLATE "default",
    "zipcode" char(5) COLLATE "default",
    "personal_blurb" varchar(300) DEFAULT 'I''m a blank essay'::character varying COLLATE "default",
    "imageurls" varchar(100)[] COLLATE "default",
    "medimageurls" varchar(100)[] COLLATE "default",
    "smallimageurls" varchar(100)[] COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."users" OWNER TO "sidebar";

-- ----------------------------
--  Records of users
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."users" VALUES ('23', 'Christina', '1234', 'christina@gmail.com', 'f', '1986-01-01', '27', 'Berkeley', 'CA', '94704', 'Microcakes and stuff!', '{/scaled_23-1.jpg,/scaled_23-2.jpg,/scaled_23-3.jpg}', '{/med_23-1.jpg,/med_23-2.jpg,/med_23-3.jpg}', '{/small_23-1.jpg,/small_23-2.jpg,/small_23-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('1', 'Alex', '1234', 'alex@gmail.com', 'm', '1990-03-03', '24', 'San Mateo', 'CA', '94404', 'LA based Actor, originally SF Bay Area. Have 2 Feature films currently working on. I like Film/Theater. Family. Friends. Food. Wrestling.', '{/scaled_1-1.jpg,/scaled_1-2.jpg,/scaled_1-3.jpg}', '{/med_1-1.jpg,/med_1-2.jpg,/med_1-3.jpg}', '{/small_1-1.jpg,/small_1-2.jpg,/small_1-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('2', 'James', '1234', 'james@gmail.com', 'm', '1989-02-07', '25', 'Richmond', 'CA', '94084', 'Mellow, night owl, weekend hiker. Illustrator. Art, movie, and game enthusiast. Likes to do something out of the ordinary. Likes Animals.', '{/scaled_2-1.jpg,/scaled_2-2.jpg,/scaled_2-3.jpg}', '{/med_2-1.jpg,/med_2-2.jpg,/med_2-3.jpg}', '{/small_2-1.jpg,/small_2-2.jpg,/small_2-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('3', 'Hunter', '1234', 'hunter@gmail.com', 'm', '1991-10-06', '22', 'Oakland', 'CA', '94607', 'Looking for like minded chill people. Interested in clubs, parties, and meaningless shinnanigans.', '{/scaled_3-1.jpg,/scaled_3-2.jpg,/scaled_3-3.jpg}', '{/med_3-1.jpg,/med_3-2.jpg,/med_3-3.jpg}', '{/small_3-1.jpg,/small_3-2.jpg,/small_3-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('4', 'Joseph', '1234', 'joseph@gmail.com', 'm', '1984-01-30', '30', 'Fremont', 'CA', '94536', 'God, talking, playing basketball, cooking, beach, gym, smiles. I''ve no kids, but I want some. Don''t be shy.', '{/scaled_4-1.jpg,/scaled_4-2.jpg,/scaled_4-3.jpg}', '{/med_4-1.jpg,/med_4-2.jpg,/med_4-3.jpg}', '{/small_4-1.jpg,/small_4-2.jpg,/small_4-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('5', 'Robert', '1234', 'robert@gmail.com', 'm', '1991-01-01', '23', 'Daily City', 'CA', '94015', 'I am an urban farmer, so that''s pretty fun! Backpacking, climbing, running, biking, the works. I also write for a food politics journal!', '{/scaled_5-1.jpg,/scaled_5-2.jpg,/scaled_5-3.jpg}', '{/med_5-1.jpg,/med_5-2.jpg,/med_5-3.jpg}', '{/small_5-1.jpg,/small_5-2.jpg,/small_5-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('6', 'Kenny', '1234', 'kenny@gmail.com', 'm', '1990-06-05', '23', 'San Francisco', 'CA', '94111', 'I''ve always been a creator, but cinematography is my driving force. It''s what satisfies me. I shoot horrors, westerns, and thrillers.', '{/scaled_6-1.jpg,/scaled_6-2.jpg,/scaled_6-3.jpg}', '{/med_6-1.jpg,/med_6-2.jpg,/med_6-3.jpg}', '{/small_6-1.jpg,/small_6-2.jpg,/small_6-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('7', 'Jarod', '1234', 'jarod@gmail.com', 'm', '1990-10-25', '23', 'Daily City', 'CA', '94015', 'I love the idea of creating art for a living. I''m good at singing/songwriting/guitar/acting/improvisation/poker', '{/scaled_7-1.jpg,/scaled_7-2.jpg,/scaled_7-3.jpg}', '{/med_7-1.jpg,/med_7-2.jpg,/med_7-3.jpg}', '{/small_7-1.jpg,/small_7-2.jpg,/small_7-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('8', 'Daniel', '1234', 'daniel@gmail.com', 'm', '1989-05-13', '24', 'Berkeley', 'CA', '94704', 'Things I love... Dance, Guitar, Music in general, pursuing my passions, experiencing life and a lot more', '{/scaled_8-1.jpg,/scaled_8-2.jpg,/scaled_8-3.jpg}', '{/med_8-1.jpg,/med_8-2.jpg,/med_8-3.jpg}', '{/small_8-1.jpg,/small_8-2.jpg,/small_8-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('9', 'Evan', '1234', 'evan@gmail.com', 'm', '1984-07-04', '29', 'Daily City', 'CA', '94015', 'Things I could not live without: Food, exercise, sex, laughter, sports, friends', '{/scaled_9-1.jpg,/scaled_9-2.jpg,/scaled_9-3.jpg}', '{/med_9-1.jpg,/med_9-2.jpg,/med_9-3.jpg}', '{/small_9-1.jpg,/small_9-2.jpg,/small_9-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('10', 'Elijah', '1234', 'elijah@gmail.com', 'm', '1986-11-14', '27', 'Daily City', 'CA', '94015', 'Making the most out of my time. Kicking ass and having fun. I like to dance, giggle, wiggle, and work on my power moves while driving.', '{/scaled_10-1.jpg,/scaled_10-2.jpg,/scaled_10-3.jpg}', '{/med_10-1.jpg,/med_10-2.jpg,/med_10-3.jpg}', '{/small_10-1.jpg,/small_10-2.jpg,/small_10-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('11', 'Michael', '1234', 'michael@gmail.com', 'm', '1984-07-27', '29', 'Berkeley', 'CA', '94704', 'My interests and skills are acting, singing, swimming, running, soccer, and I love to hike and I am a gym fanatic as well.', '{/scaled_11-1.jpg,/scaled_11-2.jpg,/scaled_11-3.jpg}', '{/med_11-1.jpg,/med_11-2.jpg,/med_11-3.jpg}', '{/small_11-1.jpg,/small_11-2.jpg,/small_11-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('12', 'Benny', '1234', 'benny@gmail.com', 'm', '1990-06-28', '23', 'Berkeley', 'CA', '94704', 'Filmmaking, capoeira, oil paintings, and theatre are the aspirations on the table. Also love sunlight, food, vegetation, and chocolate', '{/scaled_12-1.jpg,/scaled_12-2.jpg,/scaled_12-3.jpg}', '{/med_12-1.jpg,/med_12-2.jpg,/med_12-3.jpg}', '{/small_12-1.jpg,/small_12-2.jpg,/small_12-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('13', 'Peter', '1234', 'peter@gmail.com', 'm', '1991-11-08', '22', 'Oakland', 'CA', '94607', 'The activities I most like to do are acting in my free times , spending time with my dog, and watching movies.', '{/scaled_13-1.jpg,/scaled_13-2.jpg,/scaled_13-3.jpg}', '{/med_13-1.jpg,/med_13-2.jpg,/med_13-3.jpg}', '{/small_13-1.jpg,/small_13-2.jpg,/small_13-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('14', 'Shane', '1234', 'shane@gmail.com', 'm', '1984-04-23', '30', 'Daily City', 'CA', '94015', 'I''m little bit all over the place i draw paint sing play guitar and do graphic design i love my two dogs tomatoe and ninja!', '{/scaled_14-1.jpg,/scaled_14-2.jpg,/scaled_14-3.jpg}', '{/med_14-1.jpg,/med_14-2.jpg,/med_14-3.jpg}', '{/small_14-1.jpg,/small_14-2.jpg,/small_14-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('15', 'Luke', '1234', 'luke@gmail.com', 'm', '1990-12-23', '23', 'Richmond', 'CA', '94084', 'Sports, Technology, Beer, Books, Fishing, Going out and having fun!', '{/scaled_15-1.jpg,/scaled_15-2.jpg,/scaled_15-3.jpg}', '{/med_15-1.jpg,/med_15-2.jpg,/med_15-3.jpg}', '{/small_15-1.jpg,/small_15-2.jpg,/small_15-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('16', 'Jackson', '1234', 'jackson@gmail.com', 'm', '1990-05-29', '23', 'Richmond', 'CA', '94084', 'Battling monsters, demons, and lethargy. Creating stuff from nowhere. Leaving footprints and taking pictures of the footprint', '{/scaled_16-1.jpg,/scaled_16-2.jpg,/scaled_16-3.jpg}', '{/med_16-1.jpg,/med_16-2.jpg,/med_16-3.jpg}', '{/small_16-1.jpg,/small_16-2.jpg,/small_16-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('17', 'Zane', '1234', 'zane@gmail.com', 'm', '1986-06-27', '27', 'Oakland', 'CA', '94607', 'I love to have fun, work out and play baseball. I''m quite the jokester- I''m sure I can make you laugh. ', '{/scaled_17-1.jpg,/scaled_17-2.jpg,/scaled_17-3.jpg}', '{/med_17-1.jpg,/med_17-2.jpg,/med_17-3.jpg}', '{/small_17-1.jpg,/small_17-2.jpg,/small_17-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('18', 'Brock', '1234', 'brock@gmail.com', 'm', '1988-08-06', '25', 'Oakland', 'CA', '94607', 'Writing, acting, kareoke(sometimes), making pizza, drinking(not too proud of that one) and negotiating', '{/scaled_18-1.jpg,/scaled_18-2.jpg,/scaled_18-3.jpg}', '{/med_18-1.jpg,/med_18-2.jpg,/med_18-3.jpg}', '{/small_18-1.jpg,/small_18-2.jpg,/small_18-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('19', 'Ryan', '1234', 'ryan@gmail.com', 'm', '1985-09-24', '28', 'Belmont', 'CA', '94002', 'Making moves, tshirt design, writing music and poetry, drawing, photography, living life how I define it', '{/scaled_19-1.jpg,/scaled_19-2.jpg,/scaled_19-3.jpg}', '{/med_19-1.jpg,/med_19-2.jpg,/med_19-3.jpg}', '{/small_19-1.jpg,/small_19-2.jpg,/small_19-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('20', 'Sebastian', '1234', 'sebastian@gmail.com', 'm', '1991-03-01', '23', 'Richmond', 'CA', '94084', 'Technology - Crafting - Video Games - Using Common Sense - Rubiks Cube - Managing - Writing - Guitar - Fixing burned out light bulbs', '{/scaled_20-1.jpg,/scaled_20-2.jpg,/scaled_20-3.jpg}', '{/med_20-1.jpg,/med_20-2.jpg,/med_20-3.jpg}', '{/small_20-1.jpg,/small_20-2.jpg,/small_20-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('21', 'David', '1234', 'david@gmail.com', 'm', '1984-04-05', '30', 'San Mateo', 'CA', '94404', 'Sports, jeopardy, chess, poker, family, friends, music, books', '{/scaled_21-1.jpg,/scaled_21-2.jpg,/scaled_21-3.jpg}', '{/med_21-1.jpg,/med_21-2.jpg,/med_21-3.jpg}', '{/small_21-1.jpg,/small_21-2.jpg,/small_21-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('22', 'Andrew', '1234', 'andrew@gmail.com', 'm', '1985-12-15', '28', 'Berkeley', 'CA', '94704', 'I''ve never been beaten at MarioKart 64. Ever. I''m the best on Earth. It''s a curse', '{/scaled_22-1.jpg,/scaled_22-2.jpg,/scaled_22-3.jpg}', '{/med_22-1.jpg,/med_22-2.jpg,/med_22-3.jpg}', '{/small_22-1.jpg,/small_22-2.jpg,/small_22-3.jpg}');
COMMIT;

-- ----------------------------
--  Table structure for userprefs
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."userprefs";
CREATE TABLE "sidebar"."userprefs" (
    "userid" int4 NOT NULL,
    "male" bool,
    "female" bool,
    "age_min" int4,
    "age_max" int4,
    "distance_max" int4
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."userprefs" OWNER TO "sidebar";

-- ----------------------------
--  Records of userprefs
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."userprefs" VALUES ('1', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('2', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('3', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('4', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('5', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('6', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('7', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('8', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('9', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('10', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('11', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('12', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('13', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('14', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('15', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('16', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('17', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('18', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('19', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('20', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('21', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('22', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('23', 't', 'f', '22', '28', '30');
COMMIT;


-- ----------------------------
--  Table structure for dancecard
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."dancecard";
CREATE TABLE "sidebar"."dancecard" (
    "userid" int4 NOT NULL,
    "partnerid" int4 NOT NULL,
    "status" varchar(10) COLLATE "default",
    "mutual" bool DEFAULT false,
    "updatetime" timestamp(6) NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."dancecard" OWNER TO "sidebar";

-- ----------------------------
--  Records of dancecard
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."dancecard" VALUES ('11', '23', 'added', 't', '2014-05-05 19:48:47');
INSERT INTO "sidebar"."dancecard" VALUES ('23', '11', 'added', 't', '2014-05-05 17:54:10');
INSERT INTO "sidebar"."dancecard" VALUES ('23', '2', 'added', 'f', '2014-05-05 17:58:51');
COMMIT;

-- ----------------------------
--  Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."messages";
CREATE TABLE "sidebar"."messages" (
    "senderid" int4 NOT NULL,
    "receiverid" int4 NOT NULL,
    "message" text NOT NULL COLLATE "default",
    "sendtime" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."messages" OWNER TO "sidebar";

-- ----------------------------
--  Records of messages
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."messages" VALUES ('11', '23', 'Hi there cutie!', '2014-05-05 15:40:17');
INSERT INTO "sidebar"."messages" VALUES ('23', '11', 'I see you''re on github?', '2014-05-05 16:39:59');
COMMIT;

-- ----------------------------
--  Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."notifications";
CREATE TABLE "sidebar"."notifications" (
    "notificationid" serial,
    "userid" int4,
    "about_userid" int4,
    "message" varchar(140) NOT NULL COLLATE "default",
    "action_time" timestamp(6) NULL,
    "type" varchar(10) COLLATE "default",
    "subtype" varchar(10) COLLATE "default",
    "status" varchar(10) DEFAULT 'unread'::character varying COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."notifications" OWNER TO "sidebar";

-- ----------------------------
--  Table structure for urls
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."urls" CASCADE;
CREATE TABLE "sidebar"."urls" (
    "urlid" SERIAL,
    "url" varchar(300) COLLATE "default",
    "page_title" varchar(140) COLLATE "default",
    "primary_img_url" varchar(140) COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."urls" OWNER TO "sidebar";

-- ----------------------------
--  Records of urls
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."urls" VALUES ('8', 'http://www.webmd.com/women/guide/essential-vitamins-for-women-at-every-age', 'Essential Vitamins for Women at Every Age', null);
INSERT INTO "sidebar"."urls" VALUES ('13', 'https://wwws.mint.com/login.event', 'Mint.com', null);
INSERT INTO "sidebar"."urls" VALUES ('14', 'https://chaseonline.chase.com/', 'Chase Online - Logon', null);
INSERT INTO "sidebar"."urls" VALUES ('16', 'http://www.adamwaaramaa.com/fundraising/writing-your-pitch-deck/', 'How To Write A Killer Pitch Deck In 10 Slides | Adam Waaramaa On Entrepreneurship', null);
INSERT INTO "sidebar"."urls" VALUES ('18', 'http://www.thewhir.com/web-hosting-news/hackers-find-cloud-account-credentials-github-leading-72-hour-cryptocurrency-mining-spree', 'Hackers Find Cloud Account Credentials on GitHub Leading to 72-Hour Cryptocurrency Mining Spree - Web Host Industry Review', null);
INSERT INTO "sidebar"."urls" VALUES ('20', 'http://www.netflix.com/WiPlayer?movieid=70267239&trkid=13462260&tctx=0%2C0%2C4c7eecbf-d697-4cef-a100-83ed8e72f3e8-693061', 'Netflix', null);
INSERT INTO "sidebar"."urls" VALUES ('25', 'https://www.netflix.com/?locale=en-US', 'Netflix - Watch TV Shows Online, Watch Movies Online', null);
INSERT INTO "sidebar"."urls" VALUES ('27', 'http://assorted-experience.blogspot.com/2014/05/doctesting-python-command-line-scripts.html', 'Assorted Experience: Doctesting Python command line scripts', null);
INSERT INTO "sidebar"."urls" VALUES ('36', 'https://news.ycombinator.com/newest', 'New Links | Hacker News', null);
INSERT INTO "sidebar"."urls" VALUES ('43', 'https://www.comixology.com/top-rated', 'Top Rated Comics - Comics by comiXology', null);
INSERT INTO "sidebar"."urls" VALUES ('1', 'http://techcrunch.com/2014/05/05/facebook-acqusition-helped-oculus/', 'Oculus CEO Says Selling To Facebook Convinced Big Developers To Build For It | TechCrunch', 'http://tctechcrunch2011.files.wordpress.com/2014/05/brendan-iribe-oculus12.jpg');
INSERT INTO "sidebar"."urls" VALUES ('3', 'https://vine.co/lists/20-explosive-moments-when-the-beat-drops', 'https://vine.co/lists/20-explosive-moments-when-the-beat-drops', 'https://vine.co/assets/images/meta/vine_screencap.png');
INSERT INTO "sidebar"."urls" VALUES ('5', 'http://mashable.com/2014/05/05/doge-vine/', 'Much Doge on Vine. So Wow.', 'http://rack.1.mshcdn.com/media/ZgkyMDE0LzA1LzA1L2ExL0RvZ2VWaW5lLjdkNGY5LmpwZwpwCXRodW1iCTk1MHg1MzQjCmUJanBn/43950e8a/c33/Doge-Vine.jpg');
INSERT INTO "sidebar"."urls" VALUES ('2', 'http://techcrunch.com/', 'TechCrunch - The latest technology news and information on startups', 'http://s1.wp.com/wp-content/themes/vip/techcrunch-2013/assets/images/logo-large.png?m=1391183173g');
INSERT INTO "sidebar"."urls" VALUES ('4', 'https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable', 'https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable', 'https://vine.co/assets/images/meta/vine_screencap.png');
INSERT INTO "sidebar"."urls" VALUES ('6', 'http://mashable.com/2014/05/05/automattic-funding/', 'WordPress.com Creator Automattic Raises $160 Million', 'http://rack.2.mshcdn.com/media/ZgkyMDE0LzA1LzA1LzcwL211bGxlbndlZzEuYmEwM2QuanBnCnAJdGh1bWIJOTUweDUzNCMKZQlqcGc/b8478ee1/b93/mullenweg1.jpg');
INSERT INTO "sidebar"."urls" VALUES ('9', 'https://www.etsy.com/', 'Etsy - Your place to buy and sell all things handmade, vintage, and supplies', 'http://www.etsy.com/images/logo_no_border.gif');
INSERT INTO "sidebar"."urls" VALUES ('7', 'http://www.pinterest.com/pin/182395853631827993/', 'Pin by Evelyn Poeppelmeier on Style and Beauty: Dresses (Gowns and Re…', 'http://media-cache-ec0.pinimg.com/736x/66/75/a7/6675a752e2d18c4398ad722f3dd21324.jpg');
INSERT INTO "sidebar"."urls" VALUES ('11', 'http://americanfood.about.com/od/classicchowdersandstews/r/beefstew.htm', 'Old Fashioned Beef Stew Recipe - How to Make Old Fashioned Beef Stew', 'http://0.tqn.com/d/americanfood/1/0/v/-/-/-/beefstew.jpg');
INSERT INTO "sidebar"."urls" VALUES ('12', 'https://github.com/', 'GitHub', 'https://github.global.ssl.fastly.net/images/modules/open_graph/github-logo.png');
INSERT INTO "sidebar"."urls" VALUES ('15', 'http://www.iftf.org/what-we-do/who-we-are/staff/marina-gorbis/', 'IFTF: Marina Gorbis', 'http://www.iftf.org/uploads/RTEmagicC_picture-43.gif.gif');
INSERT INTO "sidebar"."urls" VALUES ('17', 'http://www.infoworld.com/d/security/github-bans-weak-passwords-after-brute-force-attack-results-in-compromised-accounts-231273', 'GitHub bans weak passwords after brute-force attack results in compromised accounts | Security - InfoWorld', 'http://computerworld.com.edgesuite.net/ifw/IFW.png');
INSERT INTO "sidebar"."urls" VALUES ('19', 'http://hbr.org/2014/01/how-netflix-reinvented-hr/ar/1', 'How Netflix Reinvented HR - Harvard Business Review', 'http://static.hbr.org/hbrg-main/resources/images/hbr_opengraph_360x185.png');
INSERT INTO "sidebar"."urls" VALUES ('23', 'https://www.youtube.com/watch?v=wo8aSo5Tv1E', 'Air - Moon Safari [Full Album] - YouTube', 'https://i1.ytimg.com/vi/wo8aSo5Tv1E/maxresdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('10', 'http://www.ultimate-guitar.com/', 'ULTIMATE GUITAR TABS. 800,000 songs catalog with free Chords, Guitar Tabs, Bass Tabs, Ukulele Chords and Guitar Pro Tabs!', 'http://www.ultimate-guitar.com/tv/images/16168_r182858_thumbnail_small.jpg');
INSERT INTO "sidebar"."urls" VALUES ('21', 'https://www.ischool.berkeley.edu/about', 'About | School of Information', 'http://www.ischool.berkeley.edu/files/imagecache/og/i_square.jpg');
INSERT INTO "sidebar"."urls" VALUES ('26', 'http://www.nbcnews.com/storyline/missing-jet/boeing-rolls-royce-face-bill-over-hunt-flight-mh370-n97011', 'Boeing, Rolls-Royce to Face Bill Over Hunt for Flight MH370 - NBC News.com', 'http://media3.s-nbcnews.com/i/newscms/2014_18/418316/tdy_jet-comp_140503_df28c0aa38fb70472c7b9a055ada9805.jpg');
INSERT INTO "sidebar"."urls" VALUES ('28', 'https://medium.com/editors-picks/ad3d3c5e3c65', 'Forget 140 characters: Here’s How to Go to Jail for 10 Months for One ‘k’ — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*lWDlFbAzgqwW_RCf9FGaiQ.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('24', 'http://www.slate.com/articles/podcasts/culturegabfest.html', 'Culture Gabfest', 'http://www.slate.com/etc/designs/slate/images/slate_facebook_icon.png');
INSERT INTO "sidebar"."urls" VALUES ('22', 'http://www.nytimes.com/', 'The New York Times - Breaking News, World News & Multimedia', 'http://i1.nyt.com/images/2014/05/06/health/POLIO/POLIO-largeHorizontal375.jpg');
INSERT INTO "sidebar"."urls" VALUES ('32', 'https://play.spotify.com/artist/1yAwtBaoHLEDWAnWR87hBT', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('33', 'https://play.spotify.com/browse', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('34', 'https://play.spotify.com/album/2okCg9scHue9GNELoB8U9g', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('35', 'https://play.spotify.com/radio/artist/3TVXtAsR1Inumwj472S9r4', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('37', 'https://www.youtube.com/watch?v=IgKWPdJWuBQ', 'Elon Musk: The mind behind Tesla, SpaceX, SolarCity ... - YouTube', 'https://i1.ytimg.com/vi/IgKWPdJWuBQ/maxresdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('38', 'https://www.youtube.com/watch?v=6ycn5VmBUYY', '100 Days of Dance - YouTube', 'https://i1.ytimg.com/vi/6ycn5VmBUYY/maxresdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('40', 'http://www.imdb.com/chart/top', 'IMDb Top 250 - IMDb', 'http://ia.media-imdb.com/images/G/01/imdb/images/logos/imdb_fb_logo-1730868325._V379391653_.png');
INSERT INTO "sidebar"."urls" VALUES ('42', 'http://www.nytimes.com/pages/opinion/index.html', 'Editorials, Columns, Op-Ed, Letters, Opinionator and More Opinion - The New York Times', 'http://graphics8.nytimes.com/images/2014/05/05/opinion/0503OPEDisland/0503OPEDisland-sfSpan-v2.jpg');
INSERT INTO "sidebar"."urls" VALUES ('39', 'https://www.youtube.com/watch?v=zRlpIkH3b5I', 'Photoshopping Real Women Into Cover Models - YouTube', 'https://i1.ytimg.com/vi/zRlpIkH3b5I/hqdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('29', 'https://medium.com/editors-picks/a26385113bf0', 'Cold War Coloring Book Taught A-10 Pilots to Kill Soviet Tanks — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/blue/overlay/blue/1*t6gtNb-DAEXHHo1NZ3IPCQ.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('30', 'https://medium.com/editors-picks/1bd6f5e75763', 'What Everyone Could Be Missing About the Kurt Cobain ‘Bitch With Zits’ Letter  — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/yellow/overlay/yellow/1*0n_-k5-MxIu3uXBcTVg1Xg.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('31', 'https://medium.com/editors-picks/646320568f9d', 'When a Kidnapped Journalist Is a Freelancer — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*ltkYYkHx6CHF5TzMqTO4hw.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('41', 'http://www.nytimes.com/roomfordebate/2014/05/04/how-should-electronic-cigarretes-be-regulated', 'How Should Electronic Cigarretes Be Regulated? - Room for Debate - NYTimes.com', 'http://graphics8.nytimes.com/images/2014/04/29/opinion/rfdvaping/rfdvaping-thumbWide.jpg');
INSERT INTO "sidebar"."urls" VALUES ('44', 'http://www.pinterest.com/all/humor/', 'Humor on Pinterest - funny pictures, quotes and memes', 'http://media-cache-ak0.pinimg.com/236x/62/e5/83/62e5835df7b7c13edbdc1aeead3a3273.jpg');
INSERT INTO "sidebar"."urls" VALUES ('45', 'https://www.google.com/', 'Google Home Page', null);
COMMIT;


-- ----------------------------
--  Table structure for url_categories
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."url_categories";
CREATE TABLE "sidebar"."url_categories" (
    "urlid" int4 NOT NULL,
    "level1" varchar(40) NOT NULL COLLATE "default",
    "level2" varchar(40) NOT NULL COLLATE "default",
    "level3" varchar(40) NOT NULL COLLATE "default",
    "level4" varchar(40) COLLATE "default",
    "level5" varchar(40) COLLATE "default",
    "score" numeric(6,6)
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."url_categories" OWNER TO "sidebar";

-- ----------------------------
--  Records of url_categories
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."url_categories" VALUES ('3', 'travel', 'specialty travel', 'vineyards', '', '', '0.771858');
INSERT INTO "sidebar"."url_categories" VALUES ('3', 'food and drink', 'beverages', 'alcoholic beverages', 'wine', '', '0.633116');
INSERT INTO "sidebar"."url_categories" VALUES ('3', 'business and industrial', 'agriculture and forestry', 'crops and seed', '', '', '0.054800');
INSERT INTO "sidebar"."url_categories" VALUES ('1', 'technology and computing', 'internet technology', 'social network', '', '', '0.488826');
INSERT INTO "sidebar"."url_categories" VALUES ('1', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.288975');
INSERT INTO "sidebar"."url_categories" VALUES ('1', 'business and industrial', '', '', '', '', '0.247608');
INSERT INTO "sidebar"."url_categories" VALUES ('5', 'family and parenting', '', '', '', '', '0.437683');
INSERT INTO "sidebar"."url_categories" VALUES ('5', 'pets', 'cats', '', '', '', '0.281174');
INSERT INTO "sidebar"."url_categories" VALUES ('5', 'education', 'homework and study tips', '', '', '', '0.246091');
INSERT INTO "sidebar"."url_categories" VALUES ('4', 'travel', 'specialty travel', 'vineyards', '', '', '0.771858');
INSERT INTO "sidebar"."url_categories" VALUES ('4', 'food and drink', 'beverages', 'alcoholic beverages', 'wine', '', '0.633116');
INSERT INTO "sidebar"."url_categories" VALUES ('4', 'business and industrial', 'agriculture and forestry', 'crops and seed', '', '', '0.054800');
INSERT INTO "sidebar"."url_categories" VALUES ('6', 'family and parenting', '', '', '', '', '0.394961');
INSERT INTO "sidebar"."url_categories" VALUES ('6', 'art and entertainment', 'visual art and design', 'design', '', '', '0.285270');
INSERT INTO "sidebar"."url_categories" VALUES ('6', 'business and industrial', 'company', 'merger and acquisition', '', '', '0.218782');
INSERT INTO "sidebar"."url_categories" VALUES ('2', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.366779');
INSERT INTO "sidebar"."url_categories" VALUES ('2', 'hobbies and interests', 'guitar', '', '', '', '0.301621');
INSERT INTO "sidebar"."url_categories" VALUES ('2', 'business and industrial', '', '', '', '', '0.281700');
INSERT INTO "sidebar"."url_categories" VALUES ('9', 'technology and computing', 'internet technology', 'email', '', '', '0.634357');
INSERT INTO "sidebar"."url_categories" VALUES ('9', 'shopping', 'gifts', '', '', '', '0.413833');
INSERT INTO "sidebar"."url_categories" VALUES ('9', 'hobbies and interests', 'arts and crafts', 'crochet', '', '', '0.409018');
INSERT INTO "sidebar"."url_categories" VALUES ('15', 'family and parenting', 'children', '', '', '', '0.426110');
INSERT INTO "sidebar"."url_categories" VALUES ('15', 'society', '', '', '', '', '0.333390');
INSERT INTO "sidebar"."url_categories" VALUES ('15', 'business and industrial', '', '', '', '', '0.235372');
INSERT INTO "sidebar"."url_categories" VALUES ('7', 'finance', 'bank', 'atms', '', '', '0.544048');
INSERT INTO "sidebar"."url_categories" VALUES ('7', 'family and parenting', '', '', '', '', '0.391303');
INSERT INTO "sidebar"."url_categories" VALUES ('7', 'style and fashion', 'jewelry', 'bracelets', '', '', '0.373276');
INSERT INTO "sidebar"."url_categories" VALUES ('11', 'home and garden', 'appliances', 'small appliances', 'food processors', '', '0.500086');
INSERT INTO "sidebar"."url_categories" VALUES ('11', 'business and industrial', 'energy', 'oil', '', '', '0.489626');
INSERT INTO "sidebar"."url_categories" VALUES ('11', 'food and drink', 'desserts and baking', '', '', '', '0.393319');
INSERT INTO "sidebar"."url_categories" VALUES ('17', 'technology and computing', 'programming languages', 'java', '', '', '0.522546');
INSERT INTO "sidebar"."url_categories" VALUES ('17', 'technology and computing', 'software', '', '', '', '0.460356');
INSERT INTO "sidebar"."url_categories" VALUES ('17', 'shopping', 'resources', 'product reviews', '', '', '0.352878');
INSERT INTO "sidebar"."url_categories" VALUES ('16', 'business and industrial', '', '', '', '', '0.361359');
INSERT INTO "sidebar"."url_categories" VALUES ('16', 'business and industrial', 'business operations', 'business plans', '', '', '0.256385');
INSERT INTO "sidebar"."url_categories" VALUES ('16', 'hobbies and interests', 'reading', '', '', '', '0.184031');
INSERT INTO "sidebar"."url_categories" VALUES ('14', 'technology and computing', 'internet technology', 'email', '', '', '0.554103');
INSERT INTO "sidebar"."url_categories" VALUES ('14', 'society', 'crime', 'property crime', 'piracy', '', '0.449075');
INSERT INTO "sidebar"."url_categories" VALUES ('14', 'technology and computing', 'consumer electronics', 'game systems and consoles', 'xbox', '', '0.365870');
INSERT INTO "sidebar"."url_categories" VALUES ('20', 'technology and computing', 'internet technology', 'email', '', '', '0.663538');
INSERT INTO "sidebar"."url_categories" VALUES ('20', 'technology and computing', 'internet technology', 'social network', '', '', '0.426642');
INSERT INTO "sidebar"."url_categories" VALUES ('20', 'news', 'local news', '', '', '', '0.347285');
INSERT INTO "sidebar"."url_categories" VALUES ('19', 'business and industrial', '', '', '', '', '0.384719');
INSERT INTO "sidebar"."url_categories" VALUES ('19', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.275626');
INSERT INTO "sidebar"."url_categories" VALUES ('19', 'education', '', '', '', '', '0.247802');
INSERT INTO "sidebar"."url_categories" VALUES ('10', 'technology and computing', 'programming languages', 'javascript', '', '', '0.771187');
INSERT INTO "sidebar"."url_categories" VALUES ('10', 'technology and computing', 'software', 'databases', '', '', '0.165709');
INSERT INTO "sidebar"."url_categories" VALUES ('10', 'technology and computing', 'internet technology', 'email', '', '', '0.143043');
INSERT INTO "sidebar"."url_categories" VALUES ('12', 'technology and computing', 'software', '', '', '', '0.331832');
INSERT INTO "sidebar"."url_categories" VALUES ('12', 'business and industrial', '', '', '', '', '0.157346');
INSERT INTO "sidebar"."url_categories" VALUES ('12', 'business and industrial', 'business operations', 'management', 'project management', '', '0.150008');
INSERT INTO "sidebar"."url_categories" VALUES ('21', 'education', 'school', '', '', '', '0.469108');
INSERT INTO "sidebar"."url_categories" VALUES ('21', 'science', 'computer science', 'information science', '', '', '0.187253');
INSERT INTO "sidebar"."url_categories" VALUES ('21', 'careers', '', '', '', '', '0.159794');
INSERT INTO "sidebar"."url_categories" VALUES ('18', 'society', 'crime', 'property crime', 'larceny', '', '0.422567');
INSERT INTO "sidebar"."url_categories" VALUES ('18', 'sports', 'running and jogging', '', '', '', '0.307609');
INSERT INTO "sidebar"."url_categories" VALUES ('18', 'technology and computing', '', '', '', '', '0.246521');
INSERT INTO "sidebar"."url_categories" VALUES ('27', 'technology and computing', 'programming languages', 'c and c++', '', '', '0.320373');
INSERT INTO "sidebar"."url_categories" VALUES ('27', 'technology and computing', 'mp3 and midi', '', '', '', '0.239909');
INSERT INTO "sidebar"."url_categories" VALUES ('27', 'technology and computing', 'hardware', 'computer', '', '', '0.207707');
INSERT INTO "sidebar"."url_categories" VALUES ('25', 'business and industrial', 'advertising and marketing', 'advertising', '', '', '0.254679');
INSERT INTO "sidebar"."url_categories" VALUES ('25', 'technology and computing', '', '', '', '', '0.156716');
INSERT INTO "sidebar"."url_categories" VALUES ('25', 'technology and computing', 'internet technology', 'web search', '', '', '0.128620');
INSERT INTO "sidebar"."url_categories" VALUES ('29', 'law, govt and politics', 'armed forces', 'air force', '', '', '0.439661');
INSERT INTO "sidebar"."url_categories" VALUES ('29', 'law, govt and politics', 'armed forces', 'army', '', '', '0.262220');
INSERT INTO "sidebar"."url_categories" VALUES ('29', 'art and entertainment', 'visual art and design', 'drawing', '', '', '0.216497');
INSERT INTO "sidebar"."url_categories" VALUES ('28', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.532373');
INSERT INTO "sidebar"."url_categories" VALUES ('28', 'style and fashion', 'accessories', 'hats', '', '', '0.500143');
INSERT INTO "sidebar"."url_categories" VALUES ('28', 'technology and computing', 'internet technology', 'email', '', '', '0.443534');
INSERT INTO "sidebar"."url_categories" VALUES ('24', 'family and parenting', '', '', '', '', '0.318184');
INSERT INTO "sidebar"."url_categories" VALUES ('24', 'education', 'school', '', '', '', '0.313217');
INSERT INTO "sidebar"."url_categories" VALUES ('24', 'news', '', '', '', '', '0.286366');
INSERT INTO "sidebar"."url_categories" VALUES ('22', 'automotive and vehicles', 'cars', '', '', '', '0.701591');
INSERT INTO "sidebar"."url_categories" VALUES ('22', 'shopping', 'resources', 'product reviews', '', '', '0.474771');
INSERT INTO "sidebar"."url_categories" VALUES ('22', 'technology and computing', 'internet technology', 'web search', '', '', '0.472867');
INSERT INTO "sidebar"."url_categories" VALUES ('23', 'art and entertainment', 'music', '', '', '', '0.137966');
INSERT INTO "sidebar"."url_categories" VALUES ('23', 'travel', 'tourist destinations', 'france', '', '', '0.095961');
INSERT INTO "sidebar"."url_categories" VALUES ('23', 'technology and computing', 'internet technology', 'email', '', '', '0.093337');
INSERT INTO "sidebar"."url_categories" VALUES ('32', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('32', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('32', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('33', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('33', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('33', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('34', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('34', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('34', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('37', 'business and industrial', 'business operations', 'business plans', '', '', '0.599520');
INSERT INTO "sidebar"."url_categories" VALUES ('37', 'automotive and vehicles', 'electric vehicles', '', '', '', '0.224540');
INSERT INTO "sidebar"."url_categories" VALUES ('37', 'technology and computing', '', '', '', '', '0.192090');
INSERT INTO "sidebar"."url_categories" VALUES ('30', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.433114');
INSERT INTO "sidebar"."url_categories" VALUES ('30', 'technology and computing', 'internet technology', 'email', '', '', '0.298543');
INSERT INTO "sidebar"."url_categories" VALUES ('30', 'hobbies and interests', 'guitar', '', '', '', '0.236217');
INSERT INTO "sidebar"."url_categories" VALUES ('35', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('35', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('35', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('36', 'news', '', '', '', '', '0.389049');
INSERT INTO "sidebar"."url_categories" VALUES ('36', 'travel', '', '', '', '', '0.321863');
INSERT INTO "sidebar"."url_categories" VALUES ('36', 'technology and computing', 'software', '', '', '', '0.303563');
INSERT INTO "sidebar"."url_categories" VALUES ('38', 'technology and computing', 'consumer electronics', 'camera and photo equipment', 'cameras and camcorders', 'cameras', '0.679511');
INSERT INTO "sidebar"."url_categories" VALUES ('38', 'careers', 'nursing', '', '', '', '0.248631');
INSERT INTO "sidebar"."url_categories" VALUES ('38', 'law, govt and politics', 'politics', 'elections', '', '', '0.134952');
INSERT INTO "sidebar"."url_categories" VALUES ('41', 'law, govt and politics', 'legal issues', 'legislation', '', '', '0.446285');
INSERT INTO "sidebar"."url_categories" VALUES ('41', 'health and fitness', 'addiction', 'smoking addiction', '', '', '0.256792');
INSERT INTO "sidebar"."url_categories" VALUES ('41', 'food and drink', '', '', '', '', '0.155291');
INSERT INTO "sidebar"."url_categories" VALUES ('42', 'hobbies and interests', 'getting published', 'freelance writing', '', '', '0.577079');
INSERT INTO "sidebar"."url_categories" VALUES ('42', 'science', 'biology', 'cytology', '', '', '0.576974');
INSERT INTO "sidebar"."url_categories" VALUES ('42', 'society', 'crime', '', '', '', '0.535476');
INSERT INTO "sidebar"."url_categories" VALUES ('39', 'technology and computing', 'internet technology', 'social network', '', '', '0.560452');
INSERT INTO "sidebar"."url_categories" VALUES ('39', 'health and fitness', 'disease', 'allergies', '', '', '0.401354');
INSERT INTO "sidebar"."url_categories" VALUES ('39', 'society', 'dating', '', '', '', '0.374853');
INSERT INTO "sidebar"."url_categories" VALUES ('44', 'health and fitness', 'disorders', 'mental disorder', 'panic and anxiety', '', '0.590479');
INSERT INTO "sidebar"."url_categories" VALUES ('44', 'food and drink', '', '', '', '', '0.537762');
INSERT INTO "sidebar"."url_categories" VALUES ('44', 'religion and spirituality', '', '', '', '', '0.385138');
INSERT INTO "sidebar"."url_categories" VALUES ('31', 'society', 'unrest and war', '', '', '', '0.300496');
INSERT INTO "sidebar"."url_categories" VALUES ('31', 'family and parenting', '', '', '', '', '0.260903');
INSERT INTO "sidebar"."url_categories" VALUES ('31', 'business and industrial', '', '', '', '', '0.217887');
INSERT INTO "sidebar"."url_categories" VALUES ('43', 'art and entertainment', 'comics and animation', 'comics', '', '', '0.624668');
INSERT INTO "sidebar"."url_categories" VALUES ('43', 'hobbies and interests', 'games', 'role playing games', '', '', '0.565756');
INSERT INTO "sidebar"."url_categories" VALUES ('43', 'technology and computing', 'software', 'shareware and freeware', '', '', '0.399031');
INSERT INTO "sidebar"."url_categories" VALUES ('40', 'society', 'work', 'unemployment', '', '', '0.527083');
INSERT INTO "sidebar"."url_categories" VALUES ('40', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.454305');
INSERT INTO "sidebar"."url_categories" VALUES ('40', 'technology and computing', 'operating systems', 'mac os', '', '', '0.243126');
INSERT INTO "sidebar"."url_categories" VALUES ('45', 'news', 'dating', 'blank', 'blank', 'blank', '0.100000');
COMMIT;


-- ----------------------------
--  Table structure for user_history
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."user_history";
CREATE TABLE "sidebar"."user_history" (
    "userid" int4 NOT NULL,
    "urlid" int4 NOT NULL,
    "visit_count" int4,
    "last_visit" timestamp(6) NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."user_history" OWNER TO "sidebar";

-- ----------------------------
--  Records of user_history
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."user_history" VALUES ('2', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('3', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('4', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('2', '22', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('10', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('12', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('13', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('14', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('15', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('16', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('17', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('18', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('19', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('20', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '22', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '29', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '30', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '43', '4', null);
INSERT INTO "sidebar"."user_history" VALUES ('10', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('13', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('12', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('14', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('15', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('16', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('17', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('18', '3', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('19', '4', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('20', '5', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('21', '6', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('22', '7', '3', null);
COMMIT;



-- ----------------------------
--  Primary key structure for table dancecard
-- ----------------------------
ALTER TABLE "sidebar"."dancecard" ADD PRIMARY KEY ("userid", "partnerid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table messages
-- ----------------------------
ALTER TABLE "sidebar"."messages" ADD PRIMARY KEY ("senderid", "receiverid", "sendtime") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table notifications
-- ----------------------------
ALTER TABLE "sidebar"."notifications" ADD PRIMARY KEY ("notificationid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table url_categories
-- ----------------------------
ALTER TABLE "sidebar"."url_categories" ADD PRIMARY KEY ("urlid", "level1", "level2", "level3") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table urls
-- ----------------------------
ALTER TABLE "sidebar"."urls" ADD PRIMARY KEY ("urlid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table user_history
-- ----------------------------
ALTER TABLE "sidebar"."user_history" ADD PRIMARY KEY ("userid", "urlid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table userprefs
-- ----------------------------
ALTER TABLE "sidebar"."userprefs" ADD PRIMARY KEY ("userid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Checks structure for table userprefs
-- ----------------------------
ALTER TABLE "sidebar"."userprefs" ADD CONSTRAINT "userprefs_check" CHECK ((age_max > age_min)) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table users
-- ----------------------------
ALTER TABLE "sidebar"."users" ADD PRIMARY KEY ("userid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Checks structure for table users
-- ----------------------------
ALTER TABLE "sidebar"."users" ADD CONSTRAINT "users_dateofbirth_check" CHECK ((dateofbirth < ('now'::text)::date)) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."users" ADD CONSTRAINT "users_age_check" CHECK (((age > 0) AND (age < 100))) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table dancecard
-- ----------------------------
ALTER TABLE "sidebar"."dancecard" ADD CONSTRAINT "dancecard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."dancecard" ADD CONSTRAINT "dancecard_partnerid_fkey" FOREIGN KEY ("partnerid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table messages
-- ----------------------------
ALTER TABLE "sidebar"."messages" ADD CONSTRAINT "messages_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."messages" ADD CONSTRAINT "messages_receiverid_fkey" FOREIGN KEY ("receiverid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table notifications
-- ----------------------------
ALTER TABLE "sidebar"."notifications" ADD CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."notifications" ADD CONSTRAINT "notifications_about_userid_fkey" FOREIGN KEY ("about_userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table url_categories
-- ----------------------------
ALTER TABLE "sidebar"."url_categories" ADD CONSTRAINT "url_categories_urlid_fkey" FOREIGN KEY ("urlid") REFERENCES "sidebar"."urls" ("urlid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table user_history
-- ----------------------------
ALTER TABLE "sidebar"."user_history" ADD CONSTRAINT "user_history_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."user_history" ADD CONSTRAINT "user_history_urlid_fkey" FOREIGN KEY ("urlid") REFERENCES "sidebar"."urls" ("urlid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table userprefs
-- ----------------------------
ALTER TABLE "sidebar"."userprefs" ADD CONSTRAINT "userprefs_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
=======

--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: sidebar; Type: SCHEMA; Schema: -; Owner: sidebar
--
DROP SCHEMA IF EXISTS sidebar CASCADE;
CREATE SCHEMA sidebar;


ALTER SCHEMA sidebar OWNER TO sidebar;
>>>>>>> Stashed changes

DROP FUNCTION IF EXISTS dancecard_notification();
DROP FUNCTION IF EXISTS message_notification();
DROP FUNCTION IF EXISTS notify_trigger();
DROP FUNCTION IF EXISTS check_mutual(userid1 int, userid2 int);

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

<<<<<<< Updated upstream
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
=======
CREATE TABLE url_categories (
    urlid integer NOT NULL,
    level1 character varying(40) NOT NULL,
    level2 character varying(40) NOT NULL,
    level3 character varying(40) NOT NULL,
    level4 character varying(40),
    level5 character varying(40),
    score numeric(6,6)
);


<<<<<<< HEAD
ALTER TABLE sidebar.url_categories OWNER TO sidebar;

--
-- Name: urls; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--

DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
    urlid integer NOT NULL,
    url character varying(300),
    page_title character varying(140),
    primary_img_url character varying(140)
);


ALTER TABLE sidebar.urls OWNER TO sidebar;

--
-- Name: urls_urlid_seq; Type: SEQUENCE; Schema: sidebar; Owner: sidebar
--

CREATE SEQUENCE urls_urlid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sidebar.urls_urlid_seq OWNER TO sidebar;

--
-- Name: urls_urlid_seq; Type: SEQUENCE OWNED BY; Schema: sidebar; Owner: sidebar
--

ALTER SEQUENCE urls_urlid_seq OWNED BY urls.urlid;


--
-- Name: user_history; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--
DROP TABLE IF EXISTS user_history;

CREATE TABLE user_history (
    userid integer NOT NULL,
    urlid integer NOT NULL,
    visit_count integer,
    last_visit timestamp without time zone
);


ALTER TABLE sidebar.user_history OWNER TO sidebar;

--
-- Name: userprefs; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--
DROP TABLE IF EXISTS userprefs;

CREATE TABLE userprefs (
    userid integer NOT NULL,
    male boolean,
    female boolean,
    age_min integer,
    age_max integer,
    distance_max integer,
    CONSTRAINT userprefs_check CHECK ((age_max > age_min))
);


ALTER TABLE sidebar.userprefs OWNER TO sidebar;

--
-- Name: users; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userid integer NOT NULL,
    username character varying(30) NOT NULL,
    password character varying(30) NOT NULL,
    email character varying(30) NOT NULL,
    gender character(1),
    dateofbirth date,
    age integer,
    location_city character varying(30),
    location_state character varying(30),
    zipcode character(5),
    personal_blurb character varying(300) DEFAULT 'I''m a blank essay'::character varying,
    imageurls character varying(100)[],
    medimageurls character varying(100)[],
    smallimageurls character varying(100)[],
    CONSTRAINT users_age_check CHECK (((age > 0) AND (age < 100))),
    CONSTRAINT users_dateofbirth_check CHECK ((dateofbirth < ('now'::text)::date))
);


ALTER TABLE sidebar.users OWNER TO sidebar;

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: sidebar; Owner: sidebar
--

CREATE SEQUENCE users_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sidebar.users_userid_seq OWNER TO sidebar;

--
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: sidebar; Owner: sidebar
--

ALTER SEQUENCE users_userid_seq OWNED BY users.userid;


--
-- Name: notificationid; Type: DEFAULT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY notifications ALTER COLUMN notificationid SET DEFAULT nextval('notifications_notificationid_seq'::regclass);


--
-- Name: urlid; Type: DEFAULT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY urls ALTER COLUMN urlid SET DEFAULT nextval('urls_urlid_seq'::regclass);


--
-- Name: userid; Type: DEFAULT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY users ALTER COLUMN userid SET DEFAULT nextval('users_userid_seq'::regclass);

--
-- Data for Name: users; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--


COPY users (userid, username, password, email, gender, dateofbirth, age, location_city, location_state, zipcode, personal_blurb, imageurls, medimageurls, smallimageurls) FROM stdin;
23  Christina   1234    christina@gmail.com f   1986-01-01  27  Berkeley    CA  94704   Microcakes and stuff!   {/scaled_23-1.jpg,/scaled_23-2.jpg,/scaled_23-3.jpg}    {/med_23-1.jpg,/med_23-2.jpg,/med_23-3.jpg} {/small_23-1.jpg,/small_23-2.jpg,/small_23-3.jpg}
1   Alex    1234    alex@gmail.com  m   1990-03-03  24  San Mateo   CA  94404   LA based Actor, originally SF Bay Area. Have 2 Feature films currently working on. I like Film/Theater. Family. Friends. Food. Wrestling.   {/scaled_1-1.jpg,/scaled_1-2.jpg,/scaled_1-3.jpg}   {/med_1-1.jpg,/med_1-2.jpg,/med_1-3.jpg}    {/small_1-1.jpg,/small_1-2.jpg,/small_1-3.jpg}
2   James   1234    james@gmail.com m   1989-02-07  25  Richmond    CA  94084   Mellow, night owl, weekend hiker. Illustrator. Art, movie, and game enthusiast. Likes to do something out of the ordinary. Likes Animals.   {/scaled_2-1.jpg,/scaled_2-2.jpg,/scaled_2-3.jpg}   {/med_2-1.jpg,/med_2-2.jpg,/med_2-3.jpg}    {/small_2-1.jpg,/small_2-2.jpg,/small_2-3.jpg}
3   Hunter  1234    hunter@gmail.com    m   1991-10-06  22  Oakland CA  94607   Looking for like minded chill people. Interested in clubs, parties, and meaningless shinnanigans.   {/scaled_3-1.jpg,/scaled_3-2.jpg,/scaled_3-3.jpg}   {/med_3-1.jpg,/med_3-2.jpg,/med_3-3.jpg}    {/small_3-1.jpg,/small_3-2.jpg,/small_3-3.jpg}
4   Joseph  1234    joseph@gmail.com    m   1984-01-30  30  Fremont CA  94536   God, talking, playing basketball, cooking, beach, gym, smiles. I've no kids, but I want some. Don't be shy. {/scaled_4-1.jpg,/scaled_4-2.jpg,/scaled_4-3.jpg}   {/med_4-1.jpg,/med_4-2.jpg,/med_4-3.jpg}    {/small_4-1.jpg,/small_4-2.jpg,/small_4-3.jpg}
5   Robert  1234    robert@gmail.com    m   1991-01-01  23  Daily City  CA  94015   I am an urban farmer, so that's pretty fun! Backpacking, climbing, running, biking, the works. I also write for a food politics journal!    {/scaled_5-1.jpg,/scaled_5-2.jpg,/scaled_5-3.jpg}   {/med_5-1.jpg,/med_5-2.jpg,/med_5-3.jpg}    {/small_5-1.jpg,/small_5-2.jpg,/small_5-3.jpg}
6   Kenny   1234    kenny@gmail.com m   1990-06-05  23  San Francisco   CA  94111   I've always been a creator, but cinematography is my driving force. It's what satisfies me. I shoot horrors, westerns, and thrillers.   {/scaled_6-1.jpg,/scaled_6-2.jpg,/scaled_6-3.jpg}   {/med_6-1.jpg,/med_6-2.jpg,/med_6-3.jpg}    {/small_6-1.jpg,/small_6-2.jpg,/small_6-3.jpg}
7   Jarod   1234    jarod@gmail.com m   1990-10-25  23  Daily City  CA  94015   I love the idea of creating art for a living. I'm good at singing/songwriting/guitar/acting/improvisation/poker {/scaled_7-1.jpg,/scaled_7-2.jpg,/scaled_7-3.jpg}   {/med_7-1.jpg,/med_7-2.jpg,/med_7-3.jpg}    {/small_7-1.jpg,/small_7-2.jpg,/small_7-3.jpg}
8   Daniel  1234    daniel@gmail.com    m   1989-05-13  24  Berkeley    CA  94704   Things I love... Dance, Guitar, Music in general, pursuing my passions, experiencing life and a lot more    {/scaled_8-1.jpg,/scaled_8-2.jpg,/scaled_8-3.jpg}   {/med_8-1.jpg,/med_8-2.jpg,/med_8-3.jpg}    {/small_8-1.jpg,/small_8-2.jpg,/small_8-3.jpg}
9   Evan    1234    evan@gmail.com  m   1984-07-04  29  Daily City  CA  94015   Things I could not live without: Food, exercise, sex, laughter, sports, friends {/scaled_9-1.jpg,/scaled_9-2.jpg,/scaled_9-3.jpg}   {/med_9-1.jpg,/med_9-2.jpg,/med_9-3.jpg}    {/small_9-1.jpg,/small_9-2.jpg,/small_9-3.jpg}
10  Elijah  1234    elijah@gmail.com    m   1986-11-14  27  Daily City  CA  94015   Making the most out of my time. Kicking ass and having fun. I like to dance, giggle, wiggle, and work on my power moves while driving.  {/scaled_10-1.jpg,/scaled_10-2.jpg,/scaled_10-3.jpg}    {/med_10-1.jpg,/med_10-2.jpg,/med_10-3.jpg} {/small_10-1.jpg,/small_10-2.jpg,/small_10-3.jpg}
11  Michael 1234    michael@gmail.com   m   1984-07-27  29  Berkeley    CA  94704   My interests and skills are acting, singing, swimming, running, soccer, and I love to hike and I am a gym fanatic as well.  {/scaled_11-1.jpg,/scaled_11-2.jpg,/scaled_11-3.jpg}    {/med_11-1.jpg,/med_11-2.jpg,/med_11-3.jpg} {/small_11-1.jpg,/small_11-2.jpg,/small_11-3.jpg}
12  Benny   1234    benny@gmail.com m   1990-06-28  23  Berkeley    CA  94704   Filmmaking, capoeira, oil paintings, and theatre are the aspirations on the table. Also love sunlight, food, vegetation, and chocolate  {/scaled_12-1.jpg,/scaled_12-2.jpg,/scaled_12-3.jpg}    {/med_12-1.jpg,/med_12-2.jpg,/med_12-3.jpg} {/small_12-1.jpg,/small_12-2.jpg,/small_12-3.jpg}
13  Peter   1234    peter@gmail.com m   1991-11-08  22  Oakland CA  94607   The activities I most like to do are acting in my free times , spending time with my dog, and watching movies.  {/scaled_13-1.jpg,/scaled_13-2.jpg,/scaled_13-3.jpg}    {/med_13-1.jpg,/med_13-2.jpg,/med_13-3.jpg} {/small_13-1.jpg,/small_13-2.jpg,/small_13-3.jpg}
14  Shane   1234    shane@gmail.com m   1984-04-23  30  Daily City  CA  94015   I'm little bit all over the place i draw paint sing play guitar and do graphic design i love my two dogs tomatoe and ninja! {/scaled_14-1.jpg,/scaled_14-2.jpg,/scaled_14-3.jpg}    {/med_14-1.jpg,/med_14-2.jpg,/med_14-3.jpg} {/small_14-1.jpg,/small_14-2.jpg,/small_14-3.jpg}
15  Luke    1234    luke@gmail.com  m   1990-12-23  23  Richmond    CA  94084   Sports, Technology, Beer, Books, Fishing, Going out and having fun! {/scaled_15-1.jpg,/scaled_15-2.jpg,/scaled_15-3.jpg}    {/med_15-1.jpg,/med_15-2.jpg,/med_15-3.jpg} {/small_15-1.jpg,/small_15-2.jpg,/small_15-3.jpg}
16  Jackson 1234    jackson@gmail.com   m   1990-05-29  23  Richmond    CA  94084   Battling monsters, demons, and lethargy. Creating stuff from nowhere. Leaving footprints and taking pictures of the footprint   {/scaled_16-1.jpg,/scaled_16-2.jpg,/scaled_16-3.jpg}    {/med_16-1.jpg,/med_16-2.jpg,/med_16-3.jpg} {/small_16-1.jpg,/small_16-2.jpg,/small_16-3.jpg}
17  Zane    1234    zane@gmail.com  m   1986-06-27  27  Oakland CA  94607   I love to have fun, work out and play baseball. I'm quite the jokester- I'm sure I can make you laugh.  {/scaled_17-1.jpg,/scaled_17-2.jpg,/scaled_17-3.jpg}    {/med_17-1.jpg,/med_17-2.jpg,/med_17-3.jpg} {/small_17-1.jpg,/small_17-2.jpg,/small_17-3.jpg}
18  Brock   1234    brock@gmail.com m   1988-08-06  25  Oakland CA  94607   Writing, acting, kareoke(sometimes), making pizza, drinking(not too proud of that one) and negotiating  {/scaled_18-1.jpg,/scaled_18-2.jpg,/scaled_18-3.jpg}    {/med_18-1.jpg,/med_18-2.jpg,/med_18-3.jpg} {/small_18-1.jpg,/small_18-2.jpg,/small_18-3.jpg}
19  Ryan    1234    ryan@gmail.com  m   1985-09-24  28  Belmont CA  94002   Making moves, tshirt design, writing music and poetry, drawing, photography, living life how I define it    {/scaled_19-1.jpg,/scaled_19-2.jpg,/scaled_19-3.jpg}    {/med_19-1.jpg,/med_19-2.jpg,/med_19-3.jpg} {/small_19-1.jpg,/small_19-2.jpg,/small_19-3.jpg}
20  Sebastian   1234    sebastian@gmail.com m   1991-03-01  23  Richmond    CA  94084   Technology - Crafting - Video Games - Using Common Sense - Rubiks Cube - Managing - Writing - Guitar - Fixing burned out light bulbs    {/scaled_20-1.jpg,/scaled_20-2.jpg,/scaled_20-3.jpg}    {/med_20-1.jpg,/med_20-2.jpg,/med_20-3.jpg} {/small_20-1.jpg,/small_20-2.jpg,/small_20-3.jpg}
21  David   1234    david@gmail.com m   1984-04-05  30  San Mateo   CA  94404   Sports, jeopardy, chess, poker, family, friends, music, books   {/scaled_21-1.jpg,/scaled_21-2.jpg,/scaled_21-3.jpg}    {/med_21-1.jpg,/med_21-2.jpg,/med_21-3.jpg} {/small_21-1.jpg,/small_21-2.jpg,/small_21-3.jpg}
22  Andrew  1234    andrew@gmail.com    m   1985-12-15  28  Berkeley    CA  94704   I've never been beaten at MarioKart 64. Ever. I'm the best on Earth. It's a curse   {/scaled_22-1.jpg,/scaled_22-2.jpg,/scaled_22-3.jpg}    {/med_22-1.jpg,/med_22-2.jpg,/med_22-3.jpg} {/small_22-1.jpg,/small_22-2.jpg,/small_22-3.jpg}
\.


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: sidebar; Owner: sidebar
--

SELECT pg_catalog.setval('users_userid_seq', 20, true);



--
-- Data for Name: dancecard; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY dancecard (userid, partnerid, status, mutual, updatetime) FROM stdin;
23  11  added   t   2014-05-05 16:33:11
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY messages (senderid, receiverid, message, sendtime) FROM stdin;
23  11  I see you're on github? 2014-05-05 16:39:59
11  23  Hi there cutie! 2014-05-05 16:40:17
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY notifications (notificationid, userid, about_userid, message, action_time, type, subtype, status) FROM stdin;
\.


--
-- Name: notifications_notificationid_seq; Type: SEQUENCE SET; Schema: sidebar; Owner: sidebar
--

SELECT pg_catalog.setval('notifications_notificationid_seq', 1, false);


--
-- Data for Name: url_categories; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY url_categories (urlid, level1, level2, level3, level4, level5, score) FROM stdin;
3   travel  specialty travel    vineyards           0.771858
3   food and drink  beverages   alcoholic beverages wine        0.633116
3   business and industrial agriculture and forestry    crops and seed          0.054800
1   technology and computing    internet technology social network          0.488826
1   art and entertainment   movies and tv   movies          0.288975
1   business and industrial                 0.247608
5   family and parenting                    0.437683
5   pets    cats                0.281174
5   education   homework and study tips             0.246091
4   travel  specialty travel    vineyards           0.771858
4   food and drink  beverages   alcoholic beverages wine        0.633116
4   business and industrial agriculture and forestry    crops and seed          0.054800
6   family and parenting                    0.394961
6   art and entertainment   visual art and design   design          0.285270
6   business and industrial company merger and acquisition          0.218782
2   art and entertainment   movies and tv   movies          0.366779
2   hobbies and interests   guitar              0.301621
2   business and industrial                 0.281700
9   technology and computing    internet technology email           0.634357
9   shopping    gifts               0.413833
9   hobbies and interests   arts and crafts crochet         0.409018
15  family and parenting    children                0.426110
15  society                 0.333390
15  business and industrial                 0.235372
7   finance bank    atms            0.544048
7   family and parenting                    0.391303
7   style and fashion   jewelry bracelets           0.373276
11  home and garden appliances  small appliances    food processors     0.500086
11  business and industrial energy  oil         0.489626
11  food and drink  desserts and baking             0.393319
17  technology and computing    programming languages   java            0.522546
17  technology and computing    software                0.460356
17  shopping    resources   product reviews         0.352878
16  business and industrial                 0.361359
16  business and industrial business operations business plans          0.256385
16  hobbies and interests   reading             0.184031
14  technology and computing    internet technology email           0.554103
14  society crime   property crime  piracy      0.449075
14  technology and computing    consumer electronics    game systems and consoles   xbox        0.365870
20  technology and computing    internet technology email           0.663538
20  technology and computing    internet technology social network          0.426642
20  news    local news              0.347285
19  business and industrial                 0.384719
19  art and entertainment   movies and tv   movies          0.275626
19  education                   0.247802
10  technology and computing    programming languages   javascript          0.771187
10  technology and computing    software    databases           0.165709
10  technology and computing    internet technology email           0.143043
12  technology and computing    software                0.331832
12  business and industrial                 0.157346
12  business and industrial business operations management  project management      0.150008
21  education   school              0.469108
21  science computer science    information science         0.187253
21  careers                 0.159794
18  society crime   property crime  larceny     0.422567
18  sports  running and jogging             0.307609
18  technology and computing                    0.246521
27  technology and computing    programming languages   c and c++           0.320373
27  technology and computing    mp3 and midi                0.239909
27  technology and computing    hardware    computer            0.207707
25  business and industrial advertising and marketing   advertising         0.254679
25  technology and computing                    0.156716
25  technology and computing    internet technology web search          0.128620
29  law, govt and politics  armed forces    air force           0.439661
29  law, govt and politics  armed forces    army            0.262220
29  art and entertainment   visual art and design   drawing         0.216497
28  art and entertainment   movies and tv   movies          0.532373
28  style and fashion   accessories hats            0.500143
28  technology and computing    internet technology email           0.443534
24  family and parenting                    0.318184
24  education   school              0.313217
24  news                    0.286366
22  automotive and vehicles cars                0.701591
22  shopping    resources   product reviews         0.474771
22  technology and computing    internet technology web search          0.472867
23  art and entertainment   music               0.137966
23  travel  tourist destinations    france          0.095961
23  technology and computing    internet technology email           0.093337
32  technology and computing    networking  vpn and remote access           0.362235
32  society crime   property crime  piracy      0.356055
32  technology and computing    programming languages   javascript          0.328269
33  technology and computing    networking  vpn and remote access           0.362235
33  society crime   property crime  piracy      0.356055
33  technology and computing    programming languages   javascript          0.328269
34  technology and computing    networking  vpn and remote access           0.362235
34  society crime   property crime  piracy      0.356055
34  technology and computing    programming languages   javascript          0.328269
37  business and industrial business operations business plans          0.599520
37  automotive and vehicles electric vehicles               0.224540
37  technology and computing                    0.192090
30  art and entertainment   movies and tv   movies          0.433114
30  technology and computing    internet technology email           0.298543
30  hobbies and interests   guitar              0.236217
35  technology and computing    networking  vpn and remote access           0.362235
35  society crime   property crime  piracy      0.356055
35  technology and computing    programming languages   javascript          0.328269
36  news                    0.389049
36  travel                  0.321863
36  technology and computing    software                0.303563
38  technology and computing    consumer electronics    camera and photo equipment  cameras and camcorders  cameras 0.679511
38  careers nursing             0.248631
38  law, govt and politics  politics    elections           0.134952
41  law, govt and politics  legal issues    legislation         0.446285
41  health and fitness  addiction   smoking addiction           0.256792
41  food and drink                  0.155291
42  hobbies and interests   getting published   freelance writing           0.577079
42  science biology cytology            0.576974
42  society crime               0.535476
39  technology and computing    internet technology social network          0.560452
39  health and fitness  disease allergies           0.401354
39  society dating              0.374853
44  health and fitness  disorders   mental disorder panic and anxiety       0.590479
44  food and drink                  0.537762
44  religion and spirituality                   0.385138
31  society unrest and war              0.300496
31  family and parenting                    0.260903
31  business and industrial                 0.217887
43  art and entertainment   comics and animation    comics          0.624668
43  hobbies and interests   games   role playing games          0.565756
43  technology and computing    software    shareware and freeware          0.399031
40  society work    unemployment            0.527083
40  art and entertainment   movies and tv   movies          0.454305
40  technology and computing    operating systems   mac os          0.243126
45  search  blank   blank   blank   blank   0.100000
\.


--
-- Data for Name: urls; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY urls (urlid, url, page_title, primary_img_url) FROM stdin;
8   http://www.webmd.com/women/guide/essential-vitamins-for-women-at-every-age  Essential Vitamins for Women at Every Age   \N
13  https://wwws.mint.com/login.event   Mint.com    \N
14  https://chaseonline.chase.com/  Chase Online - Logon    \N
16  http://www.adamwaaramaa.com/fundraising/writing-your-pitch-deck/    How To Write A Killer Pitch Deck In 10 Slides | Adam Waaramaa On Entrepreneurship   \N
18  http://www.thewhir.com/web-hosting-news/hackers-find-cloud-account-credentials-github-leading-72-hour-cryptocurrency-mining-spree   Hackers Find Cloud Account Credentials on GitHub Leading to 72-Hour Cryptocurrency Mining Spree - Web Host Industry Review  \N
20  http://www.netflix.com/WiPlayer?movieid=70267239&trkid=13462260&tctx=0%2C0%2C4c7eecbf-d697-4cef-a100-83ed8e72f3e8-693061    Netflix \N
25  https://www.netflix.com/?locale=en-US   Netflix - Watch TV Shows Online, Watch Movies Online    \N
27  http://assorted-experience.blogspot.com/2014/05/doctesting-python-command-line-scripts.html Assorted Experience: Doctesting Python command line scripts \N
36  https://news.ycombinator.com/newest New Links | Hacker News \N
43  https://www.comixology.com/top-rated    Top Rated Comics - Comics by comiXology \N
1   http://techcrunch.com/2014/05/05/facebook-acqusition-helped-oculus/ Oculus CEO Says Selling To Facebook Convinced Big Developers To Build For It | TechCrunch   http://tctechcrunch2011.files.wordpress.com/2014/05/brendan-iribe-oculus12.jpg
3   https://vine.co/lists/20-explosive-moments-when-the-beat-drops  https://vine.co/lists/20-explosive-moments-when-the-beat-drops  https://vine.co/assets/images/meta/vine_screencap.png
5   http://mashable.com/2014/05/05/doge-vine/   Much Doge on Vine. So Wow.  http://rack.1.mshcdn.com/media/ZgkyMDE0LzA1LzA1L2ExL0RvZ2VWaW5lLjdkNGY5LmpwZwpwCXRodW1iCTk1MHg1MzQjCmUJanBn/43950e8a/c33/Doge-Vine.jpg
2   http://techcrunch.com/  TechCrunch - The latest technology news and information on startups http://s1.wp.com/wp-content/themes/vip/techcrunch-2013/assets/images/logo-large.png?m=1391183173g
4   https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable   https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable   https://vine.co/assets/images/meta/vine_screencap.png
6   http://mashable.com/2014/05/05/automattic-funding/  WordPress.com Creator Automattic Raises $160 Million    http://rack.2.mshcdn.com/media/ZgkyMDE0LzA1LzA1LzcwL211bGxlbndlZzEuYmEwM2QuanBnCnAJdGh1bWIJOTUweDUzNCMKZQlqcGc/b8478ee1/b93/mullenweg1.jpg
9   https://www.etsy.com/   Etsy - Your place to buy and sell all things handmade, vintage, and supplies    http://www.etsy.com/images/logo_no_border.gif
7   http://www.pinterest.com/pin/182395853631827993/    Pin by Evelyn Poeppelmeier on Style and Beauty: Dresses (Gowns and Re…  http://media-cache-ec0.pinimg.com/736x/66/75/a7/6675a752e2d18c4398ad722f3dd21324.jpg
11  http://americanfood.about.com/od/classicchowdersandstews/r/beefstew.htm Old Fashioned Beef Stew Recipe - How to Make Old Fashioned Beef Stew    http://0.tqn.com/d/americanfood/1/0/v/-/-/-/beefstew.jpg
12  https://github.com/ GitHub  https://github.global.ssl.fastly.net/images/modules/open_graph/github-logo.png
15  http://www.iftf.org/what-we-do/who-we-are/staff/marina-gorbis/  IFTF: Marina Gorbis http://www.iftf.org/uploads/RTEmagicC_picture-43.gif.gif
17  http://www.infoworld.com/d/security/github-bans-weak-passwords-after-brute-force-attack-results-in-compromised-accounts-231273  GitHub bans weak passwords after brute-force attack results in compromised accounts | Security - InfoWorld  http://computerworld.com.edgesuite.net/ifw/IFW.png
19  http://hbr.org/2014/01/how-netflix-reinvented-hr/ar/1   How Netflix Reinvented HR - Harvard Business Review http://static.hbr.org/hbrg-main/resources/images/hbr_opengraph_360x185.png
23  https://www.youtube.com/watch?v=wo8aSo5Tv1E Air - Moon Safari [Full Album] - YouTube    https://i1.ytimg.com/vi/wo8aSo5Tv1E/maxresdefault.jpg
10  http://www.ultimate-guitar.com/ ULTIMATE GUITAR TABS. 800,000 songs catalog with free Chords, Guitar Tabs, Bass Tabs, Ukulele Chords and Guitar Pro Tabs!   http://www.ultimate-guitar.com/tv/images/16168_r182858_thumbnail_small.jpg
21  https://www.ischool.berkeley.edu/about  About | School of Information   http://www.ischool.berkeley.edu/files/imagecache/og/i_square.jpg
26  http://www.nbcnews.com/storyline/missing-jet/boeing-rolls-royce-face-bill-over-hunt-flight-mh370-n97011 Boeing, Rolls-Royce to Face Bill Over Hunt for Flight MH370 - NBC News.com  http://media3.s-nbcnews.com/i/newscms/2014_18/418316/tdy_jet-comp_140503_df28c0aa38fb70472c7b9a055ada9805.jpg
28  https://medium.com/editors-picks/ad3d3c5e3c65   Forget 140 characters: Here’s How to Go to Jail for 10 Months for One ‘k’ — Editor’s Picks — Medium https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*lWDlFbAzgqwW_RCf9FGaiQ.jpeg
24  http://www.slate.com/articles/podcasts/culturegabfest.html  Culture Gabfest http://www.slate.com/etc/designs/slate/images/slate_facebook_icon.png
22  http://www.nytimes.com/ The New York Times - Breaking News, World News & Multimedia http://i1.nyt.com/images/2014/05/06/health/POLIO/POLIO-largeHorizontal375.jpg
32  https://play.spotify.com/artist/1yAwtBaoHLEDWAnWR87hBT  Spotify Web Player  https://play.spotify.edgekey.net/site/00898f3/images/download.png
33  https://play.spotify.com/browse Spotify Web Player  https://play.spotify.edgekey.net/site/00898f3/images/download.png
34  https://play.spotify.com/album/2okCg9scHue9GNELoB8U9g   Spotify Web Player  https://play.spotify.edgekey.net/site/00898f3/images/download.png
35  https://play.spotify.com/radio/artist/3TVXtAsR1Inumwj472S9r4    Spotify Web Player  https://play.spotify.edgekey.net/site/00898f3/images/download.png
37  https://www.youtube.com/watch?v=IgKWPdJWuBQ Elon Musk: The mind behind Tesla, SpaceX, SolarCity ... - YouTube   https://i1.ytimg.com/vi/IgKWPdJWuBQ/maxresdefault.jpg
38  https://www.youtube.com/watch?v=6ycn5VmBUYY 100 Days of Dance - YouTube https://i1.ytimg.com/vi/6ycn5VmBUYY/maxresdefault.jpg
40  http://www.imdb.com/chart/top   IMDb Top 250 - IMDb http://ia.media-imdb.com/images/G/01/imdb/images/logos/imdb_fb_logo-1730868325._V379391653_.png
42  http://www.nytimes.com/pages/opinion/index.html Editorials, Columns, Op-Ed, Letters, Opinionator and More Opinion - The New York Times  http://graphics8.nytimes.com/images/2014/05/05/opinion/0503OPEDisland/0503OPEDisland-sfSpan-v2.jpg
39  https://www.youtube.com/watch?v=zRlpIkH3b5I Photoshopping Real Women Into Cover Models - YouTube    https://i1.ytimg.com/vi/zRlpIkH3b5I/hqdefault.jpg
29  https://medium.com/editors-picks/a26385113bf0   Cold War Coloring Book Taught A-10 Pilots to Kill Soviet Tanks — Editor’s Picks — Medium    https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/blue/overlay/blue/1*t6gtNb-DAEXHHo1NZ3IPCQ.jpeg
30  https://medium.com/editors-picks/1bd6f5e75763   What Everyone Could Be Missing About the Kurt Cobain ‘Bitch With Zits’ Letter  — Editor’s Picks — Medium    https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/yellow/overlay/yellow/1*0n_-k5-MxIu3uXBcTVg1Xg.jpeg
31  https://medium.com/editors-picks/646320568f9d   When a Kidnapped Journalist Is a Freelancer — Editor’s Picks — Medium   https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*ltkYYkHx6CHF5TzMqTO4hw.jpeg
41  http://www.nytimes.com/roomfordebate/2014/05/04/how-should-electronic-cigarretes-be-regulated   How Should Electronic Cigarretes Be Regulated? - Room for Debate - NYTimes.com  http://graphics8.nytimes.com/images/2014/04/29/opinion/rfdvaping/rfdvaping-thumbWide.jpg
44  http://www.pinterest.com/all/humor/ Humor on Pinterest - funny pictures, quotes and memes   http://media-cache-ak0.pinimg.com/236x/62/e5/83/62e5835df7b7c13edbdc1aeead3a3273.jpg
45  https://www.google.com/ Google Home Page    \N
\.


--
-- Name: urls_urlid_seq; Type: SEQUENCE SET; Schema: sidebar; Owner: sidebar
--

SELECT pg_catalog.setval('urls_urlid_seq', 44, true);


--
-- Data for Name: user_history; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY user_history (userid, urlid, visit_count, last_visit) FROM stdin;
2   12  1   \N
3   12  1   \N
4   12  1   \N
2   22  1   \N
10  45  1   \N
11  45  1   \N
12  45  1   \N
13  45  1   \N
14  45  1   \N
15  45  1   \N
16  45  1   \N
17  45  1   \N
18  45  1   \N
19  45  1   \N
20  45  1   \N
23  12  1   \N
23  22  1   \N
23  45  1   \N
11  29  1   \N
11  30  1   \N
\.


--
-- Data for Name: userprefs; Type: TABLE DATA; Schema: sidebar; Owner: sidebar
--

COPY userprefs (userid, male, female, age_min, age_max, distance_max) FROM stdin;
1   f   t   20  30  45
2   f   t   20  30  45
3   f   t   20  30  45
4   f   t   20  30  45
5   f   t   20  30  45
6   f   t   20  30  45
7   f   t   20  30  45
8   f   t   20  30  45
9   f   t   20  30  45
10  f   t   20  30  45
11  f   t   20  30  45
12  f   t   20  30  45
13  f   t   20  30  45
14  f   t   20  30  45
15  f   t   20  30  45
16  f   t   20  30  45
17  f   t   20  30  45
18  f   t   20  30  45
19  f   t   20  30  45
20  f   t   20  30  45
21  f   t   20  30  45
22  f   t   20  30  45
23  t   f   22  28  30
\.



--
-- Name: dancecard_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY dancecard
    ADD CONSTRAINT dancecard_pkey PRIMARY KEY (userid, partnerid);


--
-- Name: messages_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (senderid, receiverid, sendtime);


--
-- Name: notifications_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notificationid);


--
-- Name: url_categories_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY url_categories
    ADD CONSTRAINT url_categories_pkey PRIMARY KEY (urlid, level1, level2, level3);


--
-- Name: urls_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (urlid);


--
-- Name: user_history_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY user_history
    ADD CONSTRAINT user_history_pkey PRIMARY KEY (userid, urlid);


--
-- Name: userprefs_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY userprefs
    ADD CONSTRAINT userprefs_pkey PRIMARY KEY (userid);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: sidebar; Owner: sidebar; Tablespace:
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: watched_table_trigger; Type: TRIGGER; Schema: sidebar; Owner: sidebar
--

CREATE TRIGGER watched_table_trigger AFTER INSERT ON notifications FOR EACH ROW EXECUTE PROCEDURE notify_trigger();


--
-- Name: dancecard_partnerid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY dancecard
    ADD CONSTRAINT dancecard_partnerid_fkey FOREIGN KEY (partnerid) REFERENCES users(userid) ON DELETE CASCADE;


--
-- Name: dancecard_userid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY dancecard
    ADD CONSTRAINT dancecard_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE;


--
-- Name: messages_receiverid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_receiverid_fkey FOREIGN KEY (receiverid) REFERENCES users(userid);


--
-- Name: messages_senderid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_senderid_fkey FOREIGN KEY (senderid) REFERENCES users(userid);


--
-- Name: notifications_about_userid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_about_userid_fkey FOREIGN KEY (about_userid) REFERENCES users(userid);


--
-- Name: notifications_userid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE;


--
-- Name: url_categories_urlid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY url_categories
    ADD CONSTRAINT url_categories_urlid_fkey FOREIGN KEY (urlid) REFERENCES urls(urlid) ON DELETE CASCADE;


--
-- Name: user_history_urlid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY user_history
    ADD CONSTRAINT user_history_urlid_fkey FOREIGN KEY (urlid) REFERENCES urls(urlid) ON DELETE CASCADE;


--
-- Name: user_history_userid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY user_history
    ADD CONSTRAINT user_history_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE;


--
-- Name: userprefs_userid_fkey; Type: FK CONSTRAINT; Schema: sidebar; Owner: sidebar
--

ALTER TABLE ONLY userprefs
    ADD CONSTRAINT userprefs_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE;


--
-- Name: sidebar; Type: ACL; Schema: -; Owner: sidebar
--

REVOKE ALL ON SCHEMA sidebar FROM PUBLIC;
REVOKE ALL ON SCHEMA sidebar FROM sidebar;
GRANT ALL ON SCHEMA sidebar TO sidebar;
GRANT ALL ON SCHEMA sidebar TO PUBLIC;


--
-- PostgreSQL database dump complete
--




-- ----------------------------
--  Table structure for userprefs
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."userprefs";
CREATE TABLE "sidebar"."userprefs" (
    "userid" int4 NOT NULL,
    "male" bool,
    "female" bool,
    "age_min" int4,
    "age_max" int4,
    "distance_max" int4
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."userprefs" OWNER TO "sidebar";

-- ----------------------------
--  Records of userprefs
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."userprefs" VALUES ('1', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('2', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('3', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('4', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('5', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('6', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('7', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('8', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('9', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('10', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('11', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('12', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('13', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('14', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('15', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('16', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('17', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('18', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('19', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('20', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('21', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('22', 'f', 't', '20', '30', '45');
INSERT INTO "sidebar"."userprefs" VALUES ('23', 't', 'f', '22', '28', '30');
COMMIT;

-- ----------------------------
--  Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."users";
CREATE TABLE "sidebar"."users" (
    "userid" SERIAL PRIMARY KEY,
    "username" varchar(30) NOT NULL COLLATE "default",
    "password" varchar(30) NOT NULL COLLATE "default",
    "email" varchar(30) NOT NULL COLLATE "default",
    "gender" char(1) COLLATE "default",
    "dateofbirth" date,
    "age" int4,
    "location_city" varchar(30) COLLATE "default",
    "location_state" varchar(30) COLLATE "default",
    "zipcode" char(5) COLLATE "default",
    "personal_blurb" varchar(300) DEFAULT 'I''m a blank essay'::character varying COLLATE "default",
    "imageurls" varchar(100)[] COLLATE "default",
    "medimageurls" varchar(100)[] COLLATE "default",
    "smallimageurls" varchar(100)[] COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."users" OWNER TO "sidebar";

-- ----------------------------
--  Records of users
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."users" VALUES ('23', 'Christina', '1234', 'christina@gmail.com', 'f', '1986-01-01', '27', 'Berkeley', 'CA', '94704', 'Microcakes and stuff!', '{/scaled_23-1.jpg,/scaled_23-2.jpg,/scaled_23-3.jpg}', '{/med_23-1.jpg,/med_23-2.jpg,/med_23-3.jpg}', '{/small_23-1.jpg,/small_23-2.jpg,/small_23-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('1', 'Alex', '1234', 'alex@gmail.com', 'm', '1990-03-03', '24', 'San Mateo', 'CA', '94404', 'LA based Actor, originally SF Bay Area. Have 2 Feature films currently working on. I like Film/Theater. Family. Friends. Food. Wrestling.', '{/scaled_1-1.jpg,/scaled_1-2.jpg,/scaled_1-3.jpg}', '{/med_1-1.jpg,/med_1-2.jpg,/med_1-3.jpg}', '{/small_1-1.jpg,/small_1-2.jpg,/small_1-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('2', 'James', '1234', 'james@gmail.com', 'm', '1989-02-07', '25', 'Richmond', 'CA', '94084', 'Mellow, night owl, weekend hiker. Illustrator. Art, movie, and game enthusiast. Likes to do something out of the ordinary. Likes Animals.', '{/scaled_2-1.jpg,/scaled_2-2.jpg,/scaled_2-3.jpg}', '{/med_2-1.jpg,/med_2-2.jpg,/med_2-3.jpg}', '{/small_2-1.jpg,/small_2-2.jpg,/small_2-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('3', 'Hunter', '1234', 'hunter@gmail.com', 'm', '1991-10-06', '22', 'Oakland', 'CA', '94607', 'Looking for like minded chill people. Interested in clubs, parties, and meaningless shinnanigans.', '{/scaled_3-1.jpg,/scaled_3-2.jpg,/scaled_3-3.jpg}', '{/med_3-1.jpg,/med_3-2.jpg,/med_3-3.jpg}', '{/small_3-1.jpg,/small_3-2.jpg,/small_3-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('4', 'Joseph', '1234', 'joseph@gmail.com', 'm', '1984-01-30', '30', 'Fremont', 'CA', '94536', 'God, talking, playing basketball, cooking, beach, gym, smiles. I''ve no kids, but I want some. Don''t be shy.', '{/scaled_4-1.jpg,/scaled_4-2.jpg,/scaled_4-3.jpg}', '{/med_4-1.jpg,/med_4-2.jpg,/med_4-3.jpg}', '{/small_4-1.jpg,/small_4-2.jpg,/small_4-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('5', 'Robert', '1234', 'robert@gmail.com', 'm', '1991-01-01', '23', 'Daily City', 'CA', '94015', 'I am an urban farmer, so that''s pretty fun! Backpacking, climbing, running, biking, the works. I also write for a food politics journal!', '{/scaled_5-1.jpg,/scaled_5-2.jpg,/scaled_5-3.jpg}', '{/med_5-1.jpg,/med_5-2.jpg,/med_5-3.jpg}', '{/small_5-1.jpg,/small_5-2.jpg,/small_5-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('6', 'Kenny', '1234', 'kenny@gmail.com', 'm', '1990-06-05', '23', 'San Francisco', 'CA', '94111', 'I''ve always been a creator, but cinematography is my driving force. It''s what satisfies me. I shoot horrors, westerns, and thrillers.', '{/scaled_6-1.jpg,/scaled_6-2.jpg,/scaled_6-3.jpg}', '{/med_6-1.jpg,/med_6-2.jpg,/med_6-3.jpg}', '{/small_6-1.jpg,/small_6-2.jpg,/small_6-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('7', 'Jarod', '1234', 'jarod@gmail.com', 'm', '1990-10-25', '23', 'Daily City', 'CA', '94015', 'I love the idea of creating art for a living. I''m good at singing/songwriting/guitar/acting/improvisation/poker', '{/scaled_7-1.jpg,/scaled_7-2.jpg,/scaled_7-3.jpg}', '{/med_7-1.jpg,/med_7-2.jpg,/med_7-3.jpg}', '{/small_7-1.jpg,/small_7-2.jpg,/small_7-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('8', 'Daniel', '1234', 'daniel@gmail.com', 'm', '1989-05-13', '24', 'Berkeley', 'CA', '94704', 'Things I love... Dance, Guitar, Music in general, pursuing my passions, experiencing life and a lot more', '{/scaled_8-1.jpg,/scaled_8-2.jpg,/scaled_8-3.jpg}', '{/med_8-1.jpg,/med_8-2.jpg,/med_8-3.jpg}', '{/small_8-1.jpg,/small_8-2.jpg,/small_8-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('9', 'Evan', '1234', 'evan@gmail.com', 'm', '1984-07-04', '29', 'Daily City', 'CA', '94015', 'Things I could not live without: Food, exercise, sex, laughter, sports, friends', '{/scaled_9-1.jpg,/scaled_9-2.jpg,/scaled_9-3.jpg}', '{/med_9-1.jpg,/med_9-2.jpg,/med_9-3.jpg}', '{/small_9-1.jpg,/small_9-2.jpg,/small_9-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('10', 'Elijah', '1234', 'elijah@gmail.com', 'm', '1986-11-14', '27', 'Daily City', 'CA', '94015', 'Making the most out of my time. Kicking ass and having fun. I like to dance, giggle, wiggle, and work on my power moves while driving.', '{/scaled_10-1.jpg,/scaled_10-2.jpg,/scaled_10-3.jpg}', '{/med_10-1.jpg,/med_10-2.jpg,/med_10-3.jpg}', '{/small_10-1.jpg,/small_10-2.jpg,/small_10-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('11', 'Michael', '1234', 'michael@gmail.com', 'm', '1984-07-27', '29', 'Berkeley', 'CA', '94704', 'My interests and skills are acting, singing, swimming, running, soccer, and I love to hike and I am a gym fanatic as well.', '{/scaled_11-1.jpg,/scaled_11-2.jpg,/scaled_11-3.jpg}', '{/med_11-1.jpg,/med_11-2.jpg,/med_11-3.jpg}', '{/small_11-1.jpg,/small_11-2.jpg,/small_11-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('12', 'Benny', '1234', 'benny@gmail.com', 'm', '1990-06-28', '23', 'Berkeley', 'CA', '94704', 'Filmmaking, capoeira, oil paintings, and theatre are the aspirations on the table. Also love sunlight, food, vegetation, and chocolate', '{/scaled_12-1.jpg,/scaled_12-2.jpg,/scaled_12-3.jpg}', '{/med_12-1.jpg,/med_12-2.jpg,/med_12-3.jpg}', '{/small_12-1.jpg,/small_12-2.jpg,/small_12-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('13', 'Peter', '1234', 'peter@gmail.com', 'm', '1991-11-08', '22', 'Oakland', 'CA', '94607', 'The activities I most like to do are acting in my free times , spending time with my dog, and watching movies.', '{/scaled_13-1.jpg,/scaled_13-2.jpg,/scaled_13-3.jpg}', '{/med_13-1.jpg,/med_13-2.jpg,/med_13-3.jpg}', '{/small_13-1.jpg,/small_13-2.jpg,/small_13-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('14', 'Shane', '1234', 'shane@gmail.com', 'm', '1984-04-23', '30', 'Daily City', 'CA', '94015', 'I''m little bit all over the place i draw paint sing play guitar and do graphic design i love my two dogs tomatoe and ninja!', '{/scaled_14-1.jpg,/scaled_14-2.jpg,/scaled_14-3.jpg}', '{/med_14-1.jpg,/med_14-2.jpg,/med_14-3.jpg}', '{/small_14-1.jpg,/small_14-2.jpg,/small_14-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('15', 'Luke', '1234', 'luke@gmail.com', 'm', '1990-12-23', '23', 'Richmond', 'CA', '94084', 'Sports, Technology, Beer, Books, Fishing, Going out and having fun!', '{/scaled_15-1.jpg,/scaled_15-2.jpg,/scaled_15-3.jpg}', '{/med_15-1.jpg,/med_15-2.jpg,/med_15-3.jpg}', '{/small_15-1.jpg,/small_15-2.jpg,/small_15-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('16', 'Jackson', '1234', 'jackson@gmail.com', 'm', '1990-05-29', '23', 'Richmond', 'CA', '94084', 'Battling monsters, demons, and lethargy. Creating stuff from nowhere. Leaving footprints and taking pictures of the footprint', '{/scaled_16-1.jpg,/scaled_16-2.jpg,/scaled_16-3.jpg}', '{/med_16-1.jpg,/med_16-2.jpg,/med_16-3.jpg}', '{/small_16-1.jpg,/small_16-2.jpg,/small_16-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('17', 'Zane', '1234', 'zane@gmail.com', 'm', '1986-06-27', '27', 'Oakland', 'CA', '94607', 'I love to have fun, work out and play baseball. I''m quite the jokester- I''m sure I can make you laugh. ', '{/scaled_17-1.jpg,/scaled_17-2.jpg,/scaled_17-3.jpg}', '{/med_17-1.jpg,/med_17-2.jpg,/med_17-3.jpg}', '{/small_17-1.jpg,/small_17-2.jpg,/small_17-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('18', 'Brock', '1234', 'brock@gmail.com', 'm', '1988-08-06', '25', 'Oakland', 'CA', '94607', 'Writing, acting, kareoke(sometimes), making pizza, drinking(not too proud of that one) and negotiating', '{/scaled_18-1.jpg,/scaled_18-2.jpg,/scaled_18-3.jpg}', '{/med_18-1.jpg,/med_18-2.jpg,/med_18-3.jpg}', '{/small_18-1.jpg,/small_18-2.jpg,/small_18-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('19', 'Ryan', '1234', 'ryan@gmail.com', 'm', '1985-09-24', '28', 'Belmont', 'CA', '94002', 'Making moves, tshirt design, writing music and poetry, drawing, photography, living life how I define it', '{/scaled_19-1.jpg,/scaled_19-2.jpg,/scaled_19-3.jpg}', '{/med_19-1.jpg,/med_19-2.jpg,/med_19-3.jpg}', '{/small_19-1.jpg,/small_19-2.jpg,/small_19-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('20', 'Sebastian', '1234', 'sebastian@gmail.com', 'm', '1991-03-01', '23', 'Richmond', 'CA', '94084', 'Technology - Crafting - Video Games - Using Common Sense - Rubiks Cube - Managing - Writing - Guitar - Fixing burned out light bulbs', '{/scaled_20-1.jpg,/scaled_20-2.jpg,/scaled_20-3.jpg}', '{/med_20-1.jpg,/med_20-2.jpg,/med_20-3.jpg}', '{/small_20-1.jpg,/small_20-2.jpg,/small_20-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('21', 'David', '1234', 'david@gmail.com', 'm', '1984-04-05', '30', 'San Mateo', 'CA', '94404', 'Sports, jeopardy, chess, poker, family, friends, music, books', '{/scaled_21-1.jpg,/scaled_21-2.jpg,/scaled_21-3.jpg}', '{/med_21-1.jpg,/med_21-2.jpg,/med_21-3.jpg}', '{/small_21-1.jpg,/small_21-2.jpg,/small_21-3.jpg}');
INSERT INTO "sidebar"."users" VALUES ('22', 'Andrew', '1234', 'andrew@gmail.com', 'm', '1985-12-15', '28', 'Berkeley', 'CA', '94704', 'I''ve never been beaten at MarioKart 64. Ever. I''m the best on Earth. It''s a curse', '{/scaled_22-1.jpg,/scaled_22-2.jpg,/scaled_22-3.jpg}', '{/med_22-1.jpg,/med_22-2.jpg,/med_22-3.jpg}', '{/small_22-1.jpg,/small_22-2.jpg,/small_22-3.jpg}');
COMMIT;

-- ----------------------------
--  Table structure for dancecard
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."dancecard";
CREATE TABLE "sidebar"."dancecard" (
    "userid" int4 NOT NULL,
    "partnerid" int4 NOT NULL,
    "status" varchar(10) COLLATE "default",
    "mutual" bool DEFAULT false,
    "updatetime" timestamp(6) NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."dancecard" OWNER TO "sidebar";

-- ----------------------------
--  Records of dancecard
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."dancecard" VALUES ('1', '10', 'added', 'f', '2014-05-05 19:44:14');
INSERT INTO "sidebar"."dancecard" VALUES ('1', '11', 'added', 'f', '2014-05-05 19:44:16');
INSERT INTO "sidebar"."dancecard" VALUES ('1', '13', 'added', 'f', '2014-05-05 19:48:43');
INSERT INTO "sidebar"."dancecard" VALUES ('1', '15', 'added', 'f', '2014-05-05 19:48:47');
INSERT INTO "sidebar"."dancecard" VALUES ('23', '11', 'added', 't', '2014-05-05 17:54:10');
INSERT INTO "sidebar"."dancecard" VALUES ('23', '2', 'added', 'f', '2014-05-05 17:58:51');
INSERT INTO "sidebar"."dancecard" VALUES ('23', '20', 'removed', 'f', '2014-05-05 22:38:10');
COMMIT;

-- ----------------------------
--  Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."messages";
CREATE TABLE "sidebar"."messages" (
    "senderid" int4 NOT NULL,
    "receiverid" int4 NOT NULL,
    "message" text NOT NULL COLLATE "default",
    "sendtime" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."messages" OWNER TO "sidebar";

-- ----------------------------
--  Records of messages
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."messages" VALUES ('23', '11', 'I see you''re on github?', '2014-05-05 16:39:59');
INSERT INTO "sidebar"."messages" VALUES ('11', '23', 'Hi there cutie!', '2014-05-05 16:40:17');
COMMIT;

-- ----------------------------
--  Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."notifications";
CREATE TABLE "sidebar"."notifications" (
    "notificationid" serial primary key,
    "userid" int4,
    "about_userid" int4,
    "message" varchar(140) NOT NULL COLLATE "default",
    "action_time" timestamp(6) NULL,
    "type" varchar(10) COLLATE "default",
    "subtype" varchar(10) COLLATE "default",
    "status" varchar(10) DEFAULT 'unread'::character varying COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."notifications" OWNER TO "sidebar";

-- ----------------------------
--  Table structure for urls
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."urls";
CREATE TABLE "sidebar"."urls" (
    "urlid" SERIAL PRIMARY KEY,
    "url" varchar(300) COLLATE "default",
    "page_title" varchar(140) COLLATE "default",
    "primary_img_url" varchar(140) COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."urls" OWNER TO "sidebar";

-- ----------------------------
--  Records of urls
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."urls" VALUES ('8', 'http://www.webmd.com/women/guide/essential-vitamins-for-women-at-every-age', 'Essential Vitamins for Women at Every Age', null);
INSERT INTO "sidebar"."urls" VALUES ('13', 'https://wwws.mint.com/login.event', 'Mint.com', null);
INSERT INTO "sidebar"."urls" VALUES ('14', 'https://chaseonline.chase.com/', 'Chase Online - Logon', null);
INSERT INTO "sidebar"."urls" VALUES ('16', 'http://www.adamwaaramaa.com/fundraising/writing-your-pitch-deck/', 'How To Write A Killer Pitch Deck In 10 Slides | Adam Waaramaa On Entrepreneurship', null);
INSERT INTO "sidebar"."urls" VALUES ('18', 'http://www.thewhir.com/web-hosting-news/hackers-find-cloud-account-credentials-github-leading-72-hour-cryptocurrency-mining-spree', 'Hackers Find Cloud Account Credentials on GitHub Leading to 72-Hour Cryptocurrency Mining Spree - Web Host Industry Review', null);
INSERT INTO "sidebar"."urls" VALUES ('20', 'http://www.netflix.com/WiPlayer?movieid=70267239&trkid=13462260&tctx=0%2C0%2C4c7eecbf-d697-4cef-a100-83ed8e72f3e8-693061', 'Netflix', null);
INSERT INTO "sidebar"."urls" VALUES ('25', 'https://www.netflix.com/?locale=en-US', 'Netflix - Watch TV Shows Online, Watch Movies Online', null);
INSERT INTO "sidebar"."urls" VALUES ('27', 'http://assorted-experience.blogspot.com/2014/05/doctesting-python-command-line-scripts.html', 'Assorted Experience: Doctesting Python command line scripts', null);
INSERT INTO "sidebar"."urls" VALUES ('36', 'https://news.ycombinator.com/newest', 'New Links | Hacker News', null);
INSERT INTO "sidebar"."urls" VALUES ('43', 'https://www.comixology.com/top-rated', 'Top Rated Comics - Comics by comiXology', null);
INSERT INTO "sidebar"."urls" VALUES ('1', 'http://techcrunch.com/2014/05/05/facebook-acqusition-helped-oculus/', 'Oculus CEO Says Selling To Facebook Convinced Big Developers To Build For It | TechCrunch', 'http://tctechcrunch2011.files.wordpress.com/2014/05/brendan-iribe-oculus12.jpg');
INSERT INTO "sidebar"."urls" VALUES ('3', 'https://vine.co/lists/20-explosive-moments-when-the-beat-drops', 'https://vine.co/lists/20-explosive-moments-when-the-beat-drops', 'https://vine.co/assets/images/meta/vine_screencap.png');
INSERT INTO "sidebar"."urls" VALUES ('5', 'http://mashable.com/2014/05/05/doge-vine/', 'Much Doge on Vine. So Wow.', 'http://rack.1.mshcdn.com/media/ZgkyMDE0LzA1LzA1L2ExL0RvZ2VWaW5lLjdkNGY5LmpwZwpwCXRodW1iCTk1MHg1MzQjCmUJanBn/43950e8a/c33/Doge-Vine.jpg');
INSERT INTO "sidebar"."urls" VALUES ('2', 'http://techcrunch.com/', 'TechCrunch - The latest technology news and information on startups', 'http://s1.wp.com/wp-content/themes/vip/techcrunch-2013/assets/images/logo-large.png?m=1391183173g');
INSERT INTO "sidebar"."urls" VALUES ('4', 'https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable', 'https://vine.co/lists/12-bizzare-moments-that-are-totally-unrelatable', 'https://vine.co/assets/images/meta/vine_screencap.png');
INSERT INTO "sidebar"."urls" VALUES ('6', 'http://mashable.com/2014/05/05/automattic-funding/', 'WordPress.com Creator Automattic Raises $160 Million', 'http://rack.2.mshcdn.com/media/ZgkyMDE0LzA1LzA1LzcwL211bGxlbndlZzEuYmEwM2QuanBnCnAJdGh1bWIJOTUweDUzNCMKZQlqcGc/b8478ee1/b93/mullenweg1.jpg');
INSERT INTO "sidebar"."urls" VALUES ('9', 'https://www.etsy.com/', 'Etsy - Your place to buy and sell all things handmade, vintage, and supplies', 'http://www.etsy.com/images/logo_no_border.gif');
INSERT INTO "sidebar"."urls" VALUES ('7', 'http://www.pinterest.com/pin/182395853631827993/', 'Pin by Evelyn Poeppelmeier on Style and Beauty: Dresses (Gowns and Re…', 'http://media-cache-ec0.pinimg.com/736x/66/75/a7/6675a752e2d18c4398ad722f3dd21324.jpg');
INSERT INTO "sidebar"."urls" VALUES ('11', 'http://americanfood.about.com/od/classicchowdersandstews/r/beefstew.htm', 'Old Fashioned Beef Stew Recipe - How to Make Old Fashioned Beef Stew', 'http://0.tqn.com/d/americanfood/1/0/v/-/-/-/beefstew.jpg');
INSERT INTO "sidebar"."urls" VALUES ('12', 'https://github.com/', 'GitHub', 'https://github.global.ssl.fastly.net/images/modules/open_graph/github-logo.png');
INSERT INTO "sidebar"."urls" VALUES ('15', 'http://www.iftf.org/what-we-do/who-we-are/staff/marina-gorbis/', 'IFTF: Marina Gorbis', 'http://www.iftf.org/uploads/RTEmagicC_picture-43.gif.gif');
INSERT INTO "sidebar"."urls" VALUES ('17', 'http://www.infoworld.com/d/security/github-bans-weak-passwords-after-brute-force-attack-results-in-compromised-accounts-231273', 'GitHub bans weak passwords after brute-force attack results in compromised accounts | Security - InfoWorld', 'http://computerworld.com.edgesuite.net/ifw/IFW.png');
INSERT INTO "sidebar"."urls" VALUES ('19', 'http://hbr.org/2014/01/how-netflix-reinvented-hr/ar/1', 'How Netflix Reinvented HR - Harvard Business Review', 'http://static.hbr.org/hbrg-main/resources/images/hbr_opengraph_360x185.png');
INSERT INTO "sidebar"."urls" VALUES ('23', 'https://www.youtube.com/watch?v=wo8aSo5Tv1E', 'Air - Moon Safari [Full Album] - YouTube', 'https://i1.ytimg.com/vi/wo8aSo5Tv1E/maxresdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('10', 'http://www.ultimate-guitar.com/', 'ULTIMATE GUITAR TABS. 800,000 songs catalog with free Chords, Guitar Tabs, Bass Tabs, Ukulele Chords and Guitar Pro Tabs!', 'http://www.ultimate-guitar.com/tv/images/16168_r182858_thumbnail_small.jpg');
INSERT INTO "sidebar"."urls" VALUES ('21', 'https://www.ischool.berkeley.edu/about', 'About | School of Information', 'http://www.ischool.berkeley.edu/files/imagecache/og/i_square.jpg');
INSERT INTO "sidebar"."urls" VALUES ('26', 'http://www.nbcnews.com/storyline/missing-jet/boeing-rolls-royce-face-bill-over-hunt-flight-mh370-n97011', 'Boeing, Rolls-Royce to Face Bill Over Hunt for Flight MH370 - NBC News.com', 'http://media3.s-nbcnews.com/i/newscms/2014_18/418316/tdy_jet-comp_140503_df28c0aa38fb70472c7b9a055ada9805.jpg');
INSERT INTO "sidebar"."urls" VALUES ('28', 'https://medium.com/editors-picks/ad3d3c5e3c65', 'Forget 140 characters: Here’s How to Go to Jail for 10 Months for One ‘k’ — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*lWDlFbAzgqwW_RCf9FGaiQ.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('24', 'http://www.slate.com/articles/podcasts/culturegabfest.html', 'Culture Gabfest', 'http://www.slate.com/etc/designs/slate/images/slate_facebook_icon.png');
INSERT INTO "sidebar"."urls" VALUES ('22', 'http://www.nytimes.com/', 'The New York Times - Breaking News, World News & Multimedia', 'http://i1.nyt.com/images/2014/05/06/health/POLIO/POLIO-largeHorizontal375.jpg');
INSERT INTO "sidebar"."urls" VALUES ('32', 'https://play.spotify.com/artist/1yAwtBaoHLEDWAnWR87hBT', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('33', 'https://play.spotify.com/browse', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('34', 'https://play.spotify.com/album/2okCg9scHue9GNELoB8U9g', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('35', 'https://play.spotify.com/radio/artist/3TVXtAsR1Inumwj472S9r4', 'Spotify Web Player', 'https://play.spotify.edgekey.net/site/00898f3/images/download.png');
INSERT INTO "sidebar"."urls" VALUES ('37', 'https://www.youtube.com/watch?v=IgKWPdJWuBQ', 'Elon Musk: The mind behind Tesla, SpaceX, SolarCity ... - YouTube', 'https://i1.ytimg.com/vi/IgKWPdJWuBQ/maxresdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('38', 'https://www.youtube.com/watch?v=6ycn5VmBUYY', '100 Days of Dance - YouTube', 'https://i1.ytimg.com/vi/6ycn5VmBUYY/maxresdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('40', 'http://www.imdb.com/chart/top', 'IMDb Top 250 - IMDb', 'http://ia.media-imdb.com/images/G/01/imdb/images/logos/imdb_fb_logo-1730868325._V379391653_.png');
INSERT INTO "sidebar"."urls" VALUES ('42', 'http://www.nytimes.com/pages/opinion/index.html', 'Editorials, Columns, Op-Ed, Letters, Opinionator and More Opinion - The New York Times', 'http://graphics8.nytimes.com/images/2014/05/05/opinion/0503OPEDisland/0503OPEDisland-sfSpan-v2.jpg');
INSERT INTO "sidebar"."urls" VALUES ('39', 'https://www.youtube.com/watch?v=zRlpIkH3b5I', 'Photoshopping Real Women Into Cover Models - YouTube', 'https://i1.ytimg.com/vi/zRlpIkH3b5I/hqdefault.jpg');
INSERT INTO "sidebar"."urls" VALUES ('29', 'https://medium.com/editors-picks/a26385113bf0', 'Cold War Coloring Book Taught A-10 Pilots to Kill Soviet Tanks — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/blue/overlay/blue/1*t6gtNb-DAEXHHo1NZ3IPCQ.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('30', 'https://medium.com/editors-picks/1bd6f5e75763', 'What Everyone Could Be Missing About the Kurt Cobain ‘Bitch With Zits’ Letter  — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/yellow/overlay/yellow/1*0n_-k5-MxIu3uXBcTVg1Xg.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('31', 'https://medium.com/editors-picks/646320568f9d', 'When a Kidnapped Journalist Is a Freelancer — Editor’s Picks — Medium', 'https://d262ilb51hltx0.cloudfront.net/max/800/desat/multiply/red/overlay/red/1*ltkYYkHx6CHF5TzMqTO4hw.jpeg');
INSERT INTO "sidebar"."urls" VALUES ('41', 'http://www.nytimes.com/roomfordebate/2014/05/04/how-should-electronic-cigarretes-be-regulated', 'How Should Electronic Cigarretes Be Regulated? - Room for Debate - NYTimes.com', 'http://graphics8.nytimes.com/images/2014/04/29/opinion/rfdvaping/rfdvaping-thumbWide.jpg');
INSERT INTO "sidebar"."urls" VALUES ('44', 'http://www.pinterest.com/all/humor/', 'Humor on Pinterest - funny pictures, quotes and memes', 'http://media-cache-ak0.pinimg.com/236x/62/e5/83/62e5835df7b7c13edbdc1aeead3a3273.jpg');
INSERT INTO "sidebar"."urls" VALUES ('45', 'https://www.google.com/', 'Google Home Page', null);
COMMIT;

-- ----------------------------
--  Table structure for url_categories
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."url_categories";
CREATE TABLE "sidebar"."url_categories" (
    "urlid" int4 NOT NULL,
    "level1" varchar(40) NOT NULL COLLATE "default",
    "level2" varchar(40) NOT NULL COLLATE "default",
    "level3" varchar(40) NOT NULL COLLATE "default",
    "level4" varchar(40) COLLATE "default",
    "level5" varchar(40) COLLATE "default",
    "score" numeric(6,6)
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."url_categories" OWNER TO "sidebar";

-- ----------------------------
--  Records of url_categories
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."url_categories" VALUES ('3', 'travel', 'specialty travel', 'vineyards', '', '', '0.771858');
INSERT INTO "sidebar"."url_categories" VALUES ('3', 'food and drink', 'beverages', 'alcoholic beverages', 'wine', '', '0.633116');
INSERT INTO "sidebar"."url_categories" VALUES ('3', 'business and industrial', 'agriculture and forestry', 'crops and seed', '', '', '0.054800');
INSERT INTO "sidebar"."url_categories" VALUES ('1', 'technology and computing', 'internet technology', 'social network', '', '', '0.488826');
INSERT INTO "sidebar"."url_categories" VALUES ('1', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.288975');
INSERT INTO "sidebar"."url_categories" VALUES ('1', 'business and industrial', '', '', '', '', '0.247608');
INSERT INTO "sidebar"."url_categories" VALUES ('5', 'family and parenting', '', '', '', '', '0.437683');
INSERT INTO "sidebar"."url_categories" VALUES ('5', 'pets', 'cats', '', '', '', '0.281174');
INSERT INTO "sidebar"."url_categories" VALUES ('5', 'education', 'homework and study tips', '', '', '', '0.246091');
INSERT INTO "sidebar"."url_categories" VALUES ('4', 'travel', 'specialty travel', 'vineyards', '', '', '0.771858');
INSERT INTO "sidebar"."url_categories" VALUES ('4', 'food and drink', 'beverages', 'alcoholic beverages', 'wine', '', '0.633116');
INSERT INTO "sidebar"."url_categories" VALUES ('4', 'business and industrial', 'agriculture and forestry', 'crops and seed', '', '', '0.054800');
INSERT INTO "sidebar"."url_categories" VALUES ('6', 'family and parenting', '', '', '', '', '0.394961');
INSERT INTO "sidebar"."url_categories" VALUES ('6', 'art and entertainment', 'visual art and design', 'design', '', '', '0.285270');
INSERT INTO "sidebar"."url_categories" VALUES ('6', 'business and industrial', 'company', 'merger and acquisition', '', '', '0.218782');
INSERT INTO "sidebar"."url_categories" VALUES ('2', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.366779');
INSERT INTO "sidebar"."url_categories" VALUES ('2', 'hobbies and interests', 'guitar', '', '', '', '0.301621');
INSERT INTO "sidebar"."url_categories" VALUES ('2', 'business and industrial', '', '', '', '', '0.281700');
INSERT INTO "sidebar"."url_categories" VALUES ('9', 'technology and computing', 'internet technology', 'email', '', '', '0.634357');
INSERT INTO "sidebar"."url_categories" VALUES ('9', 'shopping', 'gifts', '', '', '', '0.413833');
INSERT INTO "sidebar"."url_categories" VALUES ('9', 'hobbies and interests', 'arts and crafts', 'crochet', '', '', '0.409018');
INSERT INTO "sidebar"."url_categories" VALUES ('15', 'family and parenting', 'children', '', '', '', '0.426110');
INSERT INTO "sidebar"."url_categories" VALUES ('15', 'society', '', '', '', '', '0.333390');
INSERT INTO "sidebar"."url_categories" VALUES ('15', 'business and industrial', '', '', '', '', '0.235372');
INSERT INTO "sidebar"."url_categories" VALUES ('7', 'finance', 'bank', 'atms', '', '', '0.544048');
INSERT INTO "sidebar"."url_categories" VALUES ('7', 'family and parenting', '', '', '', '', '0.391303');
INSERT INTO "sidebar"."url_categories" VALUES ('7', 'style and fashion', 'jewelry', 'bracelets', '', '', '0.373276');
INSERT INTO "sidebar"."url_categories" VALUES ('11', 'home and garden', 'appliances', 'small appliances', 'food processors', '', '0.500086');
INSERT INTO "sidebar"."url_categories" VALUES ('11', 'business and industrial', 'energy', 'oil', '', '', '0.489626');
INSERT INTO "sidebar"."url_categories" VALUES ('11', 'food and drink', 'desserts and baking', '', '', '', '0.393319');
INSERT INTO "sidebar"."url_categories" VALUES ('17', 'technology and computing', 'programming languages', 'java', '', '', '0.522546');
INSERT INTO "sidebar"."url_categories" VALUES ('17', 'technology and computing', 'software', '', '', '', '0.460356');
INSERT INTO "sidebar"."url_categories" VALUES ('17', 'shopping', 'resources', 'product reviews', '', '', '0.352878');
INSERT INTO "sidebar"."url_categories" VALUES ('16', 'business and industrial', '', '', '', '', '0.361359');
INSERT INTO "sidebar"."url_categories" VALUES ('16', 'business and industrial', 'business operations', 'business plans', '', '', '0.256385');
INSERT INTO "sidebar"."url_categories" VALUES ('16', 'hobbies and interests', 'reading', '', '', '', '0.184031');
INSERT INTO "sidebar"."url_categories" VALUES ('14', 'technology and computing', 'internet technology', 'email', '', '', '0.554103');
INSERT INTO "sidebar"."url_categories" VALUES ('14', 'society', 'crime', 'property crime', 'piracy', '', '0.449075');
INSERT INTO "sidebar"."url_categories" VALUES ('14', 'technology and computing', 'consumer electronics', 'game systems and consoles', 'xbox', '', '0.365870');
INSERT INTO "sidebar"."url_categories" VALUES ('20', 'technology and computing', 'internet technology', 'email', '', '', '0.663538');
INSERT INTO "sidebar"."url_categories" VALUES ('20', 'technology and computing', 'internet technology', 'social network', '', '', '0.426642');
INSERT INTO "sidebar"."url_categories" VALUES ('20', 'news', 'local news', '', '', '', '0.347285');
INSERT INTO "sidebar"."url_categories" VALUES ('19', 'business and industrial', '', '', '', '', '0.384719');
INSERT INTO "sidebar"."url_categories" VALUES ('19', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.275626');
INSERT INTO "sidebar"."url_categories" VALUES ('19', 'education', '', '', '', '', '0.247802');
INSERT INTO "sidebar"."url_categories" VALUES ('10', 'technology and computing', 'programming languages', 'javascript', '', '', '0.771187');
INSERT INTO "sidebar"."url_categories" VALUES ('10', 'technology and computing', 'software', 'databases', '', '', '0.165709');
INSERT INTO "sidebar"."url_categories" VALUES ('10', 'technology and computing', 'internet technology', 'email', '', '', '0.143043');
INSERT INTO "sidebar"."url_categories" VALUES ('12', 'technology and computing', 'software', '', '', '', '0.331832');
INSERT INTO "sidebar"."url_categories" VALUES ('12', 'business and industrial', '', '', '', '', '0.157346');
INSERT INTO "sidebar"."url_categories" VALUES ('12', 'business and industrial', 'business operations', 'management', 'project management', '', '0.150008');
INSERT INTO "sidebar"."url_categories" VALUES ('21', 'education', 'school', '', '', '', '0.469108');
INSERT INTO "sidebar"."url_categories" VALUES ('21', 'science', 'computer science', 'information science', '', '', '0.187253');
INSERT INTO "sidebar"."url_categories" VALUES ('21', 'careers', '', '', '', '', '0.159794');
INSERT INTO "sidebar"."url_categories" VALUES ('18', 'society', 'crime', 'property crime', 'larceny', '', '0.422567');
INSERT INTO "sidebar"."url_categories" VALUES ('18', 'sports', 'running and jogging', '', '', '', '0.307609');
INSERT INTO "sidebar"."url_categories" VALUES ('18', 'technology and computing', '', '', '', '', '0.246521');
INSERT INTO "sidebar"."url_categories" VALUES ('27', 'technology and computing', 'programming languages', 'c and c++', '', '', '0.320373');
INSERT INTO "sidebar"."url_categories" VALUES ('27', 'technology and computing', 'mp3 and midi', '', '', '', '0.239909');
INSERT INTO "sidebar"."url_categories" VALUES ('27', 'technology and computing', 'hardware', 'computer', '', '', '0.207707');
INSERT INTO "sidebar"."url_categories" VALUES ('25', 'business and industrial', 'advertising and marketing', 'advertising', '', '', '0.254679');
INSERT INTO "sidebar"."url_categories" VALUES ('25', 'technology and computing', '', '', '', '', '0.156716');
INSERT INTO "sidebar"."url_categories" VALUES ('25', 'technology and computing', 'internet technology', 'web search', '', '', '0.128620');
INSERT INTO "sidebar"."url_categories" VALUES ('29', 'law, govt and politics', 'armed forces', 'air force', '', '', '0.439661');
INSERT INTO "sidebar"."url_categories" VALUES ('29', 'law, govt and politics', 'armed forces', 'army', '', '', '0.262220');
INSERT INTO "sidebar"."url_categories" VALUES ('29', 'art and entertainment', 'visual art and design', 'drawing', '', '', '0.216497');
INSERT INTO "sidebar"."url_categories" VALUES ('28', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.532373');
INSERT INTO "sidebar"."url_categories" VALUES ('28', 'style and fashion', 'accessories', 'hats', '', '', '0.500143');
INSERT INTO "sidebar"."url_categories" VALUES ('28', 'technology and computing', 'internet technology', 'email', '', '', '0.443534');
INSERT INTO "sidebar"."url_categories" VALUES ('24', 'family and parenting', '', '', '', '', '0.318184');
INSERT INTO "sidebar"."url_categories" VALUES ('24', 'education', 'school', '', '', '', '0.313217');
INSERT INTO "sidebar"."url_categories" VALUES ('24', 'news', '', '', '', '', '0.286366');
INSERT INTO "sidebar"."url_categories" VALUES ('22', 'automotive and vehicles', 'cars', '', '', '', '0.701591');
INSERT INTO "sidebar"."url_categories" VALUES ('22', 'shopping', 'resources', 'product reviews', '', '', '0.474771');
INSERT INTO "sidebar"."url_categories" VALUES ('22', 'technology and computing', 'internet technology', 'web search', '', '', '0.472867');
INSERT INTO "sidebar"."url_categories" VALUES ('23', 'art and entertainment', 'music', '', '', '', '0.137966');
INSERT INTO "sidebar"."url_categories" VALUES ('23', 'travel', 'tourist destinations', 'france', '', '', '0.095961');
INSERT INTO "sidebar"."url_categories" VALUES ('23', 'technology and computing', 'internet technology', 'email', '', '', '0.093337');
INSERT INTO "sidebar"."url_categories" VALUES ('32', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('32', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('32', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('33', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('33', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('33', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('34', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('34', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('34', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('37', 'business and industrial', 'business operations', 'business plans', '', '', '0.599520');
INSERT INTO "sidebar"."url_categories" VALUES ('37', 'automotive and vehicles', 'electric vehicles', '', '', '', '0.224540');
INSERT INTO "sidebar"."url_categories" VALUES ('37', 'technology and computing', '', '', '', '', '0.192090');
INSERT INTO "sidebar"."url_categories" VALUES ('30', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.433114');
INSERT INTO "sidebar"."url_categories" VALUES ('30', 'technology and computing', 'internet technology', 'email', '', '', '0.298543');
INSERT INTO "sidebar"."url_categories" VALUES ('30', 'hobbies and interests', 'guitar', '', '', '', '0.236217');
INSERT INTO "sidebar"."url_categories" VALUES ('35', 'technology and computing', 'networking', 'vpn and remote access', '', '', '0.362235');
INSERT INTO "sidebar"."url_categories" VALUES ('35', 'society', 'crime', 'property crime', 'piracy', '', '0.356055');
INSERT INTO "sidebar"."url_categories" VALUES ('35', 'technology and computing', 'programming languages', 'javascript', '', '', '0.328269');
INSERT INTO "sidebar"."url_categories" VALUES ('36', 'news', '', '', '', '', '0.389049');
INSERT INTO "sidebar"."url_categories" VALUES ('36', 'travel', '', '', '', '', '0.321863');
INSERT INTO "sidebar"."url_categories" VALUES ('36', 'technology and computing', 'software', '', '', '', '0.303563');
INSERT INTO "sidebar"."url_categories" VALUES ('38', 'technology and computing', 'consumer electronics', 'camera and photo equipment', 'cameras and camcorders', 'cameras', '0.679511');
INSERT INTO "sidebar"."url_categories" VALUES ('38', 'careers', 'nursing', '', '', '', '0.248631');
INSERT INTO "sidebar"."url_categories" VALUES ('38', 'law, govt and politics', 'politics', 'elections', '', '', '0.134952');
INSERT INTO "sidebar"."url_categories" VALUES ('41', 'law, govt and politics', 'legal issues', 'legislation', '', '', '0.446285');
INSERT INTO "sidebar"."url_categories" VALUES ('41', 'health and fitness', 'addiction', 'smoking addiction', '', '', '0.256792');
INSERT INTO "sidebar"."url_categories" VALUES ('41', 'food and drink', '', '', '', '', '0.155291');
INSERT INTO "sidebar"."url_categories" VALUES ('42', 'hobbies and interests', 'getting published', 'freelance writing', '', '', '0.577079');
INSERT INTO "sidebar"."url_categories" VALUES ('42', 'science', 'biology', 'cytology', '', '', '0.576974');
INSERT INTO "sidebar"."url_categories" VALUES ('42', 'society', 'crime', '', '', '', '0.535476');
INSERT INTO "sidebar"."url_categories" VALUES ('39', 'technology and computing', 'internet technology', 'social network', '', '', '0.560452');
INSERT INTO "sidebar"."url_categories" VALUES ('39', 'health and fitness', 'disease', 'allergies', '', '', '0.401354');
INSERT INTO "sidebar"."url_categories" VALUES ('39', 'society', 'dating', '', '', '', '0.374853');
INSERT INTO "sidebar"."url_categories" VALUES ('44', 'health and fitness', 'disorders', 'mental disorder', 'panic and anxiety', '', '0.590479');
INSERT INTO "sidebar"."url_categories" VALUES ('44', 'food and drink', '', '', '', '', '0.537762');
INSERT INTO "sidebar"."url_categories" VALUES ('44', 'religion and spirituality', '', '', '', '', '0.385138');
INSERT INTO "sidebar"."url_categories" VALUES ('31', 'society', 'unrest and war', '', '', '', '0.300496');
INSERT INTO "sidebar"."url_categories" VALUES ('31', 'family and parenting', '', '', '', '', '0.260903');
INSERT INTO "sidebar"."url_categories" VALUES ('31', 'business and industrial', '', '', '', '', '0.217887');
INSERT INTO "sidebar"."url_categories" VALUES ('43', 'art and entertainment', 'comics and animation', 'comics', '', '', '0.624668');
INSERT INTO "sidebar"."url_categories" VALUES ('43', 'hobbies and interests', 'games', 'role playing games', '', '', '0.565756');
INSERT INTO "sidebar"."url_categories" VALUES ('43', 'technology and computing', 'software', 'shareware and freeware', '', '', '0.399031');
INSERT INTO "sidebar"."url_categories" VALUES ('40', 'society', 'work', 'unemployment', '', '', '0.527083');
INSERT INTO "sidebar"."url_categories" VALUES ('40', 'art and entertainment', 'movies and tv', 'movies', '', '', '0.454305');
INSERT INTO "sidebar"."url_categories" VALUES ('40', 'technology and computing', 'operating systems', 'mac os', '', '', '0.243126');
INSERT INTO "sidebar"."url_categories" VALUES ('45', 'news', 'dating', 'blank', 'blank', 'blank', '0.100000');
COMMIT;



-- ----------------------------
--  Table structure for user_history
-- ----------------------------
DROP TABLE IF EXISTS "sidebar"."user_history";
CREATE TABLE "sidebar"."user_history" (
    "userid" int4 NOT NULL,
    "urlid" int4 NOT NULL,
    "visit_count" int4,
    "last_visit" timestamp(6) NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sidebar"."user_history" OWNER TO "sidebar";

-- ----------------------------
--  Records of user_history
-- ----------------------------
BEGIN;
INSERT INTO "sidebar"."user_history" VALUES ('2', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('3', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('4', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('2', '22', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('10', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('12', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('13', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('14', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('15', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('16', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('17', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('18', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('19', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('20', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '12', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '22', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '45', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '29', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '30', '1', null);
INSERT INTO "sidebar"."user_history" VALUES ('23', '43', '4', null);
INSERT INTO "sidebar"."user_history" VALUES ('10', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('11', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('13', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('12', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('14', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('15', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('16', '2', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('17', '42', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('18', '3', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('19', '4', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('20', '5', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('21', '6', '3', null);
INSERT INTO "sidebar"."user_history" VALUES ('22', '7', '3', null);
COMMIT;


-- ----------------------------
--  Primary key structure for table dancecard
-- ----------------------------
ALTER TABLE "sidebar"."dancecard" ADD PRIMARY KEY ("userid", "partnerid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table dancecard
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17333" AFTER UPDATE ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17333" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17332" AFTER INSERT ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17332" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17174" AFTER UPDATE ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17174" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17173" AFTER INSERT ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17173" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17169" AFTER UPDATE ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17169" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17168" AFTER INSERT ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17168" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17328" AFTER UPDATE ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17328" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17327" AFTER INSERT ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17327" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17323" AFTER UPDATE ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17323" ON "sidebar"."dancecard" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17322" AFTER INSERT ON "sidebar"."dancecard" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17322" ON "sidebar"."dancecard" IS NULL;

-- ----------------------------
--  Primary key structure for table messages
-- ----------------------------
ALTER TABLE "sidebar"."messages" ADD PRIMARY KEY ("senderid", "receiverid", "sendtime") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table messages
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17192" AFTER UPDATE ON "sidebar"."messages" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17192" ON "sidebar"."messages" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17191" AFTER INSERT ON "sidebar"."messages" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17191" ON "sidebar"."messages" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17187" AFTER UPDATE ON "sidebar"."messages" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17187" ON "sidebar"."messages" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17186" AFTER INSERT ON "sidebar"."messages" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17186" ON "sidebar"."messages" IS NULL;

-- ----------------------------
--  Primary key structure for table notifications
-- ----------------------------
ALTER TABLE "sidebar"."notifications" ADD PRIMARY KEY ("notificationid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table notifications
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17211" AFTER UPDATE ON "sidebar"."notifications" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17211" ON "sidebar"."notifications" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17210" AFTER INSERT ON "sidebar"."notifications" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17210" ON "sidebar"."notifications" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17206" AFTER UPDATE ON "sidebar"."notifications" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17206" ON "sidebar"."notifications" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17205" AFTER INSERT ON "sidebar"."notifications" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17205" ON "sidebar"."notifications" IS NULL;
CREATE TRIGGER "watched_table_trigger" AFTER INSERT ON "sidebar"."notifications" FOR EACH ROW EXECUTE PROCEDURE "notify_trigger"();
COMMENT ON TRIGGER "watched_table_trigger" ON "sidebar"."notifications" IS NULL;

-- ----------------------------
--  Primary key structure for table url_categories
-- ----------------------------
ALTER TABLE "sidebar"."url_categories" ADD PRIMARY KEY ("urlid", "level1", "level2", "level3") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table url_categories
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17298" AFTER UPDATE ON "sidebar"."url_categories" FROM "sidebar"."urls" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17298" ON "sidebar"."url_categories" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17297" AFTER INSERT ON "sidebar"."url_categories" FROM "sidebar"."urls" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17297" ON "sidebar"."url_categories" IS NULL;

-- ----------------------------
--  Primary key structure for table urls
-- ----------------------------
ALTER TABLE "sidebar"."urls" ADD PRIMARY KEY ("urlid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table urls
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17296" AFTER UPDATE ON "sidebar"."urls" FROM "sidebar"."url_categories" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17296" ON "sidebar"."urls" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17295" AFTER DELETE ON "sidebar"."urls" FROM "sidebar"."url_categories" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17295" ON "sidebar"."urls" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17311" AFTER UPDATE ON "sidebar"."urls" FROM "sidebar"."user_history" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17311" ON "sidebar"."urls" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17310" AFTER DELETE ON "sidebar"."urls" FROM "sidebar"."user_history" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17310" ON "sidebar"."urls" IS NULL;

-- ----------------------------
--  Primary key structure for table user_history
-- ----------------------------
ALTER TABLE "sidebar"."user_history" ADD PRIMARY KEY ("userid", "urlid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table user_history
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17313" AFTER UPDATE ON "sidebar"."user_history" FROM "sidebar"."urls" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17313" ON "sidebar"."user_history" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17312" AFTER INSERT ON "sidebar"."user_history" FROM "sidebar"."urls" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17312" ON "sidebar"."user_history" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17308" AFTER UPDATE ON "sidebar"."user_history" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17308" ON "sidebar"."user_history" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17307" AFTER INSERT ON "sidebar"."user_history" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17307" ON "sidebar"."user_history" IS NULL;

-- ----------------------------
--  Primary key structure for table userprefs
-- ----------------------------
ALTER TABLE "sidebar"."userprefs" ADD PRIMARY KEY ("userid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Checks structure for table userprefs
-- ----------------------------
ALTER TABLE "sidebar"."userprefs" ADD CONSTRAINT "userprefs_check" CHECK ((age_max > age_min)) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table userprefs
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17158" AFTER UPDATE ON "sidebar"."userprefs" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17158" ON "sidebar"."userprefs" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_c_17157" AFTER INSERT ON "sidebar"."userprefs" FROM "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_check_ins"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_c_17157" ON "sidebar"."userprefs" IS NULL;

-- ----------------------------
--  Primary key structure for table users
-- ----------------------------
ALTER TABLE "sidebar"."users" ADD PRIMARY KEY ("userid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Checks structure for table users
-- ----------------------------
ALTER TABLE "sidebar"."users" ADD CONSTRAINT "users_dateofbirth_check" CHECK ((dateofbirth < ('now'::text)::date)) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."users" ADD CONSTRAINT "users_age_check" CHECK (((age > 0) AND (age < 100))) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Triggers structure for table users
-- ----------------------------
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17306" AFTER UPDATE ON "sidebar"."users" FROM "sidebar"."user_history" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17306" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17305" AFTER DELETE ON "sidebar"."users" FROM "sidebar"."user_history" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17305" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17156" AFTER UPDATE ON "sidebar"."users" FROM "sidebar"."userprefs" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17156" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17155" AFTER DELETE ON "sidebar"."users" FROM "sidebar"."userprefs" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17155" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17209" AFTER UPDATE ON "sidebar"."users" FROM "sidebar"."notifications" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17209" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17208" AFTER DELETE ON "sidebar"."users" FROM "sidebar"."notifications" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17208" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17204" AFTER UPDATE ON "sidebar"."users" FROM "sidebar"."notifications" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17204" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17203" AFTER DELETE ON "sidebar"."users" FROM "sidebar"."notifications" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17203" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17190" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17190" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17189" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17189" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17185" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17185" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17184" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17184" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17331" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17331" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17330" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17330" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17172" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17172" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17171" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17171" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17167" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17167" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17166" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_cascade_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17166" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17326" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17326" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17325" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17325" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17321" AFTER UPDATE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_upd"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17321" ON "sidebar"."users" IS NULL;
CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_17320" AFTER DELETE ON "sidebar"."users" NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE "RI_FKey_noaction_del"();
COMMENT ON TRIGGER "RI_ConstraintTrigger_a_17320" ON "sidebar"."users" IS NULL;

-- ----------------------------
--  Foreign keys structure for table dancecard
-- ----------------------------
ALTER TABLE "sidebar"."dancecard" ADD CONSTRAINT "dancecard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."dancecard" ADD CONSTRAINT "dancecard_partnerid_fkey" FOREIGN KEY ("partnerid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table messages
-- ----------------------------
ALTER TABLE "sidebar"."messages" ADD CONSTRAINT "messages_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."messages" ADD CONSTRAINT "messages_receiverid_fkey" FOREIGN KEY ("receiverid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table notifications
-- ----------------------------
ALTER TABLE "sidebar"."notifications" ADD CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."notifications" ADD CONSTRAINT "notifications_about_userid_fkey" FOREIGN KEY ("about_userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table url_categories
-- ----------------------------
ALTER TABLE "sidebar"."url_categories" ADD CONSTRAINT "url_categories_urlid_fkey" FOREIGN KEY ("urlid") REFERENCES "sidebar"."urls" ("urlid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
>>>>>>> Stashed changes

-- ----------------------------
--  Foreign keys structure for table user_history
-- ----------------------------
ALTER TABLE "sidebar"."user_history" ADD CONSTRAINT "user_history_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "sidebar"."user_history" ADD CONSTRAINT "user_history_urlid_fkey" FOREIGN KEY ("urlid") REFERENCES "sidebar"."urls" ("urlid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

<<<<<<< Updated upstream
CREATE TRIGGER add_dancecard_notification AFTER INSERT OR UPDATE OF status ON dancecard FOR EACH ROW EXECUTE PROCEDURE dancecard_notification();
CREATE TRIGGER add_message_notification BEFORE INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE message_notification();
CREATE TRIGGER watched_table_trigger AFTER INSERT ON notifications FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
=======
-- ----------------------------
--  Foreign keys structure for table userprefs
-- ----------------------------
ALTER TABLE "sidebar"."userprefs" ADD CONSTRAINT "userprefs_userid_fkey" FOREIGN KEY ("userid") REFERENCES "sidebar"."users" ("userid") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
>>>>>>> Stashed changes
=======
CREATE TRIGGER add_dancecard_notification AFTER INSERT OR UPDATE OF status ON dancecard FOR EACH ROW EXECUTE PROCEDURE dancecard_notification();
CREATE TRIGGER add_message_notification BEFORE INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE message_notification();
CREATE TRIGGER watched_table_trigger AFTER INSERT ON notifications FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
>>>>>>> 6455084870b9e664f6cc77512fa9a4b7dbb240cd
