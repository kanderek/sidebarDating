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

CREATE SCHEMA sidebar;


ALTER SCHEMA sidebar OWNER TO sidebar;

--
-- Name: SCHEMA sidebar; Type: COMMENT; Schema: -; Owner: sidebar
--

COMMENT ON SCHEMA sidebar IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = sidebar, pg_catalog;

--
-- Name: check_mutual(integer, integer); Type: FUNCTION; Schema: sidebar; Owner: sidebar
--

CREATE FUNCTION check_mutual(userid1 integer, userid2 integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
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
$_$;


ALTER FUNCTION sidebar.check_mutual(userid1 integer, userid2 integer) OWNER TO sidebar;

--
-- Name: notify_trigger(); Type: FUNCTION; Schema: sidebar; Owner: sidebar
--

CREATE FUNCTION notify_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION sidebar.notify_trigger() OWNER TO sidebar;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: dancecard; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--

CREATE TABLE dancecard (
    userid integer NOT NULL,
    partnerid integer NOT NULL,
    status character varying(10),
    mutual boolean DEFAULT false,
    updatetime timestamp without time zone
);


ALTER TABLE sidebar.dancecard OWNER TO sidebar;

--
-- Name: messages; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--

CREATE TABLE messages (
    senderid integer NOT NULL,
    receiverid integer NOT NULL,
    message text NOT NULL,
    sendtime timestamp without time zone NOT NULL
);


ALTER TABLE sidebar.messages OWNER TO sidebar;

--
-- Name: notifications; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--

CREATE TABLE notifications (
    notificationid integer NOT NULL,
    userid integer,
    about_userid integer,
    message character varying(140) NOT NULL,
    action_time timestamp without time zone,
    type character varying(10),
    subtype character varying(10),
    status character varying(10) DEFAULT 'unread'::character varying
);


ALTER TABLE sidebar.notifications OWNER TO sidebar;

--
-- Name: notifications_notificationid_seq; Type: SEQUENCE; Schema: sidebar; Owner: sidebar
--

CREATE SEQUENCE notifications_notificationid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sidebar.notifications_notificationid_seq OWNER TO sidebar;

--
-- Name: notifications_notificationid_seq; Type: SEQUENCE OWNED BY; Schema: sidebar; Owner: sidebar
--

ALTER SEQUENCE notifications_notificationid_seq OWNED BY notifications.notificationid;


--
-- Name: url_categories; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--

CREATE TABLE url_categories (
    urlid integer NOT NULL,
    level1 character varying(40) NOT NULL,
    level2 character varying(40) NOT NULL,
    level3 character varying(40) NOT NULL,
    level4 character varying(40),
    level5 character varying(40),
    score numeric(6,6)
);


ALTER TABLE sidebar.url_categories OWNER TO sidebar;

--
-- Name: urls; Type: TABLE; Schema: sidebar; Owner: sidebar; Tablespace:
--

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

