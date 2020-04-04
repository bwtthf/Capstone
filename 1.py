import os
import sys
import json
import webbrowser
import spotipy
import spotipy.util as util
from json.decoder import JSONDecodeError

username = "vr7wzjpfxp2bdgsbd63ewwaub?si=BSU5NGzlQy2Ve2DLp5RhWA"

try:
    token = util.prompt_for_user_token(username)
except:
    os.remove(".cache-{username}")
    token = util.prompt_for_user_token(username)


sp = spotipy.Spotify(auth=token)

user = sp.current_user()
print(json.dumps(user, sort_keys=True, indent=4))
