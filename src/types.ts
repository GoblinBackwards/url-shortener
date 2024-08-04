export type FormBody = {
    url: string,
    authkey: string
}

export type DbRowAuth = {
    authkey: string
}

export type DbRowLink = {
    key: string,
    fullurl: string,
    last_accessed: number
}