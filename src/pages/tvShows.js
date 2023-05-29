import React, {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/common.css"
import "../style/tvShows.css"
import saveData from "../data/saveData";
import dataSetting from "../data/dataSetting";
import CardMovie from "../component/cardMovie";
import CrePagination from "../function/updatePagination";
import Pagination from "../component/pagination"
function TVShows () {
    const {t} = useTranslation();
    const {method} = useParams();
    const [preMethod,setPreMethod] = useState("");
    const [data,setData] = useState(saveData.tvShows[method].data);
    const [inputPage,setInputPage] = useState(saveData.tvShows[method].pageNow);
    const [totalPages,setTotalPages] = useState(saveData.tvShows[method].totalPages);
    const [curPage,setCurPage] = useState(saveData.tvShows[method].pageNow);
    const [arrButPage,setArrButPage] = useState([]);
    const [indexMorePage,setIndexMorePage] = useState(saveData.popular.pageMoreNow);
    const [language,setLanguage] = useState(dataSetting.language.sign);
    useEffect(()=>{
        setData(saveData.tvShows[method].data);
        setInputPage(saveData.tvShows[method].pageNow);
        setTotalPages(saveData.tvShows[method].totalPages);
        setCurPage(saveData.tvShows[method].pageNow);
        setIndexMorePage(saveData.tvShows[method].pageMoreNow);
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[method]);

    const callAPI = (url,saveData)=>{
        const xhr = new XMLHttpRequest();
        xhr.onload = ()=>{
            if(xhr.readyState === 4 && xhr.status === 200 && xhr.responseText!=="") saveData(JSON.parse(xhr.response));
            else console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        }
        xhr.open("get",url,true);
        xhr.send();
    }
    const getData = ()=>{
        let index;
        if(dataSetting.showPagination) index = saveData.tvShows[method].pageNow;
        else index = saveData.tvShows[method].pageMoreNow;
        if(preMethod!==method) index = 1;
        if(saveData.tvShows[method].data[index-1]!==undefined&&saveData.tvShows[method].language[index-1] === language){
            if(preMethod!==method) setPreMethod(method);
            if(dataSetting.showPagination){setData(saveData.tvShows[method].data[index-1]);}
            else {setData(concatArr(index));}
        return;}
        let x;
        switch(method){
            case "popular": x ="popular";break;
            case "topRate": x="top_rated";break;
            case "airingToday": x="airing_today";break;
            case "onTheAir":x="on_the_air";break;
            default: x="popular";break;
        }
        let url = "https://api.themoviedb.org/3/tv/"+x+"?api_key="+saveData.apiKey+"&language="+language+"&page="+index;
        callAPI(url,setDataFunc);
    }
    const setDataFunc = (x)=>{
        let index;
        if(dataSetting.showPagination) index = curPage;
        else index = indexMorePage;
        if(preMethod!==method) {
            setPreMethod(method);index=1;
        }
        saveData.tvShows[method].language[index-1] = language;
        saveData.tvShows[method].totalPages = x.total_pages;
        saveData.tvShows[method].data[index-1] = x.results;
        setTotalPages(x.total_pages);
        if(dataSetting.showPagination)setData(x.results);
        else setData(concatArr(index));
    }
    const concatArr = (index)=>{
        let arr=[];
        for(let i=0;i<index;i++){
            arr=arr.concat(saveData.tvShows[method].data[i]);
        }
        return arr;
    }
    useEffect(()=>{setLanguage(dataSetting.language.sign)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataSetting.language]);
    useEffect(()=>{if(preMethod===method){getData();}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[curPage,indexMorePage,language]);
    useEffect(()=>{if(dataSetting.showPagination){CrePagination(setArrButPage,curPage,totalPages)};},[totalPages,curPage]);
    const setCurPageFunc = (x)=>{
        saveData.tvShows[method].pageNow=x;
        setCurPage(x);
        setInputPage(x);    
    }
    const setIndexMorePageFunc = (x)=>{
        saveData.tvShows[method].pageMoreNow=x;
        setIndexMorePage(x);
    }
    return (
        <div>
            <div className="commonContainer">
                <h2> {t("TV Shows")} <span>{method==="popular"?t("Popular"):method==="topRate"?t("Top Rated"):method==="airingToday"?t("Airing Today"):t("On The Air")} </span> </h2>
                <CardMovie method={"tv"} data={data}/>
                <Pagination arrButPage={arrButPage} curPage={curPage} setCurPageFunc={setCurPageFunc} totalPages={totalPages} inputPage={inputPage} setInputPage={setInputPage} indexMorePage={indexMorePage} setIndexMorePageFunc={setIndexMorePageFunc}/>
            </div>
        </div>
    );
}
export default TVShows;