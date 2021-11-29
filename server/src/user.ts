import { User } from "./interface/user";

let users: User[] = [];

export function addUser(username, id): void {
    const user: User = { 
        Id: id,
        Name: username 
    };
    users.push(user);

    // console.log(`addUser`);
    // for (let user of users) {
    //     console.log(`${user.id}-${user.username}`);
    // }
}

export function removeUser(userName, id) {
    const index = users.findIndex(user => user.Id === id);
    if (index !== -1) {
        users.splice(index, 1)[0];
    }
    // console.log(`removeUser`);
    // for (let user of users) {
    //     console.log(`${user.id}-${user.username}`);
    // }
}

export function getUsers(): User[] {
    return users;
}
