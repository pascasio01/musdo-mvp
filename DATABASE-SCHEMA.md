# MUSDO DATABASE SCHEMA

# DATABASE ENGINE

PostgreSQL

---

# TABLE: users

Stores all platform users.

Fields:
- id
- username
- email
- password_hash
- role
- avatar_url
- bio
- created_at

Roles:
- listener
- composer
- producer
- admin

---

# TABLE: songs

Stores published songs.

Fields:
- id
- title
- artist_name
- genre
- bpm
- key
- duration
- audio_url
- artwork_url
- lyrics_id
- owner_id
- created_at

---

# TABLE: demos

Private composer demos.

Fields:
- id
- title
- composer_id
- demo_url
- notes
- visibility
- created_at

Visibility:
- private
- public
- licensing_only

---

# TABLE: lyrics

Stores lyrics safely.

Fields:
- id
- title
- content
- composer_id
- timestamp_proof
- created_at

---

# TABLE: playlists

Fields:
- id
- user_id
- name
- cover_image
- created_at

---

# TABLE: playlist_songs

Relationship table.

Fields:
- id
- playlist_id
- song_id

---

# TABLE: streams

Stores all music plays.

Fields:
- id
- user_id
- song_id
- listened_seconds
- device_type
- country
- created_at

---

# TABLE: licenses

Music licensing marketplace.

Fields:
- id
- song_id
- owner_id
- license_type
- price
- status
- created_at

License Types:
- exclusive
- non-exclusive
- sync
- publishing

---

# TABLE: sales

Stores completed payments.

Fields:
- id
- buyer_id
- seller_id
- song_id
- amount
- payment_method
- created_at

---

# TABLE: followers

Social connection system.

Fields:
- id
- follower_id
- following_id
- created_at

---

# TABLE: notifications

Stores platform alerts.

Fields:
- id
- user_id
- type
- message
- is_read
- created_at

---

# FUTURE TABLES

- AI recommendations
- biometric sessions
- NFT ownership
- blockchain licenses
- creator analytics
- royalty splits

---

# SECURITY

Important:
- encrypted passwords
- secure uploads
- anti piracy protection
- private demo storage
- rights verification

---

# PLATFORM GOAL

Build the most creator-friendly music ecosystem on the internet.
