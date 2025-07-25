export let USERS = {};
export let room_info = {
    "asdf": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
export let room_status = {
    "asdf": {
        "askljfowij": [1, 2],
        "asdfasdfasdf": [2, 4],
        "draw": 1
    }
}
export let rooms = [];

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
    } while (rooms.some(room => room === result));
    rooms.push(result);
    room_info[result] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    return result
}