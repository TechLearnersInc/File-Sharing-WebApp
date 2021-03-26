const { redis } = require("./redis");
const {
    GetURL,
    CreateURL,
    DeleteURL,
} = require('./actions');

module.exports = async function (context, req) {
    if (req.query.action.toLowerCase() === "create")
        context.res = await CreateURL(req, redis);
    else if (req.query.action.toLowerCase() === "get")
        context.res = await GetURL(req, redis);
    else if (req.query.action.toLowerCase() === "delete")
        context.res = await DeleteURL(req, redis);
    else
        context.res = {
            body: {
                success: false,
                error: "Request with invalid data",
            },
        };
}
