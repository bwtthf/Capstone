# reads user's saved tracks
import sys
import spotipy
import spotipy.util as util
import json
import db_conn
from db_conn import cnx

#need to put username on here
username = ""
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
                            cursor.execute(sql,val)
                            cnx.commit()
                            added = 1;
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

cnx.close()
print()
print("successfully closed a database")
