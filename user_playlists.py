# shows a user's playlists

import sys
import spotipy
import spotipy.util as util
import json
import db_conn
from db_conn import cnx

#vr7wzjpfxp2bdgsbd63ewwaub
def show_tracks(tracks,sp1):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        artist = track['artists'][0]['name']
        trackTitle = track['name']
        searchResult = sp1.search(q='track:' + trackTitle, type='track', limit=50)
        print()
        for i in range(0,len(searchResult['tracks']['items'])):
            for y in range(0,len(searchResult['tracks']['items'][i]['album']['artists'])):
                if searchResult['tracks']['items'][i]['album']['artists'][y]['name'] == artist:
                    #artist mbid
                    print(searchResult['tracks']['items'][i]['album']['artists'][y]['id'])
                    #artist name
                    print(searchResult['tracks']['items'][i]['album']['artists'][y]['name'])
                    #album name
                    print(searchResult['tracks']['items'][i]['album']['name'])
                    #album uri need to use greb later
                    print(searchResult['tracks']['items'][i]['album']['uri'])
                    #track name
                    print(searchResult['tracks']['items'][i]['name'])
                    #track id
                    print(searchResult['tracks']['items'][i]['id'])
                    print()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        username = sys.argv[1]
    else:
        print("Whoops, need your username!")
        print("usage: python user_playlists.py [username]")
        sys.exit()

    # below line provides access token using authorization code flow, but hopefully we can repurpose (with correct scope) from iOS end
    token = util.prompt_for_user_token(username)

    if token:
        sp = spotipy.Spotify(auth=token)
        playlists = sp.user_playlists(username)
        for playlist in playlists['items']:
            if playlist['owner']['id'] == username:
                print()
                print(playlist['name'])
                print ('  total tracks', playlist['tracks']['total'])
                results = sp.playlist(playlist['id'], fields="tracks,next")
                tracks = results['tracks']
                show_tracks(tracks,sp)
                while tracks['next']:
                    tracks = sp.next(tracks)
                    show_tracks(tracks,sp)
    else:
        print("Can't get token for", username)
