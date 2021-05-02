import sys
import pgn2gif
import os

filename = sys.argv[1].split('.pgn')[0]
rootDir = os.path.dirname(os.path.realpath(__file__))

creator = pgn2gif.PgnToGifCreator(
    duration=1,
    ws_color='#F4EFDC',
    bs_color='#2a62b0',
)

creator.create_gif(
    "{}/pgn/{}".format(
        rootDir,
        sys.argv[1]
    ), 
    
    out_path="{}/gif/{}.gif".format(
        rootDir,
        filename
    )
)

print('{}.gif created'.format(filename))