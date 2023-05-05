/**
 * finds current users comments or any other one if you give the function the right id
 */
const findUserComments = (data, userId) => {
    const places = [data?.skateparks, data?.spots]

    let allPlaces = [] 
    if (places[0] && places[1]) allPlaces = Object.assign(places[0], places[1]) 

    const usersComments = []
    const a = allPlaces ? Object.values(allPlaces).map(place => {
        const b = place?.comments ? Object.values(place?.comments).map(comment => {
            if (comment?.user === userId) usersComments.push(comment)
        }) : null
    }) : null 


    return usersComments
}

export default findUserComments