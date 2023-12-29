import { ID, Query } from 'appwrite'
import  { INewUser } from '@/types';
import { account, appwriteConfig, avatars, databases } from './config';

export async function createUserAccount (user: INewUser) {
    try {
        const newAccount = await account.create(ID.unique(),
        user.email, user.password, user.name);
        if(!newAccount) throw new Error('Account already exists');
        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToBD({name: newAccount.name, email: newAccount.email, accountId: newAccount.$id, username: user.username, imageUrl: avatarUrl});
        return newUser;

    } catch (error){
        console.error(error);
        return error;
    }
}

export async function saveUserToBD (user: {name: string, email: string, accountId: string, imageUrl: URL, username: string}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        );
        return newUser;
    } catch (error) {
        console.error(error);
        return error;
      }
}

export async function signInAccount (user: {email: string, password: string})  {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function getCurrentUser () { 
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw new Error('No account found');
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],
        );
        if(!currentUser) throw new Error('No user found');
        return currentUser.documents[0];
    } catch (error) {
        console.error(error);
        return error;
    }
}