# shows a user's playlists

import sys
import spotipy
import spotipy.util as util
import db_conn
from db_conn import cnx


def show_tracks(tracks):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        print("   %d %32.32s %s" % (i, track['artists'][0]['name'],
            track['name']))


cursor = cnx.cursor()
sql = 'SELECT userID, accessToken FROM user WHERE updated = "0"'
cursor.execute(sql)
    
# below line provides access token using authorization code flow, but hopefully we can repurpose (with correct scope) from iOS end
#token = 'BQAdnWZVMYIWIeSBZdUsgnQ_Kn-TLt6lXYH-EtAMH-r5aiaIV3R-o4eS0sJJUKbGMalaty3AnrpV4BGJKUhHXX26m39bkf8icGPJuVNUrNphYj0zU_VK0bFBvWd4B0YYDrfcadecDM-JTSU_hS9sZeWKsbe_vUVZkhw'
for(userID, accessToken) in cursor:
    if accessToken:
        sp = spotipy.Spotify(auth=accessToken)
        playlists = sp.user_playlists(userID)
        for playlist in playlists['items']:
            if playlist['owner']['id'] == userID:
                print()
                print(playlist['name'])
                print ('  total tracks', playlist['tracks']['total'])
                results = sp.playlist(playlist['id'],
                    fields="tracks,next")
                tracks = results['tracks']
                show_tracks(tracks)
                while tracks['next']:
                    tracks = sp.next(tracks)
                    show_tracks(tracks)
    else:
        print("Can't get token for", userID)