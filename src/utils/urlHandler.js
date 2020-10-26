const urlHandler = (url) => {
    let path = "spotify" + new URL(url).pathname;
    let uri = path.split("/")[2];
    return uri;
}

export default urlHandler;