from db_conn import cnx
import json

dicts = []
matches = []
user_matches = []
userIDs = []

while True:
    cursor = cnx.cursor(buffered=True)
    sql = 'UPDATE user SET updated = "1"'
    cursor.execute(sql)
    sql = 'SELECT userID FROM user WHERE updated = "1"'
    cursor.execute(sql)
    users = 0
    for (userID,) in cursor:
        users += 1
        userIDs.append(userID)
        genres = {}
        get_genres = {}
        genres['userID'] = userID
        print(userID)
        sql = 'SELECT genres FROM user WHERE userID = %s'
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(sql, (userID,))
        for g in cursor:
            get_genres = g['genres']
            get_genres = json.loads(get_genres)
            genres.update(get_genres)
        dicts.append(genres)
    if users <= 1:
        print('Requires at least two users to attempt matching')
        break
    #print(dicts)

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
    print(matches)
    
    #update MySQL to reflect already matched users
    sql = 'UPDATE user SET updated = "2" WHERE userID = %s'
    cursor.execute(sql, (userIDs[0],))
    cnx.commit()

    # store matches in list
    for tup in matches:
        if tup[0] > 0 or tup[1] > 5:
            user_matches.append(tup[2])
    # update mysql db with list of matches
    sql = 'UPDATE user SET matches = COALESCE(JSON_MERGE_PRESERVE(%s, JSON_SET(matches, "$", %s)), JSON_ARRAY("[]")) WHERE userID = %s'
    cursor.execute(sql, (json.dumps(userIDs[0]), json.dumps(user_matches), userIDs[0]))
    cnx.commit()
    for user in user_matches:
        sql = 'UPDATE user SET matches = COALESCE(JSON_MERGE_PRESERVE(%s, JSON_SET(matches, "$", %s)), JSON_ARRAY("[]")) WHERE userID = %s'
        cursor.execute(sql, (json.dumps(user), json.dumps(userIDs[0]), user))
        cnx.commit()
    userIDs.clear()
    matches.clear()
    dicts.clear()
    

    

    
# FIGURE OUT HOW TO MATCH MULTIPLE USERS, NOT JUST TWO




