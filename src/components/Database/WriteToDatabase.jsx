import { useState, useEffect } from 'react' 

import { db } from '../../firebase' 
import { uid } from 'uid'  
import { set, ref } from 'firebase/database' 

const WriteToDatabase = ({data, path, uuid}) => {
    const requiredData = ['todo', 'uuid', 'name', 'address', 'location', 'city', 'description', 'rating'] 

    function hasAllKeys(obj, keys) {
        return keys.every(key => obj.hasOwnProperty(key));
    }

    // write 
    const writeToDatabase = () => {
        if (hasAllKeys(data, requiredData)) {
            console.log('Object has all necessary data.') 

            set(ref(db, `/${path}/${uuid}`), {
                todo: data.todo, 
                uuid: data.uuid, 
                name: data.name, 
                location: data.location, 
                address: data.address, 
                city: data.city, 
                description: data.description, 
                rating: data.rating, 
            }) 
            return true
        } else {
            console.log('Object is missing some necessary data.') 
            return false
        }
    }  

    return writeToDatabase()

}

export default WriteToDatabase