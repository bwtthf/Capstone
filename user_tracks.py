# reads user's saved tracks
import sys
import spotipy
import spotipy.util as util
import json
import db_conn
from db_conn import cnx

username = "vr7wzjpfxp2bdgsbd63ewwaub"
scope = 'user-library-read'

token = util.prompt_for_user_token(username, scope)
token1 = util.prompt_for_user_token(username)

if token:
    sp = spotipy.Spotify(auth=token)
    sp1 = spotipy.Spotify(auth=token1)
    results = sp.current_user_saved_tracks()
    if not results:
        print("no saved track")
    else:
        for item in results['items']:
            track = item['track']
            #print(track['name'] + ' - ' + track['artists'][0]['name'])
            title = track['name']
            artist = track['artists'][0]['name']
            print(title)
            print(artist)
            searchResult = sp1.search(q='track:'+title, type='track', limit=50)
            
            print(json.dumps(searchResult, sort_keys=True, indent=4))
            with open("text1.txt", "a") as myfile:
                myfile.write(json.dumps(searchResult, sort_keys=True, indent=4))
else:
    print("Can't get token for", username)
