export const isValidUrl = (aUrl: string) => {
    try {
        const u = new URL(aUrl)
        return ['http:', 'https:'].includes(u.protocol)
    } catch (err) {
        return false
    }
}