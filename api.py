import urllib.request
import json

api_key="3de2caa5b3b3dc2a07650bbf658738c7"

#need to grab it from user's data and going to be make it dynamic variables
#put artist name and track title.
artist = ""
trackTitle = ""

url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key="+api_key+"&artist="+ artist +"&track="+trackTitle+"&format=json"
response = urllib.request.urlopen(url).read()
json_obj = str(response,'utf-8')
data = json.loads(json_obj)

#grabbed those data
trackTitle = data['track']['name']
trackID = data['track']['mbid']
artist = data['track']["artist"]["name"]
artistID = data['track']['artist']['mbid']
album = data['track']['album']['title']
albumID = data['track']['album']['mbid']

#need to figure it out about the genre
print(trackTitle , trackID , artist, artistID, album, albumID)

#going to put those into the database
