from db_conn import cnx
import json

get_genres = {}

cursor = cnx.cursor(buffered=True)
sql = 'SELECT userID FROM user WHERE updated = "1"'
cursor.execute(sql)

for (userID,) in cursor:
    print(userID)
    sql = 'SELECT genres FROM user WHERE userID = %s'
    cursor = cnx.cursor(dictionary=True)
    cursor.execute(sql, (userID,))
    for genres in cursor:
        get_genres = genres['genres']
    print(get_genres)