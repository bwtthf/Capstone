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
            artist = track['artists'][0]['name']
            trackTitle = track['name']

            searchResult = sp1.search(q='track:'+trackTitle, type='track', limit=50)
            print()
            for i in range(0,len(searchResult['tracks']['items'])):
                for y in range(0,len(searchResult['tracks']['items'][i]['album']['artists'])):
                    if searchResult['tracks']['items'][i]['album']['artists'][y]['name'] == artist:
                        #artist mbid
                        artist_ID = searchResult['tracks']['items'][i]['album']['artists'][y]['id']
                        print(searchResult['tracks']['items'][i]['album']['artists'][y]['id'])

                        #artist name
                        artist_name = searchResult['tracks']['items'][i]['album']['artists'][y]['name']
                        print(searchResult['tracks']['items'][i]['album']['artists'][y]['name'])

                        #album name
                        album_title = searchResult['tracks']['items'][i]['album']['name']
                        print(searchResult['tracks']['items'][i]['album']['name'])

                        #album uri need to use greb later
                        print(searchResult['tracks']['items'][i]['album']['uri'])

                        #track name
                        track_title = searchResult['tracks']['items'][i]['name']
                        print(searchResult['tracks']['items'][i]['name'])

                        #track id
                        trackTitle = searchResult['tracks']['items'][i]['id']
                        print(searchResult['tracks']['items'][i]['id'])

                        #print(searchResult['tracks']['items'][i]['album']['artists'][y]['name'])
            #    if searchResult['tracks']['items'][0]['album']['name'] == artist:
            #        print(searchResult['tracks']['items'][0]['album']['name'])

            #artistmbid
            #print(searchResult['tracks']['items'][0]['album']['artists'][0]['id'])
            #album name
            #print(searchResult['tracks']['items'][0]['album']['name'])
            #album mbid
            #print(searchResult['tracks']['items'][0]['album']['id'])
            #track mbid
            #print(searchResult['tracks']['items'][0]['id'])

            #if 'name' in searchResult['tracks']['items']['albums']:
            #    if searchResult['tracks']['items']['albums']['name'] == artist:
            #        print(artist)

            #with open("text1.txt", "a") as myfile:
            #    myfile.write(json.dumps(searchResult, sort_keys=True, indent=4))
else:
    print("Can't get token for", username)

print("success")
cnx.close()
