# Shows the top tracks for a user

import sys
import json
import spotipy
import spotipy.util as util
import db_conn
from db_conn import cnx

cursor = cnx.cursor()

sql = 'SELECT userID, accessToken FROM user WHERE updated = "0"'
cursor.execute(sql)

topFive = {}

for (userID, accessToken) in cursor:
    if accessToken:
        sp = spotipy.Spotify(auth=accessToken)
        sp.trace = False
        #ranges = ['short_term', 'medium_term', 'long_term']
        ranges = ['long_term']
        print(userID + ':')
        for range in ranges:
            print("range:", range)
            results = sp.current_user_top_tracks(time_range=range, limit=5)
            for i, item in enumerate(results['items']):
                #print(i, item['name'], '//', item['artists'][0]['name'])
                topFive[item['name']] = item['artists'][0]['name']
            print()
        print(topFive)
        jsonFive = json.dumps(topFive) 
        sql = 'UPDATE user SET topFive = %s WHERE userID = %s'
        values = (json.dumps(topFive), userID)
        cursor.execute(sql, values)
        sql = 'SELECT topFive FROM user WHERE userID = %s'
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(sql, (userID,))
        for topFive in cursor:
            #print(topFive)
            topFive = topFive['topFive']
            topFive = json.loads(topFive)
            
            #get back to original mapping/order
            original_five = dict()
            for key, value in topFive.items():
                original_five.setdefault(value, list()).append(key) 
            print(original_five)
            
    else:
        print("Can't get token for", userID)