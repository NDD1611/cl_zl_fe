export const addPathToLinkAvatar = (src) => {
    if (src) {
        return process.env.NEXT_PUBLIC_BACKEND_URL + src.replace('/public', '')
    }
    return ''
}