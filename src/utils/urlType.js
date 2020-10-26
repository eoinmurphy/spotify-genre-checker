const urlType = (url) => {
    if (url.includes('/track/')) {
        return 'tracks'
    } else if (url.includes('/artist/')) {
        return 'artists'
    } else if (url.includes('/album/')) {
        return 'albums'
    } else 
        return 'error'
}

export default urlType;