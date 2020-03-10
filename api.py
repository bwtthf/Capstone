import urllib.request
import json

api_key="3de2caa5b3b3dc2a07650bbf658738c7"

#need to grab it from user's data and going to be make it dynamic variables
#put artist name and track title.
#if they have space between their name or trackTitle, then put & instaed of space
#for example justin%20bieber
artist_input = "post%20malone"
trackTitle_input = "circles"

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

album_title = data['track']['album']['title']
if 'mbid' in data['track']['album']:
    album_ID = data['track']['album']['mbid']
else:
    album_ID = "null"

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
print('trackTitle: ' + track_title)
print('trackID: ' + track_ID)
print('artist: ' + artist_name)
print('artistID: ' + artist_ID)
print('album: ' +album_title)
print('album: ' + album_ID)

#going to put those into the database
