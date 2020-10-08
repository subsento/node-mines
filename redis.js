const redis = require("redis");
const client = redis.createClient("redis://192.168.64.3:31578");

client.on("error", function(error) {
    console.error(error);
});

client.set("key", "value", redis.print);
client.get("key", redis.print);
console.log(client.keys("*"));