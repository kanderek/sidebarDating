from datetime import datetime, timedelta, date
from random import randrange, choice
import csv


locations = [
    ('San Francisco', 'CA', '94111'),
    ('Oakland', 'CA', '94607'),
    ('Berkeley', 'CA', '94704'),
    ('San Jose', 'CA', '95124'),
    ('Fremont', 'CA', '94536'),
    ('San Mateo', 'CA', '94404'),
    ('Daily City', 'CA', '94015'),
    ('Belmont', 'CA', '94002'),
    ('Richmond', 'CA', '94084'),
]

_users = [
    {
        'name': 'Alex',
        'blurb': 'LA based Actor, originally SF Bay Area. Have 2 Feature films currently working on. I like Film/Theater. Family. Friends. Food. Wrestling.',
    },
    {
        'name': 'James',
        'blurb': 'Mellow, night owl, weekend hiker. Illustrator. Art, movie, and game enthusiast. Likes to do something out of the ordinary. Likes Animals.',
    },
    {
        'name': 'Hunter',
        'blurb': 'Looking for like minded chill people. Interested in clubs, parties, and meaningless shinnanigans.',
    },
    {
        'name': 'Joseph',
        'blurb': 'God, talking, playing basketball, cooking, beach, gym, smiles. I\'ve no kids, but I want some. Don\'t be shy.',
    },
    {
        'name': 'Robert',
        'blurb': 'I am an urban farmer, so that\'s pretty fun! Backpacking, climbing, running, biking, the works. I also write for a food politics journal!',
    },
    {
        'name': 'Kenny',
        'blurb': 'I\'ve always been a creator, but cinematography is my driving force. It\'s what satisfies me. I shoot horrors, westerns, and thrillers.',
    },
    {
        'name': 'Jarod',
        'blurb': 'I love the idea of creating art for a living. I\'m good at singing/songwriting/guitar/acting/improvisation/poker',
    },
    {
        'name': 'Daniel',
        'blurb': 'Things I love... Dance, Guitar, Music in general, pursuing my passions, experiencing life and a lot more',
    },
    {
        'name': 'Evan',
        'blurb': 'Things I could not live without: Food, exercise, sex, laughter, sports, friends',
    },
    {
        'name': 'Elijah',
        'blurb': 'Making the most out of my time. Kicking ass and having fun. I like to dance, giggle, wiggle, and work on my power moves while driving.',
    },
    {
        'name': 'Michael',
        'blurb': 'My interests and skills are acting, singing, swimming, running, soccer, and I love to hike and I am a gym fanatic as well.',
    },
    {
        'name': 'Benny',
        'blurb': 'Filmmaking, capoeira, oil paintings, and theatre are the aspirations on the table. Also love sunlight, food, vegetation, and chocolate',
    },
    {
        'name': 'Peter',
        'blurb': 'The activities I most like to do are acting in my free times , spending time with my dog, and watching movies.',
    },
    {
        'name': 'Shane',
        'blurb': 'I\'m little bit all over the place i draw paint sing play guitar and do graphic design i love my two dogs tomatoe and ninja!',
    },
    {
        'name': 'Luke',
        'blurb': 'Sports, Technology, Beer, Books, Fishing, Going out and having fun!',
    },
    {
        'name': 'Jackson',
        'blurb': 'Battling monsters, demons, and lethargy. Creating stuff from nowhere. Leaving footprints and taking pictures of the footprint',
    },
    {
        'name': 'Zane',
        'blurb': 'I love to have fun, work out and play baseball. I\'m quite the jokester- I\'m sure I can make you laugh. ',
    },
    {
        'name': 'Brock',
        'blurb': 'Writing, acting, kareoke(sometimes), making pizza, drinking(not too proud of that one) and negotiating',
    },
    {
        'name': 'Ryan',
        'blurb': 'Making moves, tshirt design, writing music and poetry, drawing, photography, living life how I define it',
    },
    {
        'name': 'Sebastian',
        'blurb': 'Technology - Crafting - Video Games - Using Common Sense - Rubiks Cube - Managing - Writing - Guitar - Fixing burned out light bulbs',
    },
    {
        'name': 'David',
        'blurb': 'Sports, jeopardy, chess, poker, family, friends, music, books',
    },
    {
        'name': 'Andrew',
        'blurb': 'I\'ve never been beaten at MarioKart 64. Ever. I\'m the best on Earth. It\'s a curse',
    },
]
users = zip(xrange(1, len(_users) + 1), _users)


def calculate_age(dob):
    today = date.today()
    return today.year - dob.year - (
        (today.month, today.day) < (dob.month, dob.day))


def random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)


with open('usersql.csv', 'wb') as f:
    writer = csv.writer(f)
    writer.writerow([
            'userid',
            'username',
            'password',
            'email',
            'gender',
            'dateofbirth',
            'age',
            'location_city',
            'location_state',
            'zipcode',
            'personal_blurb',
            'imageurls',
            'medimageurls',
            'smallimageurls'
        ]
    )
    for idx, user in users2:
        row = []
        name = user['name']
        blurb = user['blurb']
        dob = random_date(d1, d2)
        dobstr = dob.strftime('%m/%d/%Y')
        age = calculate_age(dob)
        loc = choice(locations)

        row.append(idx)
        row.append(name)
        row.append('1234')
        row.append('%s@gmail.com' % name.lower())
        row.append('m')
        row.append(dobstr)
        row.append(age)
        row.append(loc[0])
        row.append(loc[1])
        row.append(loc[2])
        row.append(blurb)

        for tp in ['scaled', 'med', 'small']:
            img = ','.join(['/%s_%s-%s.jpg' % (tp, idx, i) for i in range(1,4)])
            row.append('{%s}' % img)

        writer.writerow(row)


