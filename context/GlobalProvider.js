import { createContext, useContext, useEffect, useState } from "react";
import { account, databases } from "../lib/appwrite";
import appwriteConfig from "../lib/appwriteConfig";
import { Query } from "react-native-appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);


const GlobalProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        async function getUser(){
            setLoading(true);
            try{
                const currentAccount = await account.get();
                if(!currentAccount){
                    throw new Error("User not found");
                }
                const user = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.userCollectionId,
                    [Query.equal("accountId", currentAccount.$id)]
                )
                if(!user){
                    throw new Error("User not found");
                }
                setUser(user.documents[0]);
                setIsLogged(true);
            }
        catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    }
    getUser();
    
},[]);
return (
    <GlobalContext.Provider value={{isLogged, user, loading, setIsLogged, setUser}}>
        {children}
    </GlobalContext.Provider>
);
};

export default GlobalProvider;