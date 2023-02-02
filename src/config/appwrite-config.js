import { Account, Client, Databases, Permission, Role } from "appwrite";
// import { AES } from "crypto-js";

const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const DB_ID = process.env.REACT_APP_APPWRITE_DB_ID;
const COLLECTION_ID = process.env.REACT_APP_APPWRITE_COLLECTION_ID;

export async function googleLogin() {
  // on success, redirect to home page

  const promise = account.createOAuth2Session(
    "google",
    window.location.origin,
    window.location.origin + "/login"
  );
  return promise;
}

export async function magicURLLogin(email) {
  const promise = account.createMagicURLSession(
    "unique()",
    email,
    window.location.origin + "/magicURL"
  );
  return promise;
}

export async function magicURLLoginCallback(userId, secret) {
  const promise = account.updateMagicURLSession(userId, secret);
  return promise;
}

export async function getAccount() {
  const promise = account.get();
  return promise;
}

export async function logout() {
  const promise = account.deleteSession("current");
  return promise;
}

export async function writeTodoData(userId, todo) {
  // eslint-disable-next-line no-unused-vars
  // let encryptedTodo = AES.encrypt(todo.title, process.env.REACT_APP_SECRET_KEY);
  const d = new Date();
  const promise = databases.createDocument(
    DB_ID,
    COLLECTION_ID,
    "unique()",
    {
      title: todo.title,
      completed: false,
      date: d.toUTCString(),
      reminderDate: todo.reminderDate,
    },
    // only the current user can read and write to this document
    [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ]
  );

  promise
    .then((response) => {
      console.log("Document created successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getTodoData() {
  const promise = databases.listDocuments(DB_ID, COLLECTION_ID);
  return promise;
}

export function removeTodo(TodoID) {
  try {
    // eslint-disable-next-line no-unused-vars
    const promise = databases.deleteDocument(DB_ID, COLLECTION_ID, TodoID);
    console.log("Document removed successfully");
  } catch (e) {
    console.error("Error removing document: ", e);
  }
}

export function updateTodo(TodoID, todo) {
  try {
    // eslint-disable-next-line no-unused-vars
    const promise = databases.updateDocument(DB_ID, COLLECTION_ID, TodoID, {
      title: todo.title,
    });
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

export function updateTodoStatus(TodoID, status) {
  try {
    // eslint-disable-next-line no-unused-vars
    const promise = databases.updateDocument(DB_ID, COLLECTION_ID, TodoID, {
      completed: status,
    });
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

// Appwrite Realtime Database Subscription
export async function todoSubscribe(callback) {
  return client.subscribe(
    `databases.${DB_ID}.collections.${COLLECTION_ID}.documents`,
    callback
  );
}
