import urllib.request
import json
import db_conn
from db_conn import cnx

cursor = cnx.cursor()

api_key= "3de2caa5b3b3dc2a07650bbf658738c7"

#need to grab it from user's data and going to be make it dynamic variables
#put artist name and track title.

#if they have space between their name or trackTitle, then put %20 instaed of space
#for example "post%20malone"
artist_input = "justin%20bieber"
trackTitle_input = "baby"

#gettrack Info
url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key="+api_key+"&artist="+ artist_input +"&track="+trackTitle_input+"&format=json"
response = urllib.request.urlopen(url).read()
json_obj = str(response,'utf-8')
data = json.loads(json_obj)
track_title = data['track']['name']
if 'mbid' in data['track']:
    track_ID = data['track']['mbid']
else:
    track_ID = "null"

if not data['track']['toptags']['tag'] :
    tag0 = 'null';
    tag1 = 'null';
    tag2 = 'null';
    tag3 = 'null';
    tag4 = 'null';
else:
    tag0=data['track']['toptags']['tag'][0]['name']
    tag1=data['track']['toptags']['tag'][1]['name']
    tag2=data['track']['toptags']['tag'][2]['name']
    tag3=data['track']['toptags']['tag'][3]['name']
    tag4=data['track']['toptags']['tag'][4]['name']

if 'album' in data['track']:
    album_ID = data['track']['album']['mbid']
    album_title = data['track']['album']['title']
else:
    album_ID = "null"
    album_title = "null"


#getArtist Info
url_for_artist = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist_input+"&api_key="+api_key+"&format=json"
response_for_artist = urllib.request.urlopen(url_for_artist).read()
json_obj_for_artist = str(response_for_artist,'utf-8')
data_for_artist = json.loads(json_obj_for_artist)
artist_name = data_for_artist['artist']['name']
if 'mbid' in data_for_artist['artist']:
    artist_ID = data_for_artist['artist']['mbid']
else:
    artist_ID = "null"

#print out the data that I grabbed
#into the track Table
print('trackTitle: ' + track_title)
print('trackID: ' + track_ID)
print('artist: ' + artist_name)
print('artistID: ' + artist_ID)
print('album: ' + album_title)
print('album: ' + album_ID)


print(tag0 + ",  " + tag1 + ",  " + tag2 + ",  " + tag3 + ",  " + tag4)

#going to put those into the database later
sql = "INSERT INTO track (title, titlembid, artist, artistmbid, album, albummbid) VALUES (%s, %s, %s, %s, %s, %s)"
val = (track_title, track_ID, artist_name, artist_ID, album_title, album_ID)

sql2 = "INSERT INTO tag (tag1, tag2, tag3, tag4, tag5) VALUES (%s, %s, %s, %s, %s)"
val2 = (tag0, tag1, tag2, tag3, tag4)

cursor.execute(sql,val)
#cursor.execute(sql2,val2)
