#!/bin/bash
DB="database.db"

echo "Refreshing products table..."

# Create table if not exists (including new column)
sqlite3 $DB <<EOF
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    features TEXT,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    price TEXT DEFAULT 'Free',
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived', 'coming_soon')),
    is_subproduct INTEGER DEFAULT 0,
    published INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
EOF

# Insert seed data manually since node depends on missing packages
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('Teach Anything Now', 'teach-anything-now', 'generate a bespoke podcast audio file, PPT, image and worksheet', 'Generate a bespoke podcast audio file, PPT, image and worksheet from a simple text prompt describing your lesson objective.', 'https://teachanythingnow.com', 'Subscription', 'active', 0, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('Insta Homework', 'instahw', 'create assignable homework tasks which are instantly marked by AI', 'Generate assignable homework tasks which are marked by AI. Rebranded from HW Made Simple.', 'https://instahw.com', 'Subscription', 'active', 0, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('Listening Live', 'listening-live', 'live large-text, bilingual subtitles for teachers and public speakers', 'Real-time bilingual subtitles designed for teachers to enhance accessibility and language comprehension in diverse classrooms.', 'https://listening-live.com', 'Free / Premium', 'active', 0, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('The Language Dojo', 'the-language-dojo', 'the central hub for mastering standardized tests', 'The Language Dojo is your central hub for language mastery and test preparation.', 'https://thelanguagedojo.com', 'Free / Premium', 'active', 0, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('The DALF C1 Dojo', 'the-dalf-c1-dojo', 'Master the DALF C1', 'Master the DALF C1 examination.', 'https://thedalfc1dojo.com', 'Free / Premium', 'active', 1, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('The IELTS Dojo', 'the-ielts-dojo', 'Master the IELTS', 'Master the IELTS examination.', 'https://theieltsdojo.com', 'Free / Premium', 'active', 1, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('The TOEFL Dojo', 'the-toefl-dojo', 'Master the TOEFL', 'Master the TOEFL examination.', 'https://thetoefldojo.com', 'Free / Premium', 'active', 1, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('A vs De?', 'a-vs-de', 'Flashcard game to help learn prepositions for verbs in French', 'Interactive flashcards designed to help students master the complex prepositions used with French verbs.', 'https://avsde.com', 'Free', 'active', 0, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('Le vs La?', 'le-vs-la', 'Flashcard game to help improve understanding of masculine vs feminine nouns in French', 'A fun and effective way to practice and memorize the gender of common French nouns.', 'https://levsla.com', 'Free', 'active', 0, 1);"
sqlite3 $DB "INSERT INTO products (name, slug, tagline, description, live_url, price, status, is_subproduct, published) VALUES ('No More Chinglish!', 'no-more-chinglish', 'Several games that target all the most common mistakes Chinese learners make when learning English', 'A collection of targeted educational games focused on correcting common errors made by Chinese speakers of English.', 'https://nomorechinglish.com', 'Free / Premium', 'active', 0, 1);"

echo "Done."
