import sys
import pgn2gif

filename = sys.argv[1].split('pgn/')[1].split('.pgn')[0]

creator = pgn2gif.PgnToGifCreator(
    duration=1,
    ws_color='#ffffff',
    bs_color='#769656',
)

creator.create_gif(
    sys.argv[1], 
    out_path="./gif/{}.gif".format(filename)
)

print('{}.gif created'.format(filename))