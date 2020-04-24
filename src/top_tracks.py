# Shows the top tracks for a user

import sys
import json
import spotipy
import spotipy.util as util
#import db_conn
from db_conn import cnx

topFive = {}
artist_ids = []
genres = {}

cursor = cnx.cursor(buffered=True)
sql = 'SELECT userID, accessToken FROM user WHERE updated = "0"'
cursor.execute(sql)


for (userID, accessToken) in cursor:
    if accessToken:
        sp = spotipy.Spotify(auth=accessToken)
        sp.trace = False
        #ranges = ['short_term', 'medium_term', 'long_term']
        ranges = ['long_term']
        print(userID + ':')
        for range in ranges:
            print("range:", range)
            # get top five tracks for the current user
            top_five_results = sp.current_user_top_tracks(time_range=range, limit=5)
            for i, item in enumerate(top_five_results['items']):
                #print(i, item['name'], '//', item['artists'][0]['name'])
                topFive[item['artists'][0]['name']] = item['name']

            # get top 50 tracks and their artist ids
            results = sp.current_user_top_tracks(time_range=range, limit = 50)
            for i, item in enumerate(results['items']):
                artist_ids.append(item['artists'][0]['id'])
            print()
        # get the genres of each of the user's top 50 artists
        artists = sp.artists(artist_ids)
        for i, item in enumerate(artists['artists']):
            genres[item['name']] = item['genres']
        
        # update current user's top five tracks
        sql = 'UPDATE user SET topFive = %s WHERE userID = %s'
        values = (json.dumps(topFive), userID)
        cursor.execute(sql, values)
        cnx.commit()
        
        # update current user's top 50 genres
        sql = 'UPDATE user SET genres = %s WHERE userID = %s'
        values = (json.dumps(genres), userID)
        cursor.execute(sql, values)
        cnx.commit()

        # retrieve current user's top 50 genres
        #sql = 'SELECT genres FROM user WHERE userID = %s'
        #cursor = cnx.cursor(dictionary=True)
        #cursor.execute(sql, (userID,))
        #for genres in cursor:
        #    genres = genres['genres']
        #    genres = json.loads(genres)
            
        
        
        # retrieve top five tracks
        #sql = 'SELECT topFive FROM user WHERE userID = %s'
        #cursor = cnx.cursor(dictionary=True)
        #cursor.execute(sql, (userID,))
        #for topFive in cursor:
        #    topFive = topFive['topFive']
        #    topFive = json.loads(topFive)
        #    
        #    #get back to original mapping/order
        #    original_five = dict()
        #    for key, value in topFive.items():
        #        original_five.setdefault(value, list()).append(key) 
        #    print(original_five)
        
        # set updated value to 1 to signal that user is fully updated
        sql = 'UPDATE user SET updated = "1" WHERE userID = %s'
        cursor = cnx.cursor()
        cursor.execute(sql, (userID,))
        cnx.commit()
        print(f'user {userID} updated value is now 1')
        
    else:
        print("Can't get token for", userID)