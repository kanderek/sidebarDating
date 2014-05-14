DROP FUNCTION IF EXISTS dancecard_notification() CASCADE;

CREATE FUNCTION dancecard_notification() RETURNS TRIGGER AS $$
DECLARE
    -- name varchar := SELECT username FROM users WHERE userid = NEW.userid;
    self_name varchar(30);
    partner_name varchar(30);
    self_message varchar := '';
    partner_message varchar := '';
    mutualVar boolean := 'false';
    status_check varchar;
    subTypeVar varchar(10);

BEGIN
    SELECT INTO self_name username FROM users WHERE userid = NEW.userid;
    SELECT INTO partner_name username FROM users WHERE userid = NEW.partnerid;
    SELECT INTO status_check status FROM dancecard WHERE userid = NEW.partnerid AND partnerid = NEW.userid;
    -- SELECT INTO removal_message constructRemovalMessage(NEW.userid, NEW.partnerid);

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

    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE' AND NEW.status = 'added') THEN
        IF (mutualVar) THEN
            partner_message := self_name || ' added you back';
            self_message := 'You have also added ' || partner_name || ' to your dancecard';
            subTypeVar := 'mutual';
        ELSE
            partner_message := self_name || ' added you to their dancecard';
            self_message := 'You added ' || partner_name || ' to your dancecard';
            subTypeVar := 'added';
        END IF;
    END IF;

    IF (TG_OP = 'UPDATE' AND NEW.status = 'removed') THEN
        partner_message := self_name || ' removed you from their dancecard';
        self_message := 'You removed ' || partner_name || ' from your dancecard';
        subTypeVar := 'removed';
    END IF;

    INSERT INTO notifications (userid, about_userid, message, extra_message, action_time, type, subtype)
        VALUES (NEW.userid, NEW.partnerid, self_message, '', CURRENT_TIMESTAMP, 'dancecard', subTypeVar);

    INSERT INTO notifications (userid, about_userid, message, extra_message, action_time, type, subtype)
        VALUES (NEW.partnerid, NEW.userid, partner_message , NEW.user_reason , CURRENT_TIMESTAMP, 'dancecard', subTypeVar);

    RETURN NEW;
END $$ LANGUAGE 'plpgsql';

CREATE TRIGGER add_dancecard_notification AFTER INSERT OR UPDATE OF status ON "dancecard" FOR EACH ROW EXECUTE PROCEDURE dancecard_notification();