import pika, json
from logging import getLogger

from gridfs import GridFS

log = getLogger(__name__)


def upload(f, fs: GridFS, channel, access):
    try:
        # uploading to mongodb
        fid = fs.put(f,filename=f.filename, contentType=f.content_type, file_image_url='yo.com')
    except Exception as err:
        log.exception(err)
        return "internal server error", 500
    # adding message to rabbitmq
    message = {
        "video_fid": str(fid),
        "mp3_fid": None,
        'username': access['username']
    }
    try:
        # exchange =""; means it wil use default exchange method for routing
        # default is used for simple applications, in this case routing_key decides in which queue message should go
        channel.basic_publish(
            exchange="",
            routing_key='video',
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
            )
            # it keeps our queue data safe, even if pod restarts
        )

    except Exception as e:
        fs.delete(fid)
        log.exception(e)
        return "internal server error", 500
        # in case of heavy load if multiple replica of consumer is listening t same queue then rabbitMQ queue will
        # let consumer, consume messages in round-robin manner automatically.

