import config from "./appwriteConfig";
import {Client, Account, Databases, Avatars} from 'react-native-appwrite';


const client = new Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);

const databases = new Databases(client);
const avatars = new Avatars(client);


export {client, account, databases, avatars};