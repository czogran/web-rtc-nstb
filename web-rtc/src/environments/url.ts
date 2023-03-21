// const basicUrl ='192.168.1.6'
// const basicUrl ='192.168.1.58'
// const basicUrl ='10.132.176.125'
const basicUrl ='192.168.100.12'

const port =8765
const http ='http'
const ws= 'ws'
const httpUrl =  http +'://' + basicUrl +':' +port
const wsUrl =  ws +'://' + basicUrl +':' +port

export const apiUrl ={
    login: httpUrl + '/login',
    register: httpUrl + '/register',
    logout: httpUrl + '/logout',
    userData: httpUrl + '/user-data',
    userChats: httpUrl + '/user-chats',
    searchUsers: httpUrl + '/search-users',
    createChat: httpUrl + '/create-chat',
    chat: wsUrl + '/chat',
    signaling: wsUrl + '/signaling'
}