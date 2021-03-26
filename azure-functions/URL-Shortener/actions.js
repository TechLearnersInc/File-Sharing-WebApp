const { nanoid } = require("nanoid");
const { redis } = require("./redis");

const CreateURL = async (req, redis) => {
    const URL_AS_KEY = nanoid(11);
    try {
        await redis.hset(URL_AS_KEY, 'filename', req.body.filename);
        await redis.hset(URL_AS_KEY, 'container', req.body.container);
        await redis.hset(URL_AS_KEY, 'expire', req.body.expire);
        await redis.expire(URL_AS_KEY, parseInt(req.body.expire));
        return {
            body: {
                success: true,
                url: URL_AS_KEY,
            },
        };
    } catch (error) {
        console.error(error);
        try {
            await redis.del(URL_AS_KEY);
        } catch (error) { /** */ }
        return {
            body: {
                success: false,
                error: error,
            },
        }
    }
};

const GetURL = async (req, redis) => {
    try {
        const filename = await redis.hget(req.body.url_key, 'filename');
        if (filename === null || filename === undefined)
            return {
                body: {
                    success: false,
                    error: 'URL Not Found',
                },
            }
        else
            return {
                body: {
                    success: true,
                    filename,
                    container: await redis.hget(req.body.url_key, 'container'),
                },
            }
    } catch (error) {
        console.error(error);
        return {
            body: {
                success: false,
                error: error,
            },
        }
    }
};

const DeleteURL = async (req, redis) => {
    try {
        await redis.del(req.body.url_key);
        return {
            body: {
                success: true,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            body: {
                success: false,
                error: error,
            },
        };
    }
};

module.exports = {
    CreateURL,
    GetURL,
    DeleteURL,
};
