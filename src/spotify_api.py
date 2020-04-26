import db_conn
import user_playlists
from datetime import datetime
from db_conn import cnx
from user_playlists import playlists

users = []
cursor = cnx.cursor()

#current date and time
unf_now = datetime.now()
now = now.strftime("%d/%m/%Y %H:%M:%S")

sql = 'SELECT userID, accessToken FROM user WHERE date = %s'
cursor.execute(sql, now)
for userID in cursor:
    users.append(userID)




