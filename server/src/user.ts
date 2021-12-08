import { User } from "./interface/user";

let users: User[] = [];

export function addUser(username, id): void {
    const user: User = {
        Id: id,
        Name: username
    };
    users.push(user);
}

export function removeUser(userName, id): void {
    const index = users.findIndex(user => user.Id === id);
    if (index !== -1) {
        users.splice(index, 1)[0];
    }
}

export function getUsers(): User[] {
    return users;
}
