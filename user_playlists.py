# shows a user's playlists

import sys
import spotipy
import spotipy.util as util
import json
import db_conn
from db_conn import cnx
import mysql.connector


def show_tracks(tracks,sp1):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        artist = track['artists'][0]['name']
        trackTitle = track['name']
        searchResult = sp1.search(q='track:' + trackTitle, type='track', limit=50)
        searchResultArtist = sp1.search(artist,1,0, type="artist")

        added = 0
        for i in range(0,len(searchResult['tracks']['items'])):
            for y in range(0,len(searchResult['tracks']['items'][i]['album']['artists'])):
                if added == 0:
                    if searchResult['tracks']['items'][i]['album']['artists'][y]['name'] == artist:
                        #artist mbid
                        artist_ID = searchResult['tracks']['items'][i]['album']['artists'][y]['id']
                        print(artist_ID)

                        #artist name
                        artist_name = searchResult['tracks']['items'][i]['album']['artists'][y]['name']
                        print(artist_name)

                        #album name
                        album_title = searchResult['tracks']['items'][i]['album']['name']
                        print(album_title)

                        #album uri need to use greb later
                        album_ID = searchResult['tracks']['items'][i]['album']['uri'].split(':')[2]
                        print(album_ID)

                        #track name
                        track_title = searchResult['tracks']['items'][i]['name']
                        print(track_title)

                        #track id
                        track_ID = searchResult['tracks']['items'][i]['id']
                        print(track_ID)
                        sql = "INSERT IGNORE INTO track (title, titlembid, artist, artistmbid, album, albummbid) VALUES (%s, %s, %s, %s, %s, %s)"
                        val = (track_title, track_ID, artist_name, artist_ID, album_title, album_ID)
                        cursor = cnx.cursor()
                        try:
                            cursor.execute(sql,val)
                        except mysql.connector.errors.IntegrityError:
                            print('duplicate error')
                        cnx.commit()
                        added = 1
                        print()

        genres = searchResultArtist['artists']['items'][0]['genres']
        print(len(genres))
        for i in range(len(genres),6):
            genres.append("Null")
        sql = "INSERT IGNORE INTO tag (artist, artistID, tag1, tag2, tag3, tag4, tag5, tag6) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        val = (artist, artist_ID, genres[0], genres[1], genres[2], genres[3],genres[4],genres[5])
        cursor = cnx.cursor()
        cursor.execute(sql,val)
        cnx.commit()




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

cnx.close()
print()
print("successfully closed a database")
