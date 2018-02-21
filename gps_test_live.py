import argparse
import datetime
import json
import requests
from time import sleep
import time

def millisecond_timestamp(t):
    return int((datetime.datetime.utcfromtimestamp(t)-datetime.datetime.utcfromtimestamp(0)).total_seconds() * 1000)


def delay_time(line, next_line):
    print(line)
    t1 = int(line.split(" ")[0])
    print(t1)
    print(next_line)
    t2 = int(next_line.split(" ")[0])
    print(t2)
    return t2-t1


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Calponia GPS simulator')
    parser.add_argument('-g', '--gps', type=argparse.FileType('r'), required=True, dest='file',
                        help='File with GPS positions: Format=<utc> <lat> <lng><CR><LF>')
    parser.add_argument('-t', '--token', dest='token', action='store', required=True,
                        help='Token which should be used for POST request authentication')

    args = parser.parse_args()

    header = {'Authorization': args.token}

    lines = args.file.readlines()
    for cnt, line in enumerate(lines): 
        (timestamp, lat, lng) = line.split(" ")
        timestamp = int(timestamp)
        if datetime.datetime.utcfromtimestamp(timestamp).hour < 12:
            continue
        resp = requests.post(url='https://iot.calponia-bcx.de/gps',
                             json={"lat": lat, "long": lng, "timestamp": millisecond_timestamp(time.time())},
                             headers=header)
        print("Request: %s" % json.dumps({"lat": lat, "long": lng, "timestamp": millisecond_timestamp(time.time())}))

        if resp.status_code != 200 or '_id' not in json.loads(resp.text).keys():
            print("ERROR: POST to CALPONIA returned HTTP status: %s, content: %s" % (resp.status_code, resp.content))
        else:
            print("Successfully posted GPS position to CALPONIA. Response: %s" % resp.text)

        # calculate differential to next timestamp
        if cnt <= (len(lines)-1):
            d = delay_time(line, lines[cnt+1])
            print(d)
            sleep(d)
