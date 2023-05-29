// this function is used to save favorite movie to local storage
function SaveFavorite(setArrFavorite,id,method,poster_path,title,release_date,vote_average){
    if(id===null||poster_path===""||title===""||release_date===""||vote_average===0){return;}
    const getDataFavorite = localStorage.getItem("dataFavorite")?JSON.parse(localStorage.getItem("dataFavorite")):[];
    if(getDataFavorite.find(item=>item.id===id)){
        getDataFavorite.splice(getDataFavorite.findIndex(item=>item.id===id),1);
    }
    else{
        const time = new Date();
        const object = {
            id:id,
            method:method,
            poster_path:poster_path,
            title:title,
            release_date:release_date,
            vote_average:vote_average,
            time:time.getTime()
        }
        getDataFavorite.push(object);
    }
    setArrFavorite(getDataFavorite);
    localStorage.setItem("dataFavorite",JSON.stringify(getDataFavorite));
}
export default SaveFavorite