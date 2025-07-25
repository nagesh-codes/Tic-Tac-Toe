export let USERS = {
    "id":"name"
};
export let room_info = {
    "asdf":{
         game_status : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         unique_id:"fdsa"
    }
};
export let room_status = {
    "asdf": {
        "askljfowij": [1, 2],
        "asdfasdfasdf": [2, 4],
        "draw": 1
    }
}
export let rooms = ["kjhdf"];

export const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result;
    const charactersLength = characters.length;
    const length = 6;
    do {
        result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (rooms.some(room => room === result))
    return result
}