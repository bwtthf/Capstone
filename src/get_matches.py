from db_conn import cnx
import json

dicts = []
matches = []
user_matches = []
userIDs = []

cursor = cnx.cursor(buffered=True)
sql = 'UPDATE user SET updated = IF(updated = "2", "1", updated)'
cursor.execute(sql)
cursor.close()
while True:
    cursor = cnx.cursor(buffered=True)
    sql = 'SELECT userID FROM user WHERE updated = "1"'
    cursor.execute(sql)
    users = 0
    for (userID,) in cursor:
        users += 1
        userIDs.append(userID)
        genres = {}
        get_genres = {}
        genres['userID'] = userID
        
        sql = 'SELECT genres FROM user WHERE userID = %s'
        cursor = cnx.cursor(buffered=True, dictionary=True)
        cursor.execute(sql, (userID,))
        for g in cursor:
            get_genres = g['genres']
            get_genres = json.loads(get_genres)
            genres.update(get_genres)
        dicts.append(genres)
    if users <= 1:
        print('Requires at least two users to attempt matching')
        break

    for i in range(users - 1):
        matching_artists = 0
        matching_genres = []
        unique_genres = []
        # get number of matching artists
        for key in dicts[0]:
            if key in dicts[i + 1] and key != []:
                matching_artists += 1

        # add all matching genres to list
        for l in dicts[0].values():
            for item in dicts[i + 1].values():
                for genre in l:
                    if genre in item:
                        matching_genres.append(genre)

        # get all unique genre matches (no duplicates)       
        for word in matching_genres:
            if word not in unique_genres:
                unique_genres.append(word)
        num_matches = (matching_artists, len(unique_genres), userIDs[i + 1])
        matches.append(num_matches)
    
    # store matches in list
    for tup in matches:
        if tup[0] > 0 or tup[1] > 5:
            user_matches.append(tup[2])


    # get current matches from db
    cursor = cnx.cursor(buffered=True)
    sql = 'SELECT matches FROM user WHERE userID = %s'
    cursor.execute(sql, (userIDs[0],))

    for (match,) in cursor:
        if match == '{}':
            init_match = {userIDs[0] : user_matches}
            sql = 'UPDATE user SET matches = %s WHERE userID = %s'
            cursor.execute(sql, (json.dumps(init_match), userIDs[0]))
            cnx.commit()
        else:
            match = json.loads(match)
            for user in user_matches:
                sql = 'SELECT matches FROM user WHERE userID = %s'
                cursor.execute(sql, (user,))
                # update matched users' matches with original user
                for (users_match,) in cursor:
                    users_match = json.loads(users_match)
                    if userIDs[0] not in users_match[user]:
                        users_match[user].append(userIDs[0])
                        sql = 'UPDATE user SET matches = %s WHERE userID = %s'
                        cursor.execute(sql, (json.dumps(users_match), user))
                        cnx.commit()

                # update current matches with newer matches
                if user not in match[userIDs[0]]:
                    match[userIDs[0]].append(user)
                    sql = 'UPDATE user SET matches = %s WHERE userID = %s'
                    cursor.execute(sql, (json.dumps(match), userIDs[0]))
                    cnx.commit()
            
    
    #update MySQL to reflect already matched users
    sql = 'UPDATE user SET updated = "2" WHERE userID = %s'
    cursor.execute(sql, (userIDs[0],))
    cnx.commit()

    userIDs.clear()
    matches.clear()
    user_matches.clear()
    dicts.clear()
    cursor.close()
    

    

    
# FIGURE OUT HOW TO MATCH MULTIPLE USERS, NOT JUST TWO




